// LISTA COMPLETA DE PALAVRAS E SÍLABAS
const palavras = [
    { palavra: "MÚSICA", silabas: ["MÚ", "SI", "CA"] },
    { palavra: "ÁGUA", silabas: ["Á", "GU", "A"] },
    { palavra: "PÁSSARO", silabas: ["PÁS", "SA", "RO"] },
    { palavra: "CÂMARA", silabas: ["CÂ", "MA", "RA"] },
    { palavra: "FÁBRICA", silabas: ["FÁ", "BRI", "CA"] },
    { palavra: "AMIGO", silabas: ["A", "MI", "GO"] },
    { palavra: "LIVRO", silabas: ["LI", "VRO"] },
    { palavra: "COLEGA", silabas: ["CO", "LE", "GA"] },
    { palavra: "ESCOLA", silabas: ["ES", "CO", "LA"] },
    { palavra: "JARDIM", silabas: ["JAR", "DIM"] }
];

// SÍLABAS EXTRAS PRA USAR NAS OPÇÕES
const silabasExtras = ["FE", "LA", "RO", "MA", "SE", "TI", "GU", "VI", "PA", "DO"];

// NÚMEROS EXTRAS PRA MATEMÁTICA
const numerosExtras = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// VARIÁVEIS QUE CONTROLAM O JOGO
let indicePergunta = 0;      // Qual pergunta estamos
let temEscudo = true;        // Se ainda tem escudo
let perguntas = [];          // Todas as perguntas do jogo
let pontuacao = 0;           // Pontos do jogador

// FUNÇÃO PRA EMBARALHAR QUALQUER LISTA
function embaralhar(array) {
    const copia = [...array];  // Faz cópia pra não mudar o original
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Pega posição aleatória
        [copia[i], copia[j]] = [copia[j], copia[i]];    // Troca os itens de lugar
    }
    return copia;  // Retorna a lista embaralhada
}

// CRIA PERGUNTAS DE MATEMÁTICA (+, -, ×, ÷)
function gerarPerguntasMat() {
    const ops = ["+", "-", "×", "÷"];  // Tipos de conta
    const quest = [];  // Onde guardamos as perguntas
    
    // Cria 5 perguntas diferentes
    while (quest.length < 5) {
        const op = ops[Math.floor(Math.random() * ops.length)];  // Escolhe operação
        
        let a, b, resp, expr;  // Variáveis pra montar a conta
        
        // Monta a conta conforme o tipo
        switch (op) {
            case "+":
                a = Math.floor(Math.random() * 10) + 1;  // Números de 1 a 10
                b = Math.floor(Math.random() * 10) + 1;
                resp = a + b;
                expr = `${a} + ${b} = ____`;  // Formato da pergunta
                break;
            case "-":
                a = Math.floor(Math.random() * 10) + 5;  // Garante que não dá negativo
                b = Math.floor(Math.random() * (a - 1)) + 1;
                resp = a - b;
                expr = `${a} - ${b} = ____`;
                break;
            case "×":
                a = Math.floor(Math.random() * 5) + 2;  // Números menores pra não ficar difícil
                b = Math.floor(Math.random() * 5) + 2;
                resp = a * b;
                expr = `${a} × ${b} = ____`;
                break;
            case "÷":
                b = Math.floor(Math.random() * 5) + 1;  // Divisão que dá resultado inteiro
                resp = Math.floor(Math.random() * 5) + 1;
                a = resp * b;
                expr = `${a} ÷ ${b} = ____`;
                break;
        }
        
        // Guarda a pergunta criada
        quest.push({ 
            tipo: "mat", 
            expressao: expr,      // Texto da conta
            resposta: resp.toString(),  // Resposta certa
            operacao: op,         // Tipo de operação
            operando1: a,         // Primeiro número
            operando2: b          // Segundo número
        });
    }
    return quest;  // Retorna todas as perguntas
}

