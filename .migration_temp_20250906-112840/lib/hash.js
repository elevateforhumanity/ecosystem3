import bcrypt from 'bcryptjs'
export const hash = async (s) => bcrypt.hash(s, 10)
export const compare = async (s, h) => bcrypt.compare(s, h)
