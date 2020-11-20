const crypto = require('crypto');
const fs = require('fs');

function randomKey() {
	return crypto.randomBytes(48).toString('hex');
}

if (process.argv.length !== 3) {
	console.info('Usage: node random-session-keys.js ../path/to/configuration.json');
	return;
}

const configPath = process.argv[2];
const configRaw = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configRaw);

const key1 = randomKey();
const key2 = randomKey();
const key3 = randomKey();
config.session.secretKeys.length = 0;
config.session.secretKeys.push(key1);
config.session.secretKeys.push(key2);
config.session.secretKeys.push(key3);

const newConfigRaw = JSON.stringify(config, null, '\t');
fs.writeFileSync(configPath, Buffer.from(newConfigRaw, 'utf-8'));

console.info('Session keys generated.');
console.info(key1);
console.info(key2);
console.info(key3);
