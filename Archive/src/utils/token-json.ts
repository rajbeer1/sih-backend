import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config';
class JWT {
  public create_token = async (email: string, id: string, admin = '') => {
    const token = jsonwebtoken.sign({ email, id, admin }, config.JWT_SECRET, {
      expiresIn: '48h',
    });
    return token;
  }; 
}

export const tokens: JWT = new JWT();
