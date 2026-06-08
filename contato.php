<?php
/* ==========================================================================
   BACKEND PHP - PROCESSAMENTO SEGURO E PERSISTÊNCIA DE DADOS
   ========================================================================== */

// Configura o cabeçalho para responder no formato JSON (padrão de mercado para APIs)
header('Content-Type: application/json; charset=utf-8');

// Array que guardará a resposta que será devolvida para o JavaScript exibir na tela
$resposta = [
    'sucesso' => false,
    'mensagem' => ''
];

// Garante que o arquivo só processa requisições do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. CAPTURA E SANITIZAÇÃO DE DADOS (Foco em Segurança da Informação)
    // O htmlspecialchars impede ataques XSS, neutralizando tags HTML ou scripts maliciosos.
    $nome     = isset($_POST['nome']) ? htmlspecialchars(trim($_POST['nome']), ENT_QUOTES, 'UTF-8') : '';
    $email    = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $mensagem = isset($_POST['mensagem']) ? htmlspecialchars(trim($_POST['mensagem']), ENT_QUOTES, 'UTF-8') : '';

    // 2. VALIDAÇÃO NO SERVIDOR (Segunda camada de proteção caso o JS seja burlado)
    if (empty($nome) || strlen($nome) < 3) {
        $resposta['mensagem'] = 'O nome introduzido é inválido ou muito curto (mínimo 3 caracteres).';
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

    // 3. PERSISTÊNCIA DE DADOS (Salvando em arquivo de texto plano .txt)
    $dataHora = date('d/m/Y H:i:s');
    
    // Estrutura o texto que será guardado no arquivo mensagens.txt
    $blocoTexto  = "========================================\n";
    $blocoTexto .= "Nova Mensagem Recebida em: $dataHora\n";
    $blocoTexto .= "Nome: $nome\n";
    $blocoTexto .= "E-mail: $email\n";
    $blocoTexto .= "Mensagem: $mensagem\n";
    $blocoTexto .= "========================================\n\n";

    $nomeArquivo = 'mensagens.txt';

    // FILE_APPEND: Acrescenta o texto no final do arquivo sem apagar o que já existia.
    // LOCK_EX: Bloqueia o arquivo temporariamente enquanto escreve para evitar corrupção de dados.
    if (file_put_contents($nomeArquivo, $blocoTexto, FILE_APPEND | LOCK_EX)) {
        $resposta['sucesso'] = true;
        $resposta['mensagem'] = "Obrigado, $nome! A sua mensagem foi processada e gravada com sucesso no servidor.";
    } else {
        $resposta['mensagem'] = 'Ocorreu um erro interno no servidor ao tentar guardar os dados.';
    }

} else {
    // Se alguém tentar aceder a este arquivo diretamente digitando a URL no navegador
    $resposta['mensagem'] = 'Método de requisição não permitido para este recurso.';
}

// Converte o array PHP em formato JSON e envia de volta para o Front-end
echo json_encode($resposta);