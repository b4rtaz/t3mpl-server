import crypto from 'crypto';

export function comparePassword(plainPassword: string, encryptedPassword: string): boolean {
	const hash = crypto.createHash('sha256').update(plainPassword, 'utf8').digest('hex');
	return hash === encryptedPassword;
}
