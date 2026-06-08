/* ==========================================================================
   INTERATIVIDADE E DINAMISMO - PORTFÓLIO PROFISSIONAL
   ========================================================================== */

// Garante que o script só vai rodar após todo o HTML ser carregado pelo navegador
document.addEventListener("DOMContentLoaded", () => {
  // Executa as funções principais do sistema
  inicializarFiltroCompetencias();
  inicializarValidacaoFormulario();
});

/* ==========================================================================
   1. SISTEMA DE FILTRAGEM DE COMPETÊNCIAS (FRONT-END AVANÇADO)
   ========================================================================== */
function inicializarFiltroCompetencias() {
  // Seleciona todos os botões de filtro e todas as tags de habilidades (pills)
  const botoesFiltro = document.querySelectorAll(".btn-filter");
  const tagsHabilidades = document.querySelectorAll(".skill-pill");

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      // 1. Remove a classe 'active' do botão anterior e adiciona no botão clicado
      document.querySelector(".btn-filter.active").classList.remove("active");
      botao.classList.add("active");

      // 2. Captura a categoria alvo do botão clicado (all, backend, frontend, infra)
      const categoriaAlvo = botao.getAttribute("data-target");

      // 3. Percorre cada tag de habilidade para ocultar ou mostrar
      tagsHabilidades.forEach((tag) => {
        const categoriaTag = tag.getAttribute("data-cat");

        // Se for 'all' ou corresponder à categoria, mostra a tag. Caso contrário, oculta.
        if (categoriaAlvo === "all" || categoriaAlvo === categoriaTag) {
          tag.classList.remove("hidden");
          // Efeito visual sutil de entrada
          tag.style.opacity = "0";
          setTimeout(() => {
            tag.style.opacity = "1";
          }, 50);
        } else {
          tag.classList.add("hidden");
        }
      });
    });
  });
}

/* ==========================================================================
   2. VALIDAÇÃO LOCAL DO FORMULÁRIO ANTES DO ENVIO (BACKEND READY)
   ========================================================================== */
function inicializarValidacaoFormulario() {
  const formulario = document.getElementById("form-sistema");
  const painelFeedback = document.getElementById("feedback-painel");

  // Intercepta o evento de submissão (envio) do formulário
  formulario.addEventListener("submit", (evento) => {
    // Captura os valores digitados e remove espaços em branco extras (.trim)
    const nome = document.getElementById("txt-nome").value.trim();
    const email = document.getElementById("txt-email").value.trim();
    const mensagem = document.getElementById("txt-mensagem").value.trim();

    // Limpa o painel de feedback antes de uma nova validação
    painelFeedback.className = "hidden";
    painelFeedback.innerHTML = "";

    // Validação simples: verifica se os campos não são apenas espaços vazios
    if (nome.length < 3) {
      exibirFeedback(
        "Por favor, insira o seu nome completo (mínimo 3 caracteres).",
        "erro",
      );
      evento.preventDefault(); // Impede o envio para o PHP se houver erro
      return;
    }

    if (!validarEmailEstrutura(email)) {
      exibirFeedback(
        "Por favor, introduza um endereço de e-mail válido.",
        "erro",
      );
      evento.preventDefault();
      return;
    }

    if (mensagem.length < 10) {
      exibirFeedback(
        "A sua mensagem deve conter pelo menos 10 caracteres para processamento.",
        "erro",
      );
      evento.preventDefault();
      return;
    }

    // Se passar em todas as validações, o JavaScript não barra o evento.
    // O navegador continuará o fluxo natural enviando a requisição POST para o 'contato.php'.
    exibirFeedback(
      "A processar a sua requisição... Aguarde resposta do servidor.",
      "sucesso",
    );
  });

  // Função auxiliar para estruturar os alertas na tela de forma limpa
  function exibirFeedback(texto, tipo) {
    painelFeedback.textContent = texto;
    painelFeedback.className = tipo; // Aplica a classe 'sucesso' ou 'erro' configurada no CSS
  }

  // Função com Expressão Regular (Regex) para validar o formato do e-mail
  function validarEmailEstrutura(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
