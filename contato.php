<?php
/* ==========================================================================
   BACKEND PHP - PROCESSAMENTO SEGURO, LOG LOCAL E ALERTA TELEGRAM
   ========================================================================== */

// Configura o cabeçalho para responder no formato JSON (essencial para o Fetch do JS)
header('Content-Type: application/json; charset=utf-8');

// Array que estruturará a resposta de volta para o Front-end
$resposta = [
    'sucesso' => false,
    'mensagem' => ''
];

// Garante que o arquivo só aceita requisições do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. CAPTURA E SANITIZAÇÃO DE DADOS (Proteção contra XSS e Injeção de scripts)
    $nome     = isset($_POST['nome']) ? htmlspecialchars(trim($_POST['nome']), ENT_QUOTES, 'UTF-8') : '';
    $email    = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $mensagem = isset($_POST['mensagem']) ? htmlspecialchars(trim($_POST['mensagem']), ENT_QUOTES, 'UTF-8') : '';

    // 2. VALIDAÇÃO DE SEGURANÇA NO SERVIDOR (Segunda camada de proteção)
    if (empty($nome) || strlen($nome) < 3) {
        $resposta['mensagem'] = 'O nome introduzido é inválido (mínimo 3 caracteres).';
        echo json_encode($resposta);
        exit;
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $resposta['mensagem'] = 'O endereço de e-mail fornecido não é válido.';
        echo json_encode($resposta);
        exit;
    }

    if (empty($mensagem) || strlen($mensagem) < 10) {
        $resposta['mensagem'] = 'A mensagem deve conter uma descrição detalhada (mínimo 10 caracteres).';
        echo json_encode($resposta);
        exit;
    }

    // 3. PERSISTÊNCIA DE DADOS (Gravando o histórico no mensagens.txt)
    $dataHora = date('d/m/Y H:i:s');
    
    $blocoTexto  = "========================================\n";
    $blocoTexto .= "Nova Mensagem Recebida em: $dataHora\n";
    $blocoTexto .= "Nome: $nome\n";
    $blocoTexto .= "E-mail: $email\n";
    $blocoTexto .= "Mensagem: $mensagem\n";
    $blocoTexto .= "========================================\n\n";

    // Salva localmente na pasta do projeto (Requisito obrigatório da Estácio)
    file_put_contents('mensagens.txt', $blocoTexto, FILE_APPEND | LOCK_EX);

    // 4. DISPARO DE NOTIFICAÇÃO PARA A API DO TELEGRAM 
    // ⚠️ RECOLE AQUI AS SUAS CREDENCIAIS CASO TENHA APAGADO:
    $telegramToken  = '8447446918:AAHWBMnKR-ybNq3TTs1b0QC3hZ1-0SOnsUk';
    $telegramChatId = '7493420648';

    // Monta a mensagem que chega estruturada no seu celular
    $textoNotificacao  = "🚨 *Novo Contato Recebido no Portfólio!*\n\n";
    $textoNotificacao .= "👤 *Nome:* $nome\n";
    $textoNotificacao .= "📧 *E-mail:* $email\n";
    $textoNotificacao .= "💬 *Mensagem:* $mensagem";

    $urlTelegram = "https://api.telegram.org/bot" . $telegramToken . "/sendMessage";
    
    $dadosEnvio = [
        'chat_id'    => $telegramChatId,
        'text'       => $textoNotificacao,
        'parse_mode' => 'Markdown'
    ];

    // Configura os cabeçalhos da requisição HTTP nativa do PHP
    $opcoesHttp = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($dadosEnvio)
        ]
    ];
    $contexto = stream_context_create($opcoesHttp);
    
    // Envia o alerta em segundo plano para o Telegram
    @file_get_contents($urlTelegram, false, $contexto);

    // 5. RESPOSTA DE SUCESSO COGNITIVA (O JavaScript vai ler isso para pintar a caixinha de verde!)
    $resposta['sucesso'] = true;
    $resposta['mensagem'] = "Obrigado, $nome! Sua mensagem foi enviada com sucesso.";

} else {
    // Caso tentem acessar o arquivo direto digitando o link no navegador
    $resposta['mensagem'] = 'Método de requisição não permitido.';
}

// Converte o resultado final em texto JSON e exibe
echo json_encode($resposta);
