let id = 0;

function genID() {
  id = id + 1;

  return id;
}

const digite = require("prompt-sync")();

let vendas = [
  {
    id: 0,
    usuarioId: 0,
    produtoId: 42,
    quantidade: 0,
    dataCompra: new Date(),
  },
];

let produtos = [
  {
    id: 0,
    nome: "gol",
    valor: 42.1,
    estoque: 8,
    ano: 1998,
  },
];

let pessoas = [
  {
    id: 0,
    nome: "tiao",
    endereco: "rua: don pedro n10",
    cidade: "lagoa grande",
  },
];
let option;

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
        let nome = digite("Digite o nome ");
        let valor = digite("Digite o Valor ");
        let estoque = digite("Digite a Quantidade ");
        let ano = digite("Digite o ano ");

        produtos.push({
          id: genID(),
          nome: nome,
          valor: Number(valor),
          estoque: Number(estoque),
          ano: Number(ano),
        });
      }

      if (optionProdutos == 2) {
        console.log(produtos);
      }

      if (optionProdutos == 3) {
        let id = digite("Digite o id do produto para remover ");
        const index = produtos.findIndex((obj) => obj.id == id);

        if (index !== -1) {
          produtos.splice(index, 1);
        }
      }
      if (optionProdutos == 4) {
        let idProduto = digite("Digite o ID do produto que deseja estocar: ");
        const produto = produtos.find((obj) => obj.id == idProduto);

        if (produto) {
          let quantidadeAdicional = digite(
            "Quantas unidades deseja adicionar ao estoque? "
          );
          quantidadeAdicional = Number(quantidadeAdicional);
          produto.estoque += quantidadeAdicional;
        }
      }
    } while (optionProdutos != 9);
  }

  if (option == 2) {
    let optionPessoas;

    do {
      console.log(`
            ### MENU SISTEMA DE PESSOAS ###
            1.Adicionar
            2.Listar
            3.Remover
            9.Sair
            `);
      optionPessoas = digite("Digite uma opção ");

      if (optionPessoas == 1) {
        let nome = digite("Digite o Nome ");
        let endereco = digite("Digite o Endereço ");
        let cidade = digite("Digite a Cidade ");

        pessoas.push({
          id: genID(),
          nome: nome,
          endereco: endereco,
          cidade: cidade,
        });
      }

      if (optionPessoas == 2) {
        console.log(pessoas);
      }

      if (optionPessoas == 3) {
        let id = digite("Digite o id da pessoa para remover");
        const index = pessoas.findIndex((obj) => obj.id == id);

        if (index !== -1) {
          pessoas.splice(index, 1);
        }
      }
    } while (optionPessoas != 9);
  }

  if (option == 3) {
    console.log("### REALIZAR COMPRA ###");

    let usuarioId = Number(
      digite("Digite o ID do usuário que está comprando: ")
    );
    let produtoId = Number(digite("Digite o ID do produto a ser comprado: "));
    let quantidade = Number(digite("Digite a quantidade desejada: "));

    const usuario = pessoas.find((u) => u.id === usuarioId);
    if (!usuario) {
      console.log("Usuário não encontrado.");
      continue;
    }

    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) {
      console.log("Produto não encontrado.");
      continue;
    }

    if (produto.estoque < quantidade) {
      console.log("Estoque insuficiente.");
      continue;
    }

    produto.estoque -= quantidade;

    vendas.push({
      id: genID(),
      usuarioId: usuarioId,
      produtoId: produtoId,
      quantidade: quantidade,
      dataCompra: new Date(),
    });

    console.log("Compra realizada com sucesso!");
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
        const usuario = pessoas.find((p) => p.id === venda.usuarioId);
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
