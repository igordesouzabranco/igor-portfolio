const ESC = "\x1b[";

// cor(r, g, b) devolve uma função que pinta só o texto (39m restaura só a cor da letra, o fundo continua)
const cor = (r, g, b) => (t) => `${ESC}38;2;${r};${g};${b}m${t}${ESC}39m`;
const pintar = (rgb, t) => cor(rgb[0], rgb[1], rgb[2])(t);

// Temas da interface; as setas ← → alternam entre eles (ver index.js)
const temas = [
  {
    nome: "verde",
    fundo: [8, 14, 10], // fundo verde quase preto
    verde: [57, 255, 20],
    medio: [30, 200, 60],
    escuro: [0, 140, 55],
    cinza: [110, 135, 115],
    claro: [200, 255, 205],
  },
  {
    nome: "vermelho",
    fundo: [14, 8, 8], // fundo vermelho quase preto
    verde: [255, 50, 50],
    medio: [224, 43, 43],
    escuro: [160, 18, 18],
    cinza: [150, 120, 120],
    claro: [255, 215, 215],
  },
];

let temaAtual = 0;
const tema = () => temas[temaAtual];

const BG = () => `${ESC}48;2;${tema().fundo.join(";")}m`;
const verde = (t) => pintar(tema().verde, t);
const medio = (t) => pintar(tema().medio, t);
const escuro = (t) => pintar(tema().escuro, t);
const cinza = (t) => pintar(tema().cinza, t);
const claro = (t) => pintar(tema().claro, t);

// direcao 1 = próximo tema (direita), -1 = anterior (esquerda); circular
function alternarCor(direcao = 1) {
  temaAtual = (temaAtual + direcao + temas.length) % temas.length;
  return temas[temaAtual].nome;
}

let margemAtual = "  ";

function iniciarTela() {
  process.stdout.write(`${ESC}?1049h${BG()}${ESC}2J`);
}

function sairTela() {
  process.stdout.write(`${ESC}0m${ESC}?1049l`);
}

// Uma "linha" é { s: texto já colorido, w: largura real sem cores }
function L(...partes) {
  let s = "";
  let w = 0;
  for (const p of partes) {
    const [t, pintar] = typeof p === "string" ? [p, verde] : p;
    s += pintar(t);
    w += t.length;
  }
  return { s, w };
}

function quebrar(texto, max) {
  const linhas = [];
  let atual = "";
  for (const palavra of texto.split(" ")) {
    if (atual && (atual + " " + palavra).length > max) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = atual ? atual + " " + palavra : palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas.length ? linhas : [""];
}

// Caixa com título: ┌─ titulo ───┐
function caixa(titulo, linhas, larguraMin = 0) {
  const interna = Math.max(larguraMin, titulo.length + 4, ...linhas.map((l) => l.w));
  const topo = {
    s: escuro("┌─ ") + claro(titulo) + escuro(" " + "─".repeat(interna - titulo.length - 1) + "┐"),
    w: interna + 4,
  };
  const meio = linhas.map((l) => ({
    s: escuro("│ ") + l.s + " ".repeat(interna - l.w) + escuro(" │"),
    w: interna + 4,
  }));
  const base = { s: escuro("└" + "─".repeat(interna + 2) + "┘"), w: interna + 4 };
  return [topo, ...meio, base];
}

// Coloca duas colunas lado a lado, centralizadas na vertical
function juntar(esq, dir, gap = 4) {
  const le = Math.max(...esq.map((l) => l.w));
  const ld = Math.max(...dir.map((l) => l.w));
  const n = Math.max(esq.length, dir.length);
  const oe = Math.floor((n - esq.length) / 2);
  const od = Math.floor((n - dir.length) / 2);
  const vazio = { s: "", w: 0 };
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = esq[i - oe] || vazio;
    const b = dir[i - od] || vazio;
    out.push({ s: a.s + " ".repeat(le - a.w + gap) + b.s, w: le + gap + ld });
  }
  return out;
}

// Limpa a tela, centraliza e desenha
function desenhar(linhas) {
  const cols = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;
  const largura = Math.max(...linhas.map((l) => l.w));
  margemAtual = " ".repeat(Math.max(2, Math.floor((cols - largura) / 2)));
  const topo = Math.max(1, Math.floor((rows - linhas.length - 4) / 2));
  process.stdout.write(
    `${BG()}${ESC}2J${ESC}H` +
      "\n".repeat(topo) +
      linhas.map((l) => margemAtual + l.s).join("\n") +
      "\n\n"
  );
}

// Atalho para as seções: título do arquivo + itens ("texto" ou [texto, cor])
function quadro(titulo, itens) {
  const cols = process.stdout.columns || 80;
  const max = Math.max(30, Math.min(70, cols - 10));
  const linhas = [];
  for (const item of itens) {
    const [t, pintar] = typeof item === "string" ? [item, verde] : item;
    const partes = t.length <= max ? [t] : quebrar(t, max);
    for (const parte of partes) linhas.push(L([parte, pintar]));
  }
  desenhar(caixa(titulo, linhas));
}

// Escreve um { s, w } no canto inferior direito, guardando e restaurando o cursor
function rodape(linha) {
  if (!process.stdout.isTTY) return;
  const cols = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;
  if (linha.w >= cols) return;
  process.stdout.write(
    `\x1b7${ESC}${rows};${cols - linha.w + 1}H${linha.s}\x1b8`
  );
}

module.exports = {
  L, quebrar, caixa, juntar, desenhar, quadro, rodape,
  iniciarTela, sairTela, margem: () => margemAtual,
  verde, medio, escuro, cinza, claro, alternarCor,
};
