const digite = require("prompt-sync")(); // Biblioteca para entrada de dados pelo terminal
const { Client } = require("pg"); // Biblioteca para conexão com PostgreSQL

// Configuração da conexão com o banco de dados
const pg = new Client({
  database: "Estudo",
  user: "postgres",
  password: "admin",
  port: 5432,
});

// Menu para gerenciamento de produtos
async function produtosMenu() {
  let option;

  do {
    console.log(`
            1. Adicionar Produto
            2. Listar Produtos
            3. Remover Produto
            4. Estocar Produto
            9. Voltar ao menu principal
        `);

    option = Number(digite("Digite uma opção: "));

    try {
      if (option === 1) {
        // Adiciona novo produto
        const nome = digite("Nome do produto: ");
        const preco = Number(digite("Preço do produto: "));
        const quantidade = Number(digite("Quantidade em estoque: "));

        const query = `
                    INSERT INTO produtos(nome, preco, quantidade)
                    VALUES ($1, $2, $3)
                `;
        await pg.query(query, [nome, preco, quantidade]);
        console.log("✅ Produto cadastrado com sucesso!");
      }

      if (option === 2) {
        // Lista todos os produtos
        const resultado = await pg.query("SELECT * FROM produtos");
        console.table(resultado.rows);
      }

      if (option === 3) {
        // Remove produto por ID
        const id = Number(digite("Digite o ID do produto a remover: "));
        await pg.query("DELETE FROM produtos WHERE id = $1", [id]);
        console.log("✅ Produto removido com sucesso!");
      }

      if (option === 4) {
        // Estoca produto (aumenta quantidade)
        const id = Number(digite("ID do produto: "));
        const quantidade = Number(digite("Quantidade a adicionar: "));

        await pg.query(
          `
                    UPDATE produtos
                    SET quantidade = quantidade + $1
                    WHERE id = $2
                `,
          [quantidade, id]
        );

        console.log("✅ Produto estocado com sucesso!");
      }
    } catch (error) {
      console.error("❌ Erro ao executar a ação:", error.message);
    }
  } while (option !== 9);
}

// Menu para gerenciamento de usuários
async function usuariosMenu() {
  let option;

  do {
    console.log(`
            1. Adicionar Usuário
            2. Listar Usuários
            3. Remover Usuário
            9. Voltar ao menu principal
        `);

    option = Number(digite("Digite uma opção: "));

    try {
      if (option === 1) {
        const nome = digite("Nome do usuário: ");
        const email = digite("Email do usuário: ");
        await pg.query(
          `
                    INSERT INTO usuarios(nome, email)
                    VALUES ($1, $2)
                `,
          [nome, email]
        );

        console.log("✅ Usuário cadastrado com sucesso!");
      }

      if (option === 2) {
        const resultado = await pg.query("SELECT * FROM usuarios");
        console.table(resultado.rows);
      }

      if (option === 3) {
        const id = Number(digite("Digite o ID do usuário a remover: "));
        await pg.query("DELETE FROM usuarios WHERE id = $1", [id]);
        console.log("✅ Usuário removido com sucesso!");
      }
    } catch (error) {
      console.error("❌ Erro ao executar ação:", error.message);
    }
  } while (option !== 9);
}

// Realiza uma compra, com verificação de estoque e listagem dos produtos
async function realizarCompras() {
  try {
    // Mostra os produtos disponíveis
    const produtos = await pg.query(
      "SELECT * FROM produtos WHERE quantidade > 0"
    );
    if (produtos.rows.length === 0) {
      console.log("❌ Nenhum produto disponível no estoque.");
      return;
    }

    console.table(produtos.rows);

    // Coleta informações da compra
    const idUsuario = Number(digite("ID do usuário: "));
    const idProduto = Number(digite("ID do produto: "));
    const quantidadeDesejada = Number(digite("Quantidade a comprar: "));

    // Verifica e atualiza o estoque
    const queryProduto = `
            UPDATE produtos
            SET quantidade = quantidade - $1
            WHERE id = $2 AND quantidade >= $1
            RETURNING id;
        `;
    const resultadoProduto = await pg.query(queryProduto, [
      quantidadeDesejada,
      idProduto,
    ]);

    if (resultadoProduto.rowCount === 0) {
      console.log("❌ Estoque insuficiente ou produto não encontrado.");
      return;
    }

    // Registra a venda
    const queryVenda = `
            INSERT INTO vendas(usuario_id, produto_id, quantidade, data_compra)
            VALUES ($1, $2, $3, $4);
        `;
    const dataCompra = new Date();
    await pg.query(queryVenda, [
      idUsuario,
      idProduto,
      quantidadeDesejada,
      dataCompra,
    ]);

    console.log("✅ Venda registrada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao realizar compra:", error.message);
  }
}

// Devolve uma compra e repõe o estoque
async function devolverCompra() {
  try {
    const idVenda = Number(digite("ID da venda a devolver: "));

    // Recupera os dados da venda
    const vendaResult = await pg.query("SELECT * FROM vendas WHERE id = $1", [
      idVenda,
    ]);
    if (vendaResult.rows.length === 0) {
      console.log("❌ Venda não encontrada.");
      return;
    }

    const venda = vendaResult.rows[0];

    // Deleta a venda
    await pg.query("DELETE FROM vendas WHERE id = $1", [idVenda]);

    // Reajusta o estoque
    await pg.query(
      `
            UPDATE produtos
            SET quantidade = quantidade + $1
            WHERE id = $2
        `,
      [venda.quantidade, venda.produto_id]
    );

    console.log("✅ Devolução realizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao devolver compra:", error.message);
  }
}

// Lista o lucro de um determinado mês
async function listarLucro() {
  try {
    const mes = Number(digite("Digite o número do mês (1-12): "));

    const query = `
            SELECT v.quantidade, v.data_compra, p.preco  
            FROM vendas v
            LEFT JOIN produtos p ON p.id = v.produto_id
        `;

    const resultado = await pg.query(query);

    // Filtra vendas do mês
    const vendasDoMes = resultado.rows.filter((item) => {
      const data = new Date(item.data_compra);
      return data.getMonth() + 1 === mes;
    });

    // Soma do lucro
    const lucroTotal = vendasDoMes.reduce((total, venda) => {
      return total + venda.preco * venda.quantidade;
    }, 0);

    console.log(`💰 Receita do mês ${mes}: R$ ${lucroTotal.toFixed(2)}`);
  } catch (error) {
    console.error("❌ Erro ao calcular lucro:", error.message);
  }
}

// Função principal com menu de opções
async function main() {
  await pg.connect(); // Conecta ao banco

  let option;
  do {
    console.log(`
========== MENU ==========
1. Gerenciar produtos
2. Gerenciar usuários
3. Realizar compra
4. Devolver compra
5. Listar lucro por mês
9. Sair
==========================
        `);

    option = Number(digite("Escolha uma opção: "));

    switch (option) {
      case 1:
        await produtosMenu();
        break;
      case 2:
        await usuariosMenu();
        break;
      case 3:
        await realizarCompras();
        break;
      case 4:
        await devolverCompra();
        break;
      case 5:
        await listarLucro();
        break;
      case 9:
        console.log("Saindo...");
        break;
      default:
        console.log("❌ Opção inválida.");
    }
  } while (option !== 9);

  await pg.end(); // Fecha conexão com o banco
}

// Inicia a aplicação
main();
