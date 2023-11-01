const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.nodemailer_user,
        pass: process.env.nodemailer_pass
    }
});

function sendMail(toEmail, subject, content){
    const mailOptions = {
        from: "jothiprasad5959@gmail.com",
        to: toEmail,
        subject: subject,
        html: content
    };

    transporter.sendMail(mailOptions,(error, info) => {
        if(error){
            console.log("error occured", error);
        } else {
            console.log("Email sent:",info.response);
        }
    });
}

module.exports = { sendMail };