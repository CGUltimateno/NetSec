const crypto = require('crypto');

function generateSalt() {
  return crypto.randomBytes(16).toString('hex'); // Generate random 16-byte salt
}

function deriveKey(secretKey, secretIV) {
  const salt = generateSalt(); // Generate a new salt for each encryption
  const derivedKey = crypto.pbkdf2Sync(secretKey, salt, 10000, 32, 'sha512'); // Use PBKDF2 for key derivation
  const derivedIV = crypto.pbkdf2Sync(secretIV, salt, 10000, 16, 'sha512'); // Derive IV from secretIV and salt
  return { salt, derivedKey, derivedIV };
}