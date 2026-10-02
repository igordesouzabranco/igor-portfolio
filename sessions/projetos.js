const { quadro, verde, escuro, cinza } = require("../estilo");

const projetos = [
  {
    nome: "Origo API",
    descricao: "API REST de gerenciamento de produtos em Java 21 e Spring Boot, com PostgreSQL e Swagger",
    link: "github.com/igordesouzabranco/origo-api",
  },
  {
    nome: "Collegium API",
    descricao: "API REST em Node.js/Express com Sequelize, cadastro de usuários e autenticação JWT",
    link: "github.com/igordesouzabranco/collegium-api",
  },
  {
    nome: "ContJS",
    descricao: "Agenda de contatos full stack (Express, EJS, MongoDB) com login, proteção CSRF e deploy no Render",
    link: "github.com/igordesouzabranco/cont-js",
  },
];

module.exports = {
  titulo: "Projetos",
  mostrar() {
    const itens = [["$ ls projetos/", escuro], ""];
    projetos.forEach((p, i) => {
      itens.push([`▸ ${p.nome}`, verde]);
      itens.push([p.descricao, cinza]);
      itens.push([p.link, escuro]);
      if (i < projetos.length - 1) itens.push("");
    });
    quadro("projetos/", itens);
  },
};
