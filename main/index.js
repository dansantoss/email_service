"use_strict";
const { start, sentAlert } = require("./mail/serviceMail.js");
const config = require("./mail/config");
const host = config.host;
const port = config.port;
const user = config.user;
const pass = config.pass;
async function run() {
  await start(host, port, user, pass); // manda email de confirmação
  await sentAlert(host, port, user, pass); // manda email de alerta
}
run();
