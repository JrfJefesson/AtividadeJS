let primeiraCarta = null; // Para armazenar a primeira carta virada
let bloqueio = false; // Para evitar múltiplos cliques enquanto as cartas estão viradas
let paresEncontrados = 0; // Para contar os pares encontrados
let nomeJogador = ''; // Variável global para armazenar o nome do jogador
let tempoRestante = 60; // Tempo em segundos
let cronometroInterval; // Para armazenar o intervalo do cronômetro
let cartas; // Para armazenar todas as cartas

function iniciarJogo() {
    // Somente pedir o nome do jogador se ainda não tiver sido definido
    if (!nomeJogador) {
        nomeJogador = prompt("Digite seu nome:");
    }
    
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

    // Resetar as cartas ao iniciar um novo jogo
    resetarCartas();

    // Verificar qual dificuldade foi escolhida
    if (dificuldade === '7p') {
        console.log('Jogo fácil selecionado');
        tempoRestante = 60;
        document.getElementById('cronometro').textContent = tempoRestante;

        // Iniciar o cronômetro
        cronometroInterval = setInterval(atualizarCronometro, 1000);
        document.getElementById('game-facil').style.display = 'block';  
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

function resetarCartas() {
    cartas = document.querySelectorAll('.carta');
    
    // Remove o estado de 'virada' de todas as cartas e remove temporariamente os event listeners
    cartas.forEach(carta => {
        carta.classList.remove('virada'); // Volta a imagem de verso
        carta.removeEventListener('click', handleCartaClick); // Remove o evento para prevenir cliques durante o reset
    });

    // Após todas serem resetadas, embaralha as cartas e habilita o clique
    setTimeout(() => {
        embaralharCartas(cartas); // Embaralhar as cartas novamente
        cartas.forEach(carta => {
            carta.addEventListener('click', handleCartaClick); // Habilitar o clique novamente
        });
        paresEncontrados = 0; // Reinicia o contador de pares
        primeiraCarta = null; // Reinicia a carta virada
        bloqueio = false; // Libera cliques novamente
    }, 500); // Pequeno atraso para garantir que o reset visual ocorra antes do embaralhamento
}

// Esta função irá lidar com o clique nas cartas
function handleCartaClick() {
    virarCarta(this); // 'this' refere-se à carta clicada
}

function virarCarta(carta) {
    if (bloqueio || carta.classList.contains('virada')) return; // Evita cliques enquanto as cartas estão sendo viradas ou se a carta já estiver virada

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
                setTimeout(() => {
                    alert("Parabéns! Você encontrou todos os pares!");
                    if (confirm("Deseja jogar novamente?")) {
                        iniciarJogo(); // Reinicia o jogo
                    }
                }, 500);
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
    return cartas.length / 2; // Divide por 2, pois cada par tem 2 cartas
}

function atualizarCronometro() {
    tempoRestante--;
    document.getElementById('cronometro').textContent = tempoRestante;

    if (tempoRestante <= 0) {
        clearInterval(cronometroInterval);
        finalizarJogo();
    }
}

function finalizarJogo() {
    clearInterval(cronometroInterval);
    alert("O tempo acabou! O jogo terminou.");
    document.getElementById('cronometro').textContent = "Tempo Esgotado!";

    // Desabilitar clique nas cartas após o tempo acabar
    cartas.forEach(carta => {
        carta.removeEventListener('click', handleCartaClick);
    });

    // Oferecer opção de recomeçar
    if (confirm("Deseja jogar novamente?")) {
        iniciarJogo(); // Reinicia o jogo sem pedir o nome novamente
    }
}
