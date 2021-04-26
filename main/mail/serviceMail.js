const nodeMailer = require("nodemailer");
const { baseEmail } = require("./confirmEmailTemplate");
const { alertEmailTemplate } = require("./alertEmailTemplate");
const { setEnviado } = require("../controller/controller_email");
const { getEmails, updateSheet, getAllEmails } = require("../spreadshet/index");
exports.start = async (host, port, user, pass) => {
  var emails = await getEmails();

  const transport = nodeMailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: pass,
    },
  });
  // var transport = nodeMailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "168862b0e47461",
  //     pass: "d8f85e7c0abe97",
  //   },
  // });

  try {
    var nome = "";
    var email = "";
    var chave = 0;
    for (let i in emails) {
      nome = emails[i].nome;
      email = emails[i].email;
      chave = emails[i].id;

      var spl = nome.split(" ");
      await transport.sendMail({
        from: "Jovens Origem <no.reply.origem@gmail.com>",
        to: email,
        subject: "Sua inscrição para o Metamorfose Day foi confirmada !",
        text: "",
        html: baseEmail(chave, spl[0]),
      });

      console.log(`Email enviado para ${email}`);
      console.log(`Atualizando no banco......`);

      await setEnviado(email, nome, chave);
      console.log("\n");
      console.log(`Atualizado com sucesso`);
    }

    console.log("\n Atualizando planilha.......");
    await updateSheet(emails);
  } catch (error) {
    console.error(`Um erro ocorreu ao tentar enviar o email 
    ${error}`);
  }
};

exports.sentAlert = async (host, port, user, pass) => {
  console.log("Enviando email de alerta...")
  var emails = await getAllEmails();
  const transport = nodeMailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: pass,
    },
  });
  // var transport = nodeMailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "168862b0e47461",
  //     pass: "d8f85e7c0abe97",
  //   },
  // });

  try {
    var nome = "";
    var email = "";

    for (let i in emails) {
      nome = emails[i].nome;
      email = emails[i].email;
      var spl = nome.split(" ");
      await transport.sendMail({
        from: "Jovens Origem <no.reply.origem@gmail.com>",
        to: email,
        subject: "ALERTA ORIGEM !!!!",
        text: "",
        html: alertEmailTemplate(spl[0].toUpperCase()),
      });
      console.log(`\nE-mail enviado com sucesso !
      Nome: ${nome.toUpperCase()}
      E-MAIL: ${email.toUpperCase()}`);
    }
  } catch (error) {
    console.log(`\nErro ao enviar email de alerta ! ${error}
      Nome: ${nome}
      E-MAIL: ${email}`);
  }
};
