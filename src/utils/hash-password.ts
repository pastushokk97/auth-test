import * as bcrypt from 'bcrypt';

const HASH_SALT = process.env.HASH_SALT;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, HASH_SALT);
}
