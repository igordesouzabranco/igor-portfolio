const { quadro, verde, escuro, cinza } = require("../estilo");

const cursos = [
  { nome: "Técnico em Desenvolvimento de Sistemas", onde: "SENAC EAD", detalhe: "Conclusão prevista: junho de 2028" },
  { nome: "JavaScript + TypeScript", onde: "Udemy", detalhe: "140h" },
];

module.exports = {
  titulo: "Formação",
  mostrar() {
    const itens = [["$ cat formacao.txt", escuro], ""];
    cursos.forEach((c, i) => {
      itens.push([`▸ ${c.nome}`, verde]);
      itens.push([c.onde, cinza]);
      itens.push([c.detalhe, cinza]);
      if (i < cursos.length - 1) itens.push("");
    });
    quadro("formacao.txt", itens);
  },
};
