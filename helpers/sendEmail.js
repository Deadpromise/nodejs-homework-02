const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_EMAIL_LOGIN, META_EMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_EMAIL_LOGIN,
    pass: META_EMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: META_EMAIL_LOGIN };
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
