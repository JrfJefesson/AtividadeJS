let primeiraCarta = null; // Para armazenar a primeira carta virada
let bloqueio = false; // Para evitar múltiplos cliques enquanto as cartas estão viradas
let paresEncontrados = 0; // Para contar os pares encontrados
let nomeJogador = ''; // Variável global para armazenar o nome do jogador
let tempoRestante = 0; // Tempo em segundos
let cronometroInterval; // Para armazenar o intervalo do cronômetro
let cartasFacil; // Para armazenar todas as cartas do modo fácil
let cartasDificil; // Para armazenar todas as cartas do modo difícil
let pontuacao = 0; // Variável para armazenar a pontuação
let venceu = false;

function iniciarJogo() {

     // Zera variáveis relevantes
     cartasDificil = 0;
     cartasFacil = 0;
     paresEncontrados = 0; // Reinicia a contagem de pares
     primeiraCarta = null; // Reseta a primeira carta
     bloqueio = false; // Libera cliques
     pontuacao = 0; // Reseta a pontuação
             
    // Limpar o intervalo se já existir
    if (cronometroInterval) {
        clearInterval(cronometroInterval);
    }
    venceu = false;
    document.getElementById('ranking-container').style.display = 'block';
    atualizarRanking();
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

    // Resetar as cartas ao iniciar um novo jogo
    resetarCartas();

    // Verificar qual dificuldade foi escolhida
    if (dificuldade === '7p') {
        tempoRestante = 60;
        document.getElementById('cronometro').textContent = tempoRestante;

        // Iniciar o cronômetro
        cronometroInterval = setInterval(atualizarCronometro, 1000);
        document.getElementById('game-facil').style.display = 'block';

        cartasFacil = document.querySelectorAll('.carta'); // Seleciona todas as cartas do modo fácil

        // Adiciona evento de clique nas cartas do modo fácil
        cartasFacil.forEach(carta => {
            carta.addEventListener('click', handleCartaClick);
        });

    } else if (dificuldade === '14p') {
        tempoRestante = 120; // Altera o tempo para 90 segundos
        document.getElementById('cronometro-dificil').textContent = tempoRestante;

        // Iniciar o cronômetro
        cronometroInterval = setInterval(atualizarCronometro, 1000);
        
        document.getElementById('game-dificil').style.display = 'block';

        cartasDificil = document.querySelectorAll('.carta-dificil'); // Seleciona todas as cartas do modo difícil

        // Adiciona evento de clique nas cartas do modo difícil
        cartasDificil.forEach(carta => {
            carta.addEventListener('click', handleCartaClick);
        });

    } else if (dificuldade === '7pcom') {
        document.getElementById('game-pc').style.display = 'block';    
    }
}

