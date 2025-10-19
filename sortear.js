// Importa o módulo 'fs' (File System) do Node.js
const fs = require('fs');

function sortearPersonagemNode() {
  try {
    // 1. Lê o arquivo JSON do disco (de forma síncrona, para scripts simples)
    const dadosJSON = fs.readFileSync('blackclover.json', 'utf8');
    
    // 2. Converte o texto em um array JavaScript
    const personagens = JSON.parse(dadosJSON);

    // 3. Gera o índice aleatório (mesma lógica)
    const indiceAleatorio = Math.floor(Math.random() * personagens.length);

    // 4. Pega o personagem
    const personagemSorteado = personagens[indiceAleatorio];

    // 5. Mostra no console
    console.log("--- PERSONAGEM SORTEADO (Node.js) ---");
    console.log("Nome:", personagemSorteado.nome_completo);
    console.log("Palavra-chave do Jogo:", personagemSorteado.nome_chave);

    return personagemSorteado;

  } catch (erro) {
    console.error("Erro ao ler ou sortear personagem:", erro);
  }
}

// Chama a função
sortearPersonagemNode();