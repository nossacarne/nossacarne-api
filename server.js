const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- AJUSTE DE SEGURANÇA PARA A RENDER ---
let serviceAccount;
try {
  // 1. Tenta carregar do cofre secreto da Render (Caminho oficial)
  serviceAccount = require('/etc/secrets/chave-firebase.json');
} catch (err) {
  try {
    // 2. Se falhar, tenta carregar da pasta local (Para quando você testar no PC)
    serviceAccount = require('./chave-firebase.json');
  } catch (e) {
    console.error("❌ ERRO CRÍTICO: Arquivo de chave não encontrado em nenhum lugar!");
  }
}

// Inicializa o Firebase apenas se a chave foi encontrada
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Conexão com Firebase Admin estabelecida!");
}

const db = admin.firestore();
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('🔥 A Cozinha do Nossa Carne está ONLINE!');
});

app.post('/api/reservas', async (req, res) => {
    const dadosDaReserva = req.body;
    console.log("📩 RECEBIDO PEDIDO DE:", dadosDaReserva.nome);

    try {
        // Garante que o status e a data sejam gerados pelo servidor
        const novaReserva = {
            ...dadosDaReserva,
            status: 'pendente',
            criadoEm: admin.firestore.FieldValue.serverTimestamp()
        };

        // SALVA NA COLEÇÃO 'reservas'
        const docRef = await db.collection("reservas").add(novaReserva);
        console.log("💾 SALVO NO FIREBASE COM ID:", docRef.id);

        res.json({ sucesso: true, mensagem: "Reserva salva com sucesso!" });

    } catch (erro) {
        console.error("❌ ERRO AO SALVAR NO BANCO:", erro);
        res.status(500).json({ sucesso: false, erro: "Falha ao salvar no banco de dados." });
    }
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando na porta ${PORTA}`);
});
