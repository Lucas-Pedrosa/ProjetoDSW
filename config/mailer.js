const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "hotmail",
    secure: false,
    auth: {
        user: "suporte_liber@outlook.com",
        pass: process.env.NODEMAILER_PASS
    }
});

module.exports.sendMail = (to, html) => {
    const options = {
        from: "Suporte Liber <suporte_liber@outlook.com>",
        to: to,
        subject: "Liber - Recuperação de senha",
        html: html
    }

    transporter.sendMail(options, (err, info) => {
        if (err) console.log(err);
        else console.log("Enviado:", info.response);
    });
}
