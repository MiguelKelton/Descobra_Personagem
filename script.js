// --- Elementos do Jogo ---
const form = document.getElementById('game-form');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const guessesGrid = document.getElementById('guesses-grid');
const datalist = document.getElementById('personagens-list');

// --- Variáveis de Estado do Jogo ---
let listaDePersonagens = [];
let personagensMap = new Map(); // Mapa para buscar personagens rápido pelo nome_chave
let personagemDoDia = null; // O personagem correto (a resposta)
// Variável 'tentativasRestantes' REMOVIDA

// --- Constantes ---
const COLUNAS_PARA_COMPARAR = ['esquadrao', 'tipo_magia', 'especie', 'grimorio_folhas', 'idade'];

// --- Funções do Jogo ---

/**
 * 1. Função Principal: Inicia o Jogo
 * Carrega o JSON, preenche o datalist e sorteia o personagem do dia.
 */
async function iniciarJogo() {
    try {
        const response = await fetch('blackclover.json');
        listaDePersonagens = await response.json();

        // 1. Preenche o datalist e o mapa de busca
        listaDePersonagens.forEach(personagem => {
            const option = document.createElement('option');
            option.value = personagem.nome_chave;
            datalist.appendChild(option);
            personagensMap.set(personagem.nome_chave, personagem);
        });

        // 2. Sorteia o personagem do dia
        const indiceAleatorio = Math.floor(Math.random() * listaDePersonagens.length);
        personagemDoDia = listaDePersonagens[indiceAleatorio];

        // Linha de DEBUG: Mostra a resposta no console para você testar
        console.log("--- RESPOSTA CORRETA ---");
        console.log(personagemDoDia.nome_chave);
        console.log(personagemDoDia);
        
        // Habilita o botão de adivinhar
        guessButton.disabled = false;
        guessInput.disabled = false;

    } catch (erro) {
        console.error("Erro fatal ao carregar o jogo:", erro);
        alert("Não foi possível carregar os dados do jogo. Tente recarregar a página.");
    }
}

/**
 * 2. Processa a tentativa do usuário
 */
function processarTentativa(event) {
    event.preventDefault(); // Impede o formulário de recarregar a página

    const nomeChaveGuess = guessInput.value.toUpperCase().trim();
    
    // Validação 1: O palpite está vazio?
    if (!nomeChaveGuess) return;

    // Validação 2: O personagem digitado existe no nosso JSON?
    if (!personagensMap.has(nomeChaveGuess)) {
        alert("Personagem não encontrado! Por favor, escolha um da lista.");
        guessInput.value = ''; // Limpa o input
        return;
    }

    // Busca o objeto completo do personagem que o usuário palpitou
    const personagemPalpitado = personagensMap.get(nomeChaveGuess);
    
    // Cria a linha de feedback visual
    criarLinhaDeResultado(personagemPalpitado);

    // Limpa o input para a próxima tentativa
    guessInput.value = '';
    // Linha 'tentativasRestantes--' REMOVIDA

    // Verifica se o jogo acabou (APENAS POR ACERTO)
    if (nomeChaveGuess === personagemDoDia.nome_chave) {
        // Atraso de 100ms para a linha verde renderizar antes do alerta
        setTimeout(() => {
            alert("Parabéns! Você acertou!");
            finalizarJogo();
        }, 100);
    }
    // Bloco 'else if (tentativasRestantes <= 0)' REMOVIDO
}

/**
 * 3. Cria a linha de resultado na grade
 */
function criarLinhaDeResultado(personagemPalpitado) {
    const linha = document.createElement('div');
    linha.classList.add('guess-row');

    // --- Célula 1: O Nome do Personagem ---
    const nomeCell = document.createElement('div');
    nomeCell.classList.add('guess-cell');
    nomeCell.textContent = personagemPalpitado.nome_chave;
    linha.appendChild(nomeCell);

    // --- Células 2-Fim: As Propriedades ---
    COLUNAS_PARA_COMPARAR.forEach(coluna => {
        const cell = document.createElement('div');
        cell.classList.add('guess-cell');
        
        const valorPalpite = personagemPalpitado[coluna];
        const valorCorreto = personagemDoDia[coluna];
        
        let status = 'incorrect'; // Começa como incorreto
        let conteudo = valorPalpite; // O texto da célula
        
        if (valorPalpite === valorCorreto) {
            status = 'correct'; // CERTO (Verde)
        } 
        // Lógica especial para números (Idade e Grimório)
        else if (coluna === 'idade' || coluna === 'grimorio_folhas') {
            const numPalpite = parseInt(valorPalpite);
            const numCorreto = parseInt(valorCorreto);

            if (!isNaN(numPalpite) && !isNaN(numCorreto)) {
                status = 'partial'; // PARCIAL (Amarelo)
                if (numPalpite > numCorreto) {
                    conteudo = `${valorPalpite} ↓`; // Palpite é maior, precisa de um menor
                } else {
                    conteudo = `${valorPalpite} ↑`; // Palpite é menor, precisa de um maior
                }
            } else if (valorPalpite !== valorCorreto) {
                // Caso um deles não seja um número (ex: "500+" ou "Único")
                // Apenas marca como incorreto se for diferente
                status = 'incorrect';
            }
        }
        
        cell.classList.add(`status-${status}`);
        cell.innerHTML = conteudo; // Usamos innerHTML para renderizar as setas (↑ ↓)
        linha.appendChild(cell);
    });

    // Adiciona a linha pronta na grade
    guessesGrid.appendChild(linha);
}

/**
 * 4. Desabilita o input e botão ao final do jogo (quando acerta)
 */
function finalizarJogo() {
    guessInput.disabled = true;
    guessButton.disabled = true;
}


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // Desabilita o botão enquanto o JSON carrega
    guessButton.disabled = true;
    guessInput.disabled = true;
    guessInput.placeholder = "Carregando personagens...";

    // Adiciona o "ouvinte" ao formulário
    form.addEventListener('submit', processarTentativa);
    
    // Inicia o jogo
    iniciarJogo();
});