/* ==========================================================================
   1. INICIALIZAÇÃO DE GATILHOS (DOM LOADED)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    inicializarValidacaoFormulario();
    iniciarEfeitoMaquinaDeEscrever(); // Inicializa o terminal de digitação
});

/* ==========================================================================
   2. LÓGICA FRONT-END - VALIDAÇÃO E REQUISIÇÃO ASSÍNCRONA (FETCH AJAX)
   ========================================================================== */
function inicializarValidacaoFormulario() {
    const formulario = document.getElementById('form-sistema');
    const painelFeedback = document.getElementById('feedback-painel');

    if (!formulario || !painelFeedback) return;

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); 

        const nome = document.getElementById('txt-nome').value.trim();
        const email = document.getElementById('txt-email').value.trim();
        const mensagem = document.getElementById('txt-mensagem').value.trim();

        // Reseta o painel de feedback antes de validar de novo
        painelFeedback.className = 'hidden';
        painelFeedback.innerHTML = '';

        // Validações Semânticas
        if (nome.length < 3) {
            exibirFeedback('Por favor, insira o seu nome completo (mínimo 3 caracteres).', 'erro');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            exibirFeedback('Por favor, introduza um endereço de e-mail válido.', 'erro');
            return;
        }

        if (mensagem.length < 10) {
            exibirFeedback('A sua mensagem deve conter uma descrição detalhada (mínimo 10 caracteres).', 'erro');
            return;
        }

        exibirFeedback('🚀 Enviando sua mensagem... Por favor, aguarde.', 'sucesso');

        // Captura os dados para envio assíncrono para o PHP
        const dadosFormulario = new FormData(formulario);

        fetch('contato.php', {
            method: 'POST',
            body: dadosFormulario
        })
        .then(respostaServidor => {
            if (!respostaServidor.ok) {
                throw new Error('Falha na resposta do servidor.');
            }
            return respostaServidor.json();
        })
        .then(dados => {
            if (dados.sucesso) {
                painelFeedback.className = 'sucesso';
                painelFeedback.textContent = dados.mensagem;
                formulario.reset(); // Limpa as caixas preenchidas se der certo
            } else {
                painelFeedback.className = 'erro';
                painelFeedback.textContent = dados.mensagem;
            }
        })
        .catch(erro => {
            exibirFeedback('❌ Falha de comunicação com o servidor PHP. Certifique-se de que o XAMPP ou servidor local está ativo.', 'erro');
            console.error('Erro na requisição Fetch:', erro);
        });
    });

    // Função interna auxiliar para exibir mensagens na tela
    function exibirFeedback(texto, tipo) {
        painelFeedback.textContent = texto;
        painelFeedback.className = tipo;
    }
}

/* ==========================================================================
   3. MOTOR DO EFEITO MÁQUINA DE ESCREVER (LOOP CONTÍNUO MULTI-TEXTO)
   ========================================================================== */
function iniciarEfeitoMaquinaDeEscrever() {
    const elemento = document.getElementById('efeito-digitar');
    if (!elemento) return;

    // Seus títulos estratégicos atualizados!
    const textos = [
        "Análise de Sistemas",
        "Desenvolvedora Back-end & Front-end",
        "Automação Python & RPA"
    ];

    let indiceDoVetor = 0;   // Controla qual frase está sendo digitada
    let indiceDaLetra = 0;   // Controla a letra atual da frase
    let apagando = false;    // Estado se está digitando ou deletando a palavra

    function gerenciarTerminal() {
        const fraseAtual = textos[indiceDoVetor];

        if (!apagando) {
            // EFEITO DIGITANDO: Vai adicionando letra por letra
            elemento.textContent = fraseAtual.substring(0, indiceDaLetra + 1);
            indiceDaLetra++;

            // Se terminou de digitar a frase inteira, espera e muda para o modo apagar
            if (indiceDaLetra === fraseAtual.length) {
                apagando = true;
                setTimeout(gerenciarTerminal, 2000); // Fica parada exibindo a frase por 2 segundos
                return;
            }
            setTimeout(gerenciarTerminal, 80); // Velocidade da digitação (80ms por letra)
            
        } else {
            // EFEITO APAGANDO: Vai removendo letra por letra de trás para frente
            elemento.textContent = fraseAtual.substring(0, indiceDaLetra - 1);
            indiceDaLetra--;

            // Se apagou tudo, passa para a próxima palavra do vetor
            if (indiceDaLetra === 0) {
                apagando = false;
                indiceDoVetor = (indiceDoVetor + 1) % textos.length; // Ciclo infinito pelas 3 frases
                setTimeout(gerenciarTerminal, 400); // Pausa de estabilização rápida antes de começar a digitar a outra
                return;
            }
            setTimeout(gerenciarTerminal, 40); // Velocidade ao apagar (mais rápido que digitar)
        }
    }

    // Inicializa limpando o elemento e dá o pontapé inicial no loop
    elemento.textContent = "";
    gerenciarTerminal();
}