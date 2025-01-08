import * as bcrypt from 'bcrypt';

export const encryptPassword = async (plain_text: string) => {
    return await bcrypt.hash(plain_text, 10);
}