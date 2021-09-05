using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using Demeter.Types;
using Demeter.Models;

namespace Demeter.Controllers
{

    public class RequestUser
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        private static bool VerifyPassword(string password, string salt, string inputPassword)
        {
            var hashedInput = salt + inputPassword;
            return BCrypt.Net.BCrypt.Verify(hashedInput, password);
        }

        [HttpGet]
        public IActionResult Get([FromQuery(Name = "username")] string username)
        {
            if (username == null)
                return BadRequest("Query parameter 'username' is required.");
            User user = Database.GetUserByUsername(username);
            if (user != null)
                // TODO - this should not return a User, the salt is internal information that shouldn't be returned.
                return Ok(user);
            return NotFound($"No user found with username '{username}'.");
        }

        [HttpPost]
        public IActionResult Post(RequestUser requestUser)
        {
            if (requestUser.username == null)
                return BadRequest("Body parameter 'username' is required.");
            if (requestUser.password == null)
                return BadRequest("Body parameter 'password' is required.");
            var salt = Guid.NewGuid().ToString();
            var saltedPassword = salt + requestUser.password;
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(saltedPassword);
            var user = new User
            {
                Username = requestUser.username,
                Password = hashedPassword,
                Salt = salt,
                IsAdmin = false,
                FavoriteRecipes = new List<string>()
            };
            var result = Database.InsertUser(user);
            return result switch
            {
                DbResult.OperationAccepted => Accepted(),
                DbResult.ResourceAlreadyExists => Conflict($"A user with username '{requestUser.username}' already exists."),
                _ => StatusCode(500),
            };
        }

        [HttpPost]
        [Route("/user/login")]
        public IActionResult Login(RequestUser requestUser)
        {
            User user = Database.GetUserByUsername(requestUser.username);
            if (user == null)
                return Unauthorized("Username or password is incorrect.");
            bool passwordVerified = VerifyPassword(user.Password, user.Salt, requestUser.password);
            if (passwordVerified)
                return Ok("Correct password");
            else
                return Unauthorized("Username or password is incorrect.");

        }

        [HttpPut]
        [Route("/user/password")]
        public IActionResult UpdatePassword(RequestUser requestUser, [FromQuery(Name = "new-password")] string newPassword)
        {
            if (newPassword == null)
            {
                return BadRequest("Query parameter 'new-password' is required.");
            }
            User user = Database.GetUserByUsername(requestUser.username);
            if (user == null)
            {
                return Unauthorized("Username or password is incorrect.");
            }
            bool passwordVerified = VerifyPassword(user.Password, user.Salt, requestUser.password);
            if (passwordVerified)
            {
                var salt = Guid.NewGuid().ToString();
                var saltedPassword = salt + newPassword;
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(saltedPassword);
                var result = Database.ChangePassword(user.Username, hashedPassword, salt);
                return result switch
                {
                    DbResult.OperationAccepted => Ok(),
                    _ => StatusCode(500)
                };
            }
            else
                return Unauthorized("Username or password is incorrect.");
        }

        [HttpDelete]
        public IActionResult Delete([FromQuery(Name = "username")] string username)
        {
            if (username == null)
                return BadRequest("Query parameter 'username' is required.");
            var result = Database.DeleteUser(username);
            return result switch
            {
                DbResult.OperationAccepted => Ok(),
                DbResult.ResourceNotFound => NotFound($"A user with username '{username}' does not exist."),
                _ => StatusCode(500)
            };
        }
    }
}