// CRIA PERGUNTAS DE PALAVRAS (COMPLETAR SÍLABAS)
function gerarPerguntasPalavra() {
    // Mistura as palavras e pega 5
    return embaralhar([...palavras]).slice(0, 5).map(q => {
        // Escolhe qual sílaba vai faltar
        const idx = Math.floor(Math.random() * q.silabas.length);
        const certa = q.silabas[idx];  // A sílaba correta
        
        // Pega sílabas erradas (tirando a certa)
        const silabasErradas = silabasExtras.filter(s => s !== certa);
        
        // Mistura as opções (certa + erradas)
        const opcoes = embaralhar([certa, ...silabasErradas.slice(0, 5)]);
        
        // Retorna a pergunta formatada
        return { 
            tipo: "palavra", 
            palavra: q.palavra,   // Palavra completa
            silabas: q.silabas,   // Todas as sílabas
            indiceFaltante: idx,  // Qual sílaba tá faltando
            resposta: certa,      // Resposta certa
            opcoes: opcoes.slice(0, 6)  // 6 opções no total
        };
    });
}

// INICIA OU REINICIA O JOGO
function iniciarJogo() {
    // Gera perguntas de palavras e matemática
    const pi = gerarPerguntasPalavra();
    const pm = gerarPerguntasMat();
    
    // Mistura tudo e guarda
    perguntas = embaralhar([...pi, ...pm]);
    
    // Reseta tudo
    indicePergunta = 0;
    temEscudo = true;
    pontuacao = 0;
    
    // Mostra escudo e pontos
    document.getElementById('escudo').style.display = 'block';
    atualizarPontuacao();
    
    // Mostra a primeira pergunta
    renderizarPergunta();
}

// ATUALIZA OS PONTOS NA TELA
function atualizarPontuacao() {
    const elementoPontuacao = document.getElementById('pontuacao');
    if (elementoPontuacao) {
        elementoPontuacao.textContent = `Pontuação: ${pontuacao}`;
    }
}

// MOSTRA A PERGUNTA ATUAL NA TELA
function renderizarPergunta() {
    // Se acabaram as perguntas, vai pra tela de vitória
    if (indicePergunta >= perguntas.length) {
        localStorage.setItem('pontuacaoFinal', pontuacao);
        setTimeout(() => window.location.href = "vitoria.html", 1000);
        return;
    }
    
    // Pega os elementos HTML
    const atual = perguntas[indicePergunta];
    const blocos = document.getElementById("blocosDeLetras");
    const area = document.getElementById("areaDePalavras");
    const fb = document.getElementById("feedback");
    
    // Limpa a tela
    blocos.innerHTML = "";
    area.innerHTML = "";
    fb.textContent = "";
    fb.className = "";
    
    // Se for pergunta de PALAVRA
    if (atual.tipo === "palavra") {
        // Monta cada sílaba da palavra
        atual.silabas.forEach((s, i) => {
            const slot = document.createElement("div");
            slot.className = "slot";
            
            // Se for a sílaba faltante, deixa arrastável
            if (i === atual.indiceFaltante) {
                slot.addEventListener("dragover", permitirSoltar);
                slot.addEventListener("drop", soltar);
                slot.dataset.posicao = i;
            } 
            // Senão, mostra a sílaba normal
            else {
                slot.classList.add("preenchida");
                slot.textContent = s;
            }
            
            area.appendChild(slot);
        });
        
        // Mostra as opções pra arrastar
        atual.opcoes.forEach(txt => {
            const b = document.createElement("div");
            b.className = "bloco";
            b.draggable = true;
            b.textContent = txt;
            b.addEventListener("dragstart", iniciarArraste);
            blocos.appendChild(b);
        });
    } 
    // Se for pergunta de MATEMÁTICA
    else {
        // Mostra a conta (ex: "3 + 4 = ____")
        const txt = document.createElement("div");
        txt.textContent = atual.expressao;
        txt.className = "perguntaMat";
        area.appendChild(txt);
        
        // Espaço vazio pra resposta
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.addEventListener("dragover", permitirSoltar);
        slot.addEventListener("drop", soltar);
        area.appendChild(slot);
        
        // Calcula a resposta certa
        let respNumerica;
        switch (atual.operacao) {
            case "+": respNumerica = atual.operando1 + atual.operando2; break;
            case "-": respNumerica = atual.operando1 - atual.operando2; break;
            case "×": respNumerica = atual.operando1 * atual.operando2; break;
            case "÷": respNumerica = atual.operando1 / atual.operando2; break;
        }
        
        // Cria opções de resposta (certa + próximas)
        const opcoesBase = [
            respNumerica, 
            respNumerica + 1, 
            respNumerica - 1, 
            respNumerica + 2, 
            respNumerica - 2,
            Math.max(1, Math.floor(Math.random() * 20) + 1)  // Número aleatório
        ].filter(n => n > 0);  // Só números positivos
        
        // Remove duplicatas e garante que a certa tá lá
        const opcoesStr = [...new Set(opcoesBase.map(n => n.toString()))];
        if (!opcoesStr.includes(atual.resposta)) {
            opcoesStr[0] = atual.resposta;
        }
        
        // Mostra as opções
        embaralhar(opcoesStr).slice(0, 6).forEach(txt => {
            const b = document.createElement("div");
            b.className = "bloco";
            b.draggable = true;
            b.textContent = txt;
            b.addEventListener("dragstart", iniciarArraste);
            blocos.appendChild(b);
        });
    }
}

