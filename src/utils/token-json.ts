import jsonwebtoken from 'jsonwebtoken';

const create_token = async (email, id,admin="") => {
  
  const token = jsonwebtoken.sign({ email, id,admin }, process.env.JWT_SECRET, {expiresIn: '48h'});
  return token


}


export {create_token}