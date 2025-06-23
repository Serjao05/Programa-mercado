import axios from "axios";

const urls = "https://pokeapi.co/api/v2/pokemon/1/"; //API do pokemon é alterada para pesquisa com um novo ID,Nome,Tipo,Tamanho,etc...

async function chamadaAPI() {
  //Execução do Codigo Fonte.
  try {
    const resposta = await axios.get(urls);
    console.log(resposta.data); // Resposta dos dados de pesquisa.
    console.log(resposta.status); // Resposta da confirmação da pesquisa.
  } catch (error) {
    console.error("Erro API:", error.message);
  }
}

chamadaAPI();
