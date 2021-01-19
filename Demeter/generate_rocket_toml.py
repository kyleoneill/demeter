import string
import random
import base64


def generate_key(byte_length):
    rand_string = ''.join(random.choice(string.ascii_lowercase) for i in range(byte_length))
    string_bytes = rand_string.encode('ascii')
    base64_bytes = base64.b64encode(string_bytes)
    base64_message = base64_bytes.decode('ascii')
    return base64_message


def generate_global(handler, db_path, port, key, address):
    handler.write("[global]\n")
    handler.write(f"databases = {{database = {{url = \"{db_path}\" }}}}\n")
    handler.write(f"port = {port}\n")
    handler.write(f"secret_key = \"{key}\"\n")
    handler.write(f"address = \"{address}\"\n")
    handler.write('\n')
    return 0


def generate_development(handler):
    handler.write("[development]\n")
    handler.write("log = \"normal\"\n")
    handler.write('\n')
    return 0


def generate_staging(handler):
    handler.write("[staging]\n")
    handler.write("log = \"normal\"\n")
    handler.write('\n')
    return 0


def generate_production(handler):
    handler.write("[production]\n")
    handler.write("log = \"critical\"\n")
    return 0


def main():
    file_name = "Rocket.toml"
    key = generate_key(32)

    db_path = "./demeterDB.sqlite"
    port = 9000
    address = "127.0.0.1"
    
    handler = open(file_name, "w", encoding='utf-8')
    generate_global(handler, db_path, port, key, address)
    generate_development(handler)
    generate_staging(handler)
    generate_production(handler)
    handler.close()
    return 0


main()