function resetarCartas() {
    // Reseta as cartas do modo fácil
    if (cartasFacil) {
        cartasFacil.forEach(carta => {
            carta.classList.remove('virada'); // Volta a imagem de verso
            carta.removeEventListener('click', handleCartaClick); // Remove o evento para prevenir cliques durante o reset
        });
    }

    // Reseta as cartas do modo difícil
    if (cartasDificil) {
        cartasDificil.forEach(carta => {
            carta.classList.remove('virada'); // Volta a imagem de verso
            carta.removeEventListener('click', handleCartaClick); // Remove o evento para prevenir cliques durante o reset
        });
    }

    // Após todas serem resetadas, embaralha as cartas e habilita o clique
    setTimeout(() => {
        if (cartasFacil) {
            embaralharCartas(cartasFacil); // Embaralha as cartas do modo fácil
            cartasFacil.forEach(carta => {
                carta.addEventListener('click', handleCartaClick); // Habilita o clique novamente
            });
        }

        if (cartasDificil) {
            embaralharCartas(cartasDificil); // Embaralha as cartas do modo difícil
            cartasDificil.forEach(carta => {
                carta.addEventListener('click', handleCartaClick); // Habilita o clique novamente
            });
        }

        paresEncontrados = 0; // Reinicia o contador de pares
        primeiraCarta = null; // Reinicia a carta virada
        bloqueio = false; // Libera cliques novamente
        pontuacao = 0; // Reseta a pontuação
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
                    calcularPontuacao(); // Calcula a pontuação antes de finalizar
                    alert("Você ganhou! Pontuação: " + pontuacao);
                    atualizarRanking();
                    venceu = true;
                    if (confirm("Deseja jogar novamente?")) {
                        iniciarJogo(); // Reinicia o jogo
                    } else{
                        reiniciarJogo();
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

function calcularPontuacao() {
    if (document.getElementById('game-facil').style.display === 'block') {
        pontuacao = tempoRestante * 10; // 10 pontos por segundo
    } else if (document.getElementById('game-dificil').style.display === 'block') {
        pontuacao = tempoRestante * 15; // 15 pontos por segundo
    }
    salvarPontuacao();
}

function embaralharCartas(cartas) {
    const cartasArray = Array.from(cartas); // Cria um array das cartas
    const shuffledArray = []; // Array para armazenar as cartas embaralhadas

    while (cartasArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * cartasArray.length); // Gera um índice aleatório
        shuffledArray.push(cartasArray[randomIndex]); // Adiciona a carta aleatória ao array embaralhado
        cartasArray.splice(randomIndex, 1); // Remove a carta adicionada do array original
    }

    // Substitui o conteúdo das cartas no DOM
    shuffledArray.forEach(carta => {
        carta.parentNode.appendChild(carta); // Reinsere as cartas na ordem embaralhada
    });
}

function totalPares() {
    return (cartasFacil ? cartasFacil.length : 0) / 2 + (cartasDificil ? cartasDificil.length : 0) / 2; // Conta os pares
}

function atualizarCronometro() {
    tempoRestante--;

    // Atualiza o cronômetro dependendo da dificuldade
    if (tempoRestante >= 0) {
        if (document.getElementById('game-facil').style.display === 'block') {
            document.getElementById('cronometro').textContent = tempoRestante;
        } else if (document.getElementById('game-dificil').style.display === 'block') {
            document.getElementById('cronometro-dificil').textContent = tempoRestante;
        }
    }
    

    if (tempoRestante === 0 && venceu === false) {
        clearInterval(cronometroInterval);
        finalizarJogo();
    } 
}

function finalizarJogo() {
    clearInterval(cronometroInterval); // Para o cronômetro

    // Mensagem de alerta com pontuação final
    alert("Você perdeu! O tempo acabou.");
    
    // Pergunta se o jogador deseja jogar novamente
    if (confirm("Deseja jogar novamente?")) {
        iniciarJogo(); // Chama a função para reiniciar o jogo
    } else {
        alert("Obrigado por jogar!"); // Mensagem opcional de agradecimento
        reiniciarJogo(); // Reinicia para voltar ao menu principal
    }
}

function atualizarRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens

    ranking.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome}: ${item.pontuacao}`; // Formata a pontuação
        rankingList.appendChild(li); // Adiciona o item à lista
    });
}

function salvarPontuacao() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ nome: nomeJogador, pontuacao: pontuacao }); // Adiciona nova pontuação

    // Ordena o ranking em ordem decrescente e mantém apenas as 20 maiores pontuações
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);
    localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 20))); // Mantém as 20 melhores pontuações
}

function reiniciarJogo() {
    console.log('Reiniciando o jogo...'); // Para verificar se a função está sendo chamada

    // Oculta as áreas do jogo
    if (document.getElementById('ranking-container')) {
        document.getElementById('ranking-container').style.display = 'none';
    }
    if (document.getElementById('game-facil')) {
        document.getElementById('game-facil').style.display = 'none';
    }
    if (document.getElementById('game-dificil')) {
        document.getElementById('game-dificil').style.display = 'none';
    }
    if (document.getElementById('game-pc')) {
        document.getElementById('game-pc').style.display = 'none';
    }
    if (document.getElementById('nome-jogador')) {
        document.getElementById('nome-jogador').style.display = 'none';
    }

    // Mostra a tela inicial novamente
    if (document.getElementById('principal')) {
        document.getElementById('principal').style.display = 'flex';
    }
    tempoConcluido = true;
    nomeJogador = null;

    // Reinicia as variáveis do jogo, se necessário
    resetarCartas(); // Caso queira resetar cartas
}
