const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

const app = express();

// --- 1. CONFIGURAÇÃO DE PERMISSÕES (CORS) ---
// Isso permite que o seu site no GitHub converse com este servidor na Render
app.use(cors());
app.use(express.json());

// --- 2. CARREGAMENTO DA CHAVE MESTRA (FIREBASE) ---
let serviceAccount;

const caminhoRender = '/etc/secrets/chave-firebase.json';
const caminhoLocal = './chave-firebase.json';

if (fs.existsSync(caminhoRender)) {
    serviceAccount = require(caminhoRender);
    console.log("✅ Chave encontrada no cofre da Render!");
} else if (fs.existsSync(caminhoLocal)) {
    serviceAccount = require(caminhoLocal);
    console.log("✅ Chave encontrada na pasta local do VS Code!");
} else {
    console.error("❌ ERRO CRÍTICO: O arquivo chave-firebase.json não foi encontrado em nenhum lugar!");
}

// Inicializa o Firebase se a chave existir
if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Conexão com Firebase Admin estabelecida com sucesso!");
    } catch (erro) {
        console.error("❌ ERRO AO INICIALIZAR FIREBASE ADMIN:", erro);
    }
}

const db = admin.firestore();

// --- 3. ROTAS DO SERVIDOR ---

// Rota de teste (para ver se o servidor está vivo)
app.get('/', (req, res) => {
    res.send('🔥 A Cozinha do Nossa Carne está ONLINE e pronta para receber pedidos!');
});

// Rota Principal que recebe as reservas do site
app.post('/api/reservas', async (req, res) => {
    const dadosDaReserva = req.body;
    
    console.log("📩 NOVO PEDIDO RECEBIDO:", dadosDaReserva.nome);

    try {
        // Adiciona informações extras de segurança antes de salvar
        const novaReserva = {
            ...dadosDaReserva,
            status: 'pendente',
            origem: 'GitHub Pages',
            criadoEm: admin.firestore.FieldValue.serverTimestamp()
        };

        // SALVA NA COLEÇÃO 'reservas' DO SEU FIREBASE
        const docRef = await db.collection("reservas").add(novaReserva);
        
        console.log("💾 RESERVA SALVA NO FIREBASE! ID:", docRef.id);

        // Responde ao site que deu tudo certo
        res.json({ 
            sucesso: true, 
            mensagem: "Reserva processada e salva com sucesso!",
            id: docRef.id 
        });

    } catch (erro) {
        console.error("❌ ERRO AO TENTAR SALVAR NO FIREBASE:", erro);
        res.status(500).json({ 
            sucesso: false, 
            erro: "A Cozinha recebeu o pedido, mas não conseguiu guardar na gaveta do banco de dados." 
        });
    }
});

// --- 4. LIGANDO O MOTOR ---
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando com sucesso na porta ${PORTA}`);
});
