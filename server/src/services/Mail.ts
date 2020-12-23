import * as nodemailer from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

class Mail {
  public to?: string;
  public subject?: string;
  public message?: string;
  public token?: string;

  constructor(to?: string, subject?: string, message?: string, token?: string) {
    this.to = to;
    this.subject = subject;
    this.message = message;
    this.token = token;
  }

  async sendMail() {
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    } as {
      host: string;
    });

    transport.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".html",
          partialsDir: path.resolve("./src/resources/mail/"),
          layoutsDir: path.resolve("./src/resources/mail/"),
          defaultLayout: "auth/forgot_password.html",
        },
        viewPath: path.resolve("./src/resources/mail/auth"),
        extName: ".html",
      })
    );

    const mailOptions = {
      from: "edvaldojunior1310@gmail.com",
      to: this.to,
      subject: this.subject,
      template: "forgot_password",
      context: { token: this.token },
    };

    await transport.sendMail(mailOptions);
  }
}

export default Mail;
