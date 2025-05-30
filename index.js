const digite = require("prompt-sync")();
const { Client } = require("pg");

let id = 0;

function genID() {
  id = id + 1;

  return id;
}

let option;

async function main() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "admin",
    database: "Estudo",
  });

  await client.connect();

  // let qualquer = await client.query("select 1;");
  // console.log(qualquer);

  do {
    console.log(`
      ===== SISTEMA DE COMPRAS =====
      1. Gerenciar produtos
      2. Gerenciar usuários
      3. Realizar compra
      4. Listar lucro por mês
      5. Sair

      Escolha uma opção:
        `);

    option = digite("Digite uma opção ");

    // ###### PRODUTOS ######
    if (option == 1) {
      let optionProdutos;

      do {
        console.log(`
        ### MENU SISTEMA PRODUTO ###
        1.Adicionar
        2.Listar
        3.Remover
        4.Estocar
        9.Sair
        `);

        optionProdutos = digite("Digite uma opção ");

        if (optionProdutos == 1) {
          let nome = digite("Digite o Nome ");
          let preco = digite("Digite o Preco ");
          let estoque = digite("Digite a Quantidade ");

          const query = `
          INSERT INTO produtos (nome, preco, estoque)
          VALUES ($1, $2, $3);
            `;

          await client.query(query, [nome, Number(preco), Number(estoque)]);
        }

        if (optionProdutos == 2) {
          const query = `
          select * from produtos 
            `;

          const resultado = await client.query(query);
          console.log(resultado.rows);
        }

        if (optionProdutos == 3) {
          let id = digite("Digite o id do produto para remover ");
          const query = `
          DELETE FROM produtos
          WHERE id = $1;
          `;

          await client.query(query, [id]);
        }
        if (optionProdutos == 4) {
          let idProduto = digite("Digite o ID do produto que deseja estocar: ");

          let quantidadeAdicional = digite(
            "Quantas unidades deseja adicionar ao estoque? "
          );

          const query = `
  UPDATE produtos
  SET quantidade = quantidade + $1
  WHERE id = $2;
`;

          await client.query(query, [
            Number(quantidadeAdicional),
            Number(idProduto),
          ]);
        }
      } while (optionProdutos != 9);
    }

    if (option == 2) {
      let optionUsuarios;

      do {
        console.log(`
            ### MENU SISTEMA DE USUARIOS ###
            1.Adicionar Usuarios
            2.Listar Usuarios
            3.Remover
            9.Sair
            `);
        optionUsuarios = digite("Digite uma opção ");

        if (optionUsuarios == 1) {
          let nome = digite("Digite o Nome do Usuario: ");
          let email = digite("Digite o Email do Usuario: ");

          const query = `
          INSERT INTO usuarios (nome, email)
          VALUES ($1, $2);
            `;

          await client.query(query, [nome, email]);
        }

        if (optionUsuarios == 2) {
          const query = `
          select * from usuarios 
            `;

          const resultado = await client.query(query);
          console.log(resultado.rows);
        }

        if (optionUsuarios == 3) {
          let idParaRemover = digite("Digite o id do Usuario para remover: ");
          idParaRemover = Number(idParaRemover);

          let query = `
         DELETE FROM usuarios
         WHERE id = $1`;

          await client.query(query, [idParaRemover]);
        }
      } while (optionUsuarios != 9);
    }

    if (option == 3) {
      console.log("### REALIZAR COMPRA ###");

      let usuarioId = Number(
        digite("Digite o ID do usuário que está comprando: ")
      );
      let produtoId = Number(digite("Digite o ID do produto a ser comprado: "));
      let quantidade = Number(digite("Digite a quantidade desejada: "));

      let queryProduto = `
      UPDATE produtos
      SET estoque = estoque - $1
      WHERE id = $2 AND $1 <= estoque;  
      RETURNIG id;
      `;

      const resultadoProduto = client.query(queryProduto, [
        quantidade,
        idProduto,
      ]);

      if (resultadoProduto.rowCount == 0) {
        console.log("Erro ao realiza compra");
        return;
      }

      let query = `
      INSERT INTO vendas (usuario_id, produto_id, quantidade)
      VALUES ($1, $2, $3)
      `;

      await client.query(query, [usuarioId, produtoId, quantidade]);
    }

    if (option == 4) {
      console.log("### LISTAR COMPRAS DO MÊS ###");

      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      const comprasDoMes = vendas.filter((venda) => {
        const data = new Date(venda.dataCompra);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      });

      if (comprasDoMes.length === 0) {
        console.log("Nenhuma compra realizada neste mês.");
      } else {
        comprasDoMes.forEach((venda) => {
          const usuario = usuarios.find((p) => p.id === venda.usuarioId);
          const produto = produtos.find((p) => p.id === venda.produtoId);
          console.log(`
Compra ID: ${venda.id}
Cliente: ${usuario ? usuario.nome : "Desconhecido"}
Produto: ${produto ? produto.nome : "Desconhecido"}
Quantidade: ${venda.quantidade}
Valor Total: R$
  
          `);
        });
      }
      while (option != 9);
    }
  } while (option != 9);
  client.end();
}
main();
