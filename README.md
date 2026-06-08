# 📑 Currículo Online & Sistema de Mensagens Profissional

Plataforma de portfólio e currículo online desenvolvida como avaliação prática para a disciplina de **Desenvolvimento Web em HTML5, CSS, JavaScript e PHP** no Centro Universitário Estácio de Vila Velha. O projeto adota uma abordagem moderna, limpa e altamente focada em usabilidade (UX), acessibilidade e padrões semânticos.

---

## 🚀 Funcionalidades Implementadas

- **Arquitetura Semântica (HTML5):** Estruturação limpa utilizando tags nativas (`<header>`, `<main>`, `<section>`, `<article>`) para garantir melhor indexação e acessibilidade.
- **Design Responsivo Avançado (CSS3):** Layout fluido adaptável para smartphones, tablets e desktops utilizando propriedades modernas como CSS Grid, Flexbox e Variáveis Globais (`:root`).
- **Filtro Dinâmico de Competências (JavaScript):** Sistema de manipulação de DOM que permite ao recrutador segmentar as habilidades técnicas em tempo real com transições suaves de opacidade.
- **Módulo de Exportação para Impressão (PDF):** Integração com folha de estilo específica para mídia de impressão (`@media print`), permitindo o download de uma versão impressa tradicional limpa, omitindo botões e formulários.
- **Backend de Captura e Sanitização (PHP):** Formulário de contacto interligado a uma lógica assíncrona baseada em requisições `POST` via API Fetch (AJAX). O script realiza a validação de dados em duas camadas e sanitização contra ataques XSS.
- **Persistência Local (Log de Eventos):** Armazenamento seguro de mensagens recebidas em arquivo estruturado de texto plano (`mensagens.txt`) diretamente no ambiente do servidor.

---

## 📂 Estrutura Organizacional do Projeto

```text
/curriculo-profissional
├── index.html        # Estrutura semântica da interface e conteúdo do perfil
├── style.css         # Variáveis globais, layout responsivo e estilos de impressão
├── script.js         # Lógica do filtro de competências e interceptação AJAX do formulário
├── contato.php       # Tratamento, sanitização e persistência de dados no backend
├── mensagens.txt     # Arquivo gerado automaticamente pelo servidor para armazenamento de logs
└── /assets           # Diretório reservado para elementos visuais e fotografias de perfil
```
