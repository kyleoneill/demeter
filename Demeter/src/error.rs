use rocket::{
    http::{ContentType, Status},
    Request,
    Response,
    response::Responder
};

#[derive(Debug)]
pub enum Error {
    ResourceAlreadyExists,
    BadCredentials,
    NotFound,
    GenericError
}

impl <'r> Responder<'r> for Error {
    fn respond_to(self, _request: &Request) -> rocket::response::Result<'r> {
        Ok(
            Response::build().status(
                match self {
                    Error::ResourceAlreadyExists => Status::ImUsed,
                    _ => Status::InternalServerError
                }
            )
            .header(ContentType::Plain)
            .sized_body(std::io::Cursor::new(match self {
                Error::ResourceAlreadyExists => "Resource already exists",
                Error::BadCredentials => "Username or password is incorrect",
                Error::NotFound => "Resource not found",
                _ => "Internal server error"
            }))
            .finalize()
        )
    }
}