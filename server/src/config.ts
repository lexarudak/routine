const config = new Map();

config.set('port', 5100);
config.set('dbUrl', 'mongodb+srv://mikalai-kazlou:Uu8rYNJbgMWpApXp@cluster0.caeg4ek.mongodb.net/?retryWrites=true&w=majority');
config.set('allowedOrigins', ['http://localhost:8080', 'https://lexarudak-rsclone.netlify.app']);
config.set('jwtSecretKey', 'jwt-secret-key-rs-school');
config.set('tokenExpiresInShort', 86400e3);
config.set('tokenExpiresInLong', 604800e3);

export default config;
