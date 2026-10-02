#!/usr/bin/env node
const readline = require("readline");
const E = require("./estilo");
const cobra = require("./cobra");

const { L, quebrar, caixa, juntar, desenhar, verde, medio, escuro, cinza, claro } = E;

const sessions = {
  1: require("./sessions/sobre"),
  2: require("./sessions/projetos"),
  3: require("./sessions/contato"),
  4: require("./sessions/formacao"),
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("close", () => {
  E.sairTela();
  process.exit(0);
});
rl.on("SIGINT", () => rl.close()); // Ctrl+C também restaura o terminal

// Cada caractere ganha um tom de verde conforme a "densidade" (dá volume à cobra)
function colorirCobra(linha) {
  let s = "";
  for (const ch of linha) {
    if (ch === " ") s += ch;
    else if ("@%#".includes(ch)) s += verde(ch);
    else if ("*+=".includes(ch)) s += medio(ch);
    else s += escuro(ch);
  }
  return { s, w: linha.length };
}

function painel() {
  const descricao = quebrar(
    "Portfólio interativo feito para rodar direto no terminal. Escolha uma seção pelo número e aperte Enter para navegar.",
    40
  );
  const linhas = [
    L(["IGOR DE SOUZA BRANCO", verde]),
    L(["Desenvolvedor // em formação", medio]),
    L(""),
    ...descricao.map((t) => L([t, cinza])),
    L(""),
    L(["Feito em Node.js, sem dependências.", escuro]),
    L(""),
    ...Object.entries(sessions).map(([n, s]) => L([`[${n}] `, verde], [s.titulo, claro])),
    L(["[0] ", verde], ["Sair", claro]),
  ];
  return caixa("portfolio.exe", linhas, 42);
}

function mostrarMenu() {
  const cols = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;
  const dir = painel();
  const larguraDir = dir[0].w;

  // escolhe a cobra que cabe no terminal; se nenhuma couber, mostra só o painel
  let arte = null;
  if (cols >= cobra.grande[0].length + larguraDir + 8 && rows >= cobra.grande.length + 4) arte = cobra.grande;
  else if (cols >= cobra.pequena[0].length + larguraDir + 8 && rows >= cobra.pequena.length + 4) arte = cobra.pequena;

  desenhar(arte ? juntar(arte.map(colorirCobra), dir, 4) : dir);
}

function esperarEnter() {
  rl.question(E.margem() + cinza("[Enter] voltar ao menu "), () => perguntar());
}

function perguntar() {
  mostrarMenu();
  rl.question(E.margem() + verde("visitante@igor:~$ "), (opcao) => {
    const escolha = opcao.trim();
    if (escolha === "0") return rl.close();
    if (sessions[escolha]) {
      sessions[escolha].mostrar();
      esperarEnter();
    } else {
      perguntar();
    }
  });
}

E.iniciarTela();
perguntar();
