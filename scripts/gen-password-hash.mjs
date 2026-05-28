#!/usr/bin/env node
/**
 * Generates an ADMIN_PASSWORD_HASH value for .env.local
 * Uses Node.js built-in scrypt — no extra dependencies.
 *
 * Usage:
 *   node scripts/gen-password-hash.mjs
 *
 * Then in .env.local:
 *   ADMIN_PASSWORD_HASH=<output>
 *   # Remove ADMIN_PASSWORD once ADMIN_PASSWORD_HASH is set
 */

import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
});

rl.question('New admin password: ', (password) => {
  rl.close();

  if (!password || password.length < 12) {
    console.error('Error: password must be at least 12 characters.');
    process.exit(1);
  }

  const salt = crypto.randomBytes(16);

  crypto.scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) throw err;

    const hash = `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
    console.log('\n─────────────────────────────────────────');
    console.log('Add to .env.local:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('─────────────────────────────────────────');
    console.log('Then remove ADMIN_PASSWORD from .env.local.\n');
  });
});
