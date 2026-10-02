const { quadro, verde, escuro } = require("../estilo");

module.exports = {
  titulo: "Contato",
  mostrar() {
    quadro("contato.txt", [
      ["$ cat contato.txt", escuro],
      "",
      ["GitHub:   github.com/igordesouzabranco", verde],
      ["LinkedIn: linkedin.com/in/igor-de-souza-branco-b68630314", verde],
      ["Site:     portifolioigordesouza.netlify.app", verde],
    ]);
  },
};
