const { quadro, verde, medio, escuro, cinza } = require("../estilo");

module.exports = {
  titulo: "Sobre",
  mostrar() {
    quadro("sobre.txt", [
      ["$ cat sobre.txt", escuro],
      "",
      ["Igor de Souza Branco", verde],
      ["Estudante de Desenvolvimento de Sistemas (SENAC EAD) e Jovem Aprendiz.", cinza],
      ["Busco minha primeira vaga como Jovem Aprendiz de TI ou Estagiário em TI.", cinza],
      "",
      ["Stack: JavaScript, TypeScript, Python, Java, Node.js/Express, React, Django", medio],
    ]);
  },
};
