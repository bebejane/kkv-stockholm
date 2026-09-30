import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const KEY_ENV = 'SPIRIS_TOKEN_ENCRYPTION_KEY';
const PREFIX = 'enc:v1:';

function encryptionKey(): Buffer | null {
	const secret = process.env[KEY_ENV];
	if (!secret) return null;
	// Derive a fixed 32-byte key from the configured secret.
	return createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a token for storage when `SPIRIS_TOKEN_ENCRYPTION_KEY` is set;
 * otherwise returns it unchanged (the Turso DB is access-controlled like the
 * old env var). Values written with a key are self-describing via the prefix,
 * so plaintext values stay readable if a key is added later.
 */
export function encrypt(value: string): string {
	const key = encryptionKey();
	if (!key) return value;

	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();

	return `${PREFIX}${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decrypt(value: string): string {
	if (!value.startsWith(PREFIX)) return value;

	const key = encryptionKey();
	if (!key) throw new Error(`${KEY_ENV} is required to decrypt the stored token`);

	const [iv, tag, data] = value.slice(PREFIX.length).split(':');
	const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
	decipher.setAuthTag(Buffer.from(tag, 'base64'));

	return Buffer.concat([
		decipher.update(Buffer.from(data, 'base64')),
		decipher.final(),
	]).toString('utf8');
}
