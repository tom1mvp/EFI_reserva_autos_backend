const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendMailContact = async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD,
        },
    });

    const { from, subject, body } = req.body;

    try {
        const info = await transporter.sendMail({
            from: `"${from}" <${process.env.EMAIL}>`, // this avoid problems with gmail
            to: process.env.EMAIL,
            subject: subject,
            text: body,
        });

        res.status(200).json({ status: 200, message: 'Correo enviado correctamente', data: info });
    } catch (error) {
        console.log("Error: ", error)
        return res.status(500).json({ status: 500, message: 'Error al enviar el correo' });
    };
}

module.exports = { sendMailContact }