const config = new Map();

config.set('port', 5000);
config.set('dbUrl', 'mongodb+srv://mikalai-kazlou:Uu8rYNJbgMWpApXp@cluster0.caeg4ek.mongodb.net/?retryWrites=true&w=majority');
config.set('jwtSecretKey', 'jwt-secret-key-rs-school');
config.set('tokenExpiresIn', '1h');

export default config;