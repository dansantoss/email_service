const { GoogleSpreadsheet } = require("google-spreadsheet");
const sheet_id = "1Y9xYF9yuLOcGO4sUkSRVLZKyyo3MFWVmp-9XV1Pme3o";
const doc = new GoogleSpreadsheet(sheet_id);
const {
  insertEmails,
  getEmailsDatabase,
  getAllEmailsDatabase,
  setPlanilha,
} = require("../controller/controller_email");
const getEmails = async () => {
  await doc.useServiceAccountAuth(require("./credentials/acess.json"));
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  await insertEmails(rows);
  const emails = await getEmailsDatabase();
  return emails;
};
const getAllEmails = async () => {
  return (emails = await getAllEmailsDatabase());
};

const updateSheet = async (emails) => {
  await doc.useServiceAccountAuth(require("./credentials/acess.json"));
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows();
  for (let i in emails) {
    try {
      await sheet.addRow({
        Email: emails[i].email,
        Nome: emails[i].nome,
        Chave: emails[i].id,
      });
      await setPlanilha(emails[i].email, emails[i].nome, emails[i].id);
    } catch (error) {
      console.log("Falha ao atualizar status planilha");
    }
  }
};

module.exports = { getEmails, updateSheet, getAllEmails };
