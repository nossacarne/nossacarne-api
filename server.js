const express = require('express');
const cors = require('cors');

const app = express();

// Configurações básicas
app.use(express.json()); // Ensina o servidor a entender dados em formato JSON
app.use(cors()); // Permite conexões do seu site no GitHub

// 1. Rota de teste (Para você ver se o servidor está vivo)
app.get('/', (req, res) => {
    res.send('🔥 A Cozinha do Nossa Carne está ONLINE e pronta para receber pedidos!');
});

// 2. Rota que vai receber as reservas do seu site no futuro
app.post('/api/reservas', (req, res) => {
    const dadosDaReserva = req.body;
    
    // Por enquanto, ele só vai imprimir no terminal do VS Code o que chegou
    console.log("CHEGOU UMA NOVA RESERVA NA COZINHA:", dadosDaReserva);

    // E devolve um aviso de sucesso
    res.json({ 
        sucesso: true, 
        mensagem: "Reserva processada pelo Back-end!" 
    });
});

// Liga o servidor na porta 3000
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando com sucesso! Acesse: http://localhost:${PORTA}`);
});