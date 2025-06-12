const digite = require("prompt-sync")();
const bcrypt = require("bcrypt");
const { Client } = require("pg");

const pg = new Client({
  database: "CorrecaoAtividade2",
  user: "postgres",
  password: "admin",
  port: 5432,
});

async function main() {
  await pg.connect();

  let option;

  do {
    console.log(`
    ====== MENU DE LOGIN ======
    1. Login
    2. Cadastrar novo usuário
    9. Sair
      `);

    option = Number(digite("Escolha uma opção: "));

    if (option === 1) {
      await fazerLogin();
    } else if (option === 2) {
      await cadastrarlogin();
    }
  } while (option !== 9);

  await pg.end();
  console.log("Encerrado.");
}

async function cadastrarlogin() {
  let;
}

async function fazerLogin() {}

main();
