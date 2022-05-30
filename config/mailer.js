const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.MAIL, pass: process.env.MAIL_PASSWORD } });

const generateMail = async function(to, subject, text, html) {
    let mailOptions = {
        from: process.env.MAIL,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        let resp = {};
        if (error) {
           resp.status = false;
           resp.message = error;
        } 
        else {
           resp.status = true;
           resp.message = info.response;
        }
        
        return resp;
    });
}
    
exports.generateMail = generateMail;