// QUANDO COMEÇA A ARRASTAR UM BLOCO
function iniciarArraste(e) {
    e.dataTransfer.setData("text/plain", e.target.textContent);  // Guarda o texto
    e.target.classList.add("dragging");  // Efeito visual
}

// PERMITE SOLTAR NO SLOT
function permitirSoltar(e) {
    e.preventDefault();  // Permite soltar
}

// QUANDO SOLTA O BLOCO NO SLOT
function soltar(e) {
    e.preventDefault();
    const val = e.dataTransfer.getData("text/plain");  // Pega o texto arrastado
    const slot = e.target;
    
    // Se já tiver preenchido, não faz nada
    if (slot.classList.contains("preenchida")) return;
    
    // Coloca o texto e marca como preenchido
    slot.textContent = val;
    slot.classList.add("preenchida");
    
    // Pega a pergunta atual
    const atual = perguntas[indicePergunta];
    let acerto = false;
    
    // Verifica se acertou
    if (atual.tipo === "palavra") {
        const posicao = parseInt(slot.dataset.posicao);
        acerto = val === atual.silabas[posicao];  // Checa se é a sílaba certa
    } else {
        const respostaNumerica = parseInt(val);
        let resultadoCorreto;
        
        // Calcula o resultado certo
        switch (atual.operacao) {
            case "+": resultadoCorreto = atual.operando1 + atual.operando2; break;
            case "-": resultadoCorreto = atual.operando1 - atual.operando2; break;
            case "×": resultadoCorreto = atual.operando1 * atual.operando2; break;
            case "÷": resultadoCorreto = atual.operando1 / atual.operando2; break;
        }
        
        acerto = !isNaN(respostaNumerica) && respostaNumerica === resultadoCorreto;
    }
    
    // Feedback pro jogador
    const fb = document.getElementById("feedback");
    if (acerto) {
        fb.textContent = "CORRETO! +10 PONTOS";
        fb.className = "correto";
        pontuacao += 10;  // Ganha pontos
        atualizarPontuacao();
        
        // Se for a última pergunta, vai pra vitória
        if (indicePergunta === perguntas.length - 1) {
            localStorage.setItem('pontuacaoFinal', pontuacao);
            setTimeout(() => window.location.href = "vitoria.html", 1000);
        } 
        // Senão, próxima pergunta
        else {
            setTimeout(() => { 
                indicePergunta++; 
                renderizarPergunta(); 
            }, 1000);
        }
    } 
    // Se errou
    else {
        fb.textContent = "ERRADO! -5 PONTOS";
        fb.className = "errado";
        pontuacao = Math.max(0, pontuacao - 5);  // Perde pontos (não fica negativo)
        atualizarPontuacao();
        
        // Se ainda tem escudo, continua
        if (temEscudo) {
            temEscudo = false;
            document.getElementById("escudo").style.display = "none";
            setTimeout(renderizarPergunta, 1000);
        } 
        // Senão, game over
        else {
            localStorage.setItem('pontuacaoFinal', pontuacao);
            setTimeout(() => window.location.href = "derrota.html", 1000);
        }
    }
}

// QUANDO A PÁGINA CARREGA, INICIA O JOGO
document.addEventListener("DOMContentLoaded", () => {
    // Cria o elemento de pontuação se não existir
    if (!document.getElementById('pontuacao')) {
        const pontuacaoElement = document.createElement('div');
        pontuacaoElement.id = 'pontuacao';
        pontuacaoElement.className = 'pontuacao';
        pontuacaoElement.textContent = 'Pontuação: 0';
        document.getElementById('areaJogo').insertBefore(
            pontuacaoElement, 
            document.getElementById('blocosDeLetras')
        );
    }
    
    iniciarJogo();  // Começa o jogo!
});