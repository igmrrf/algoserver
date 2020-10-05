const nodeMailer = require("nodemailer");

let transporter = nodeMailer.createTransport({
  host: "blockchainminingtech.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@blockchainminingtech.com",
    pass: "NoReply01#",
  },
});

async function SendMail(email, subject, content) {
  let mailOptions = {
    from: '"Blockchain Mining Tech" <noreply@blockchainminingtech.com>',
    to: email,
    subject: subject,
    html: content,
  };

  const sent = await transporter.sendMail(mailOptions);

  console.log("Sent oh");
  console.log(sent);
  return sent;
}

module.exports = SendMail;
