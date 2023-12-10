import bcryptjs from 'bcryptjs';

const password_crypt =async (password) => {
  const sa =  await bcryptjs.genSalt(10);
  const hashedpassword = bcryptjs.hash(password, sa);
  return hashedpassword;

}
const password_compare = async (password, hashedpassword) => {
  const compare = await bcryptjs.compare(password, hashedpassword)
  return compare
}


export {password_crypt,password_compare}