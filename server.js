// --- NOVO BLOCO DE CARREGAMENTO DA CHAVE ---
let serviceAccount;

// Caminho onde a Render guarda os arquivos secretos
const caminhoRender = '/etc/secrets/chave-firebase.json';
// Caminho local no seu PC
const caminhoLocal = './chave-firebase.json';

const fs = require('fs');

if (fs.existsSync(caminhoRender)) {
    serviceAccount = require(caminhoRender);
    console.log("✅ Chave encontrada no cofre da Render!");
} else if (fs.existsSync(caminhoLocal)) {
    serviceAccount = require(caminhoLocal);
    console.log("✅ Chave encontrada na pasta local!");
} else {
    console.error("❌ ERRO CRÍTICO: O arquivo chave-firebase.json não foi encontrado!");
}
