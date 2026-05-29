import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'development' ? false : true, // true for 465, false for other ports
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'niloyn670@gmail.com',
      pass: 'uyan kzxl wymn edev',
    },
  });

  await transporter.sendMail({
    from: 'niloyn670@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within ten mins!', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
