const db = require("../database/models");
const Op = require("sequelize").Op;

//retorna todos os emails do banco
exports.getEmailsDatabase = async (data) => {
  return (emails = await db.Email.findAll({ where: { enviado: "N" } }));
};

exports.getAllEmailsDatabase = async () => {
  return (emails = await db.Email.findAll());
};

//Insere apenas emails não cadastrados no banco
exports.insertEmails = async (data) => {
  for (let i in data) {
    try {
      const [created, ok] = await db.Email.findOrCreate({
        where: {
          [Op.and]: {
            nome: data[i].Nome,
            email: data[i].Email,
          },
        },
        defaults: {
          nome: data[i].Nome,
          email: data[i].Email,
          chave: 0,
          enviado: "N",
          planilha: "N",
        },
      });
      if (ok) {
        console.log(`Email cadastrado no banco: 
        Email: ${data[i].Email}
        Nome: ${data[i].Nome}
        Chave: ${created.dataValues.id}`);
        console.log("\n");
      }
    } catch (error) {
      console.log(`\nFalha ao cadastrar email no banco.
    Email: ${data[i].Email}
    Nome: ${data[i].Nome}
    -------------------------------
    Erro: ${error}`);
    }
  }
};

//Atualizar status de enviado no banco
exports.setEnviado = async (email, nome, chave) => {
  try {
    const data = await db.Email.update(
      { enviado: "S", chave: chave },
      {
        where: {
          [Op.and]: {
            email: email,
            nome: nome,
            enviado: "N",
          },
        },
      }
    );
  } catch (error) {
    console.error(`Falha ao atualizar status de email enviado.
    Nome: ${nome}
    Email: ${email}`);
  }
};

exports.setPlanilha = async (email, nome, chave) => {
  try {
    const data = await db.Email.update(
      { planilha: "S" },
      {
        where: {
          [Op.and]: {
            email: email,
            nome: nome,
            planilha: "N",
            chave: chave,
          },
        },
      }
    );
  } catch (error) {
    console.error(`Falha ao atualizar status da planilha.
  Nome: ${nome}
  Email: ${email}`);
  }
};
