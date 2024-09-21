function iniciarJogo() {
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