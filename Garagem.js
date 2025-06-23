const digite = require("prompt-sync")(); // Conexão do com, a Biblioteca Prompt-Sync.
const { Client } = require("pg"); // Importa a Classe Client do PG.

const pg = new Client({
  // Conexão com o Banco de Dados.
  database: "Garagem",
  user: "postgres",
  password: "admin",
  port: 5432,
});

async function veiculosMenu() {
  //Criação de uma função assíncrona para ser usada em qualquer hora no programa.
  try {
    let option;

    do {
      //Menu do CRUD.
      console.log(` 
            1. Adicionar Veiculo
            2. Listar Veiculos
            3. Estocar
            4. Remover
            9. Voltar ao menu principal
        `);

      option = Number(digite("Digite uma opção: ")); //Opção para execução do programa.

      if (option === 1) {
        //Opção para cadastrar os veiculos.
        let nome = digite("Nome do Veiculo: ");
        let preco = Number(digite("Preço do Veiculo: "));
        let quantidade = Number(digite("Quantidade em estoque: "));

        let query = `
                    INSERT INTO veiculos(nome, preco, quantidade)
                    VALUES ($1, $2, $3)
                `;

        await pg.query(query, [nome, Number(preco), Number(quantidade)]);
        console.log("✅ Veiculos cadastrado com sucesso!");
      }

      if (option === 2) {
        //Opção para listas os veiculos cadastrados ou estocados.
        let resultado = await pg.query("SELECT * FROM veiculos");
        console.table(resultado.rows);
      }
      if (option === 3) {
        //Opção para estocar veiculos.
        let idParaEstocar = digite(
          "Digite o id do Veiculo que deseja estocar: "
        );
        idParaEstocar = Number(idParaEstocar);

        let quantidadeParaEstocar = digite("Quanto deseja estocar: ");
        quantidadeParaEstocar = Number(quantidadeParaEstocar);

        let query = `
                UPDATE veiculos
                SET quantidade = quantidade + $1
                WHERE id = $2
            `;

        await pg.query(query, [quantidadeParaEstocar, idParaEstocar]);

        console.log("Veiculo estocado com sucesso!");
      }

      if (option === 4) {
        //Opção para remover veiculos.
        let idParaRemover = digite(
          "Digite o id do Veiculo que deseja remover: "
        );
        idParaRemover = Number(idParaRemover);

        let query = `
                DELETE FROM veiculos
                WHERE id = $1
            `;

        await pg.query(query, [idParaRemover]);

        console.log("Veiculo removido com sucesso!");
      }
    } while (option !== 9);
  } catch (error) {
    console.error("❌ Erro ao executar a ação:", error.message);
  }
}

async function main() {
  // Cria a função assíncrona.
  await pg.connect(); // Aguarda a conexão com o Banco de Dados.

  let option;
  do {
    //Menu inicial do programa.
    console.log(`
========== MENU ==========
1. Gerenciar Veiculos
9. Sair
==========================
        `);

    option = Number(digite("Escolha uma opção: "));

    switch (option) {
      case 1:
        await veiculosMenu();
        break;

      case 9:
        console.log("Saindo...");
        break;
      default:
        console.log("❌ Opção inválida.");
    }
  } while (option !== 9); //Saida do programa.

  await pg.end(); //Finalizar o programa.
}

main();
