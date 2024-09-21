let primeiraCarta = null; // Para armazenar a primeira carta virada
let bloqueio = false; // Para evitar múltiplos cliques enquanto as cartas estão viradas
let paresEncontrados = 0; // Para contar os pares encontrados
let nomeJogador = '';

function iniciarJogo() {

    const nomeJogador = prompt("Digite seu nome:");
    document.getElementById('nome-jogador').textContent = "Jogador: " + nomeJogador;    

    // Esconder os elementos atuais
    document.getElementById('principal').style.display = 'none';

    // Capturar o valor selecionado no campo <select>
    const dificuldade = document.getElementById('opcao').value;

    // Esconder todos os tabuleiros
    document.getElementById('game-facil').style.display = 'none';
    document.getElementById('game-dificil').style.display = 'none';
    document.getElementById('game-facil-pc').style.display = 'none';
    document.getElementById('game-dificil-pc').style.display = 'none';

    // Verificar qual dificuldade foi escolhida
    if (dificuldade === '7p') {
        console.log('Jogo fácil selecionado');
        
        document.getElementById('game-facil').style.display = 'block';  
        const cartas = document.querySelectorAll('.carta');
        embaralharCartas(cartas); // Chama a função para embaralhar cartas
        cartas.forEach(carta => {
            carta.addEventListener('click', () => {
                virarCarta(carta);
            });
        });
        paresEncontrados = 0;
    } else if (dificuldade === '14p') {
        console.log('Jogo difícil selecionado');
        document.getElementById('game-dificil').style.display = 'block';    
    } else if (dificuldade === '7pcom') {
        console.log('Jogo contra o computador (Fácil) selecionado');
        document.getElementById('game-facil-pc').style.display = 'block';    
    } else if (dificuldade === '14pcom') {
        console.log('Jogo contra o computador (Difícil) selecionado');
        document.getElementById('game-dificil-pc').style.display = 'block';   
    }
}

// Mova a função virarCarta para fora do iniciarJogo
function virarCarta(carta) {
    carta.classList.toggle('virada');
}

function virarCarta(carta) {
    if (bloqueio) return; // Evita cliques enquanto as cartas estão sendo viradas

    carta.classList.add('virada'); // Vira a carta

    if (!primeiraCarta) {
        // Se não há carta selecionada, armazena a primeira
        primeiraCarta = carta;
    } else {
        // Se já existe uma carta selecionada
        bloqueio = true; // Bloqueia novos cliques
        const segundaCarta = carta;

        // Verifica se as cartas correspondem
        if (primeiraCarta.dataset.framework === segundaCarta.dataset.framework) {
            // Se as cartas correspondem, mantém viradas
            paresEncontrados++; // Aumenta o contador de pares
            primeiraCarta = null; // Reseta a primeira carta
            bloqueio = false; // Libera novos cliques

            // Verifica se todos os pares foram encontrados
            if (paresEncontrados === totalPares()) {
                // Finaliza o jogo
                alert("Parabéns! Você encontrou todos os pares!");
                // Aqui você pode reiniciar o jogo ou resetar o tabuleiro
            }
        } else {
            // Se não correspondem, vira de volta após um pequeno atraso
            setTimeout(() => {
                primeiraCarta.classList.remove('virada');
                segundaCarta.classList.remove('virada');
                primeiraCarta = null; // Reseta a primeira carta
                bloqueio = false; // Libera novos cliques
            }, 1000); // Tempo em milissegundos (1 segundo)
        }
    }
}

function embaralharCartas(cartas) {
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        cartas[i].parentNode.insertBefore(cartas[j], cartas[i]);
    }
}

function totalPares() {
    return document.querySelectorAll('.carta').length / 2; // Divide por 2, pois cada par tem 2 cartas
}