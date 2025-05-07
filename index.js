let id = 0;

function genID() {
  id = id + 1;

  return id;
}

const digite = require("prompt-sync")();

let produtos = [
  {
    id: 0,
    nome: "gol",
    valor: 42.1,
    estoque: 8,
    ano: 1998,
  },
];

let option;

do {
  console.log(`
        ### MENU SISTEMA PRODUTO ###
        1.Adicionar
        2.Listar
        3.Remover
        4.Estocar
        9.Sair
        `);
  option = digite("Digite uma opção ");

  if (option == 1) {
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
  if (option == 2) {
    console.log(produtos);
  }

  if (option == 3) {
    let id = digite("Digite o id do produto para remover ");
    const index = produtos.findIndex((obj) => obj.id == id);

    if (index !== -1) {
      produtos.splice(index, 1);
    }
  }
  if (option == 4) {
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
} while (option != 9);

let pessoas = [
  {
    id: 0,
    nome: "tiao",
    endereco: "rua: don pedro n10",
    cidade: "lagoa grande",
  },
];

let option2;

do {
  console.log(`
        ### MENU SISTEMA DE PESSOAS ###
        1.Adicionar
        2.Listar
        3.Remover
        9.Sair
        `);
  option = digite("Digite uma opção ");

  if (option == 1) {
    let nome = digite("Digite o Nome ");
    let endereco = digite("Digite o Endereço ");
    let cidade = digite("Digite a Cidade ");

    pessoas.push({
      id: genID(),
      nome: nome,
      endereço: endereco,
      cidade: cidade,
    });
  }

  if (option == 2) {
    console.log(pessoas);
  }

  if (option == 3) {
    let id = digite("Digite o id da pessoa para remover");
    const index = pessoas.findIndex((obj) => obj.id == id);

    if (index !== -1) {
      pessoas.splice(index, 1);
    }
  }
} while (option != 9);
