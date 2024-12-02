import { Admin } from '../models/admin';
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import { tokens, Pass } from '../utils';
import * as EmailValidator from 'email-validator';
import { UserPayload } from '../middleware/isloggedin';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config';
import { transporter } from '../utils/email';
import { Invitation } from '../models/invitations';
import { Datainput } from '../models/data';

export const adminlogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    if (!EmailValidator.validate(data.email)) {
      return res.status(400).json({
        message: 'email is invalid',
      });
    }
    const find = await Admin.findOne({ email: data.email });

    if (!find) {
      return res.status(400).json({
        message: "Admin doesn't exist",
      });
    }

    const compare = await Pass.password_compare(data.password, find.password);

    if (!compare) {
      return res.status(400).json({
        message: "password doesn't match",
      });
    }
    const token = await tokens.create_token(data.email, find.name);

    res.set('Authorization', `Bearer ${token}`);
    return res.json({
      data: find,
      token: token,
    }).status(200);
  } catch (err) {
    next(err);
  }
};

export const adminsignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body as any;
    const already = await Admin.findOne({ email });
    if (!EmailValidator.validate(email)) {
      return res.status(400).json({
        message: 'email is invalid',
      });
    }
    if (already) {
      return res.status(400).json({ message: 'Admin already exits' });
    }
    const finuser = await User.findOne({ email });
    if (finuser) {
      return res.status(400).json({ message: 'email belongs to a Miner' });
    }
    const hashedpassword = await Pass.password_crypt(password);
    const added = new Admin({ email, name, password: hashedpassword });
    const saved = await added.save();
    const token = await tokens.create_token(email, name);
    res.set('Authorization', `Bearer ${token}`);
    res.json({
      data: saved,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export const admininvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const user = req.user as UserPayload;

    const { email } = req.body as any;

    const admin = user.email;
    const find = await Admin.findOne({ email: admin });

    if (!find) {
      return res.status(400).json({
        message: 'Admin does not exist',
      });
    }
    const userexists = await User.findOne({ email })
  
    if (userexists) {
    return res.status(400).json({
      message: 'User already exists',
    });
    }
    const invittation = new Invitation({
      admin: admin,
      user_email: email,
      approved: false,
    })
    await invittation.save();
    const jwt = jsonwebtoken.sign({ admin }, config.JWT_SECRET, {
      expiresIn: '24h',
    });
    const link = `${config.Front_url}/sign-up?token=${jwt}`;
    const body = `
     <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Scholar Sheet</title></head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
        <tr>
          <td style="padding: 30px;">
            <h1 style="color: #4a4a4a; font-size: 24px; margin-bottom: 20px;">Welcome, ${email}!</h1>
            <p style="font-size: 16px; margin-bottom: 20px;">You have been invited by <strong>${admin}</strong> to join our platform.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">Please click on the button below to accept the invitation:</p>
            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background-color: #007bff; border-radius: 4px; text-align: center; padding: 12px 24px;">
                  <a href="${link}" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">Accept Invitation</a>
                </td>
              </tr>
            </table>
            <p style="font-size: 14px; color: #888; margin-top: 30px;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
            <p style="font-size: 14px; color: #888;">${link}</p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: 'Invitation to Join Our Platform',
    html: body,
  });

  res.json({ data: 'Invitation email sent successfully' });


  } catch (err) {
    console.log(err);
    next(err);
  }
};


export const miner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('here');
    const admin = req.user;
    const AdminEmail = admin.email;
    const users = await User.find({ admin: AdminEmail });

    const minerdata = await Promise.all(
      users.map(async (user) => {
        const userdata = await Datainput.find({ email: user.email })
          .sort({ createdAt: -1 })
          .select(`-_id`)
          .limit(1);
   if (userdata && userdata.length > 0) {
     const modifiedData = {
       ...userdata[0]._doc,
       name: user.name,
     };
     console.log('Modified data:', modifiedData);
     return modifiedData;
   } 
      
      })
    );
   const filteredMinerData = minerdata.filter((data) => data !== undefined);

    res.send(filteredMinerData);
  } catch (error) {
    next(error);
  }
};
