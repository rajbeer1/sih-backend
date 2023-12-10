import jsonwebtoken from 'jsonwebtoken';

const create_token = async (email) => {
  
  const token = jsonwebtoken.sign(email, process.env.JWT_SECRET, {  });
  return token


}


export {create_token}