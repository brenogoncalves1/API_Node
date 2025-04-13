import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/produtos', async (req, res) => {
    try {
        if (!req.body.nome) {
            return res.status(400).json({ error: 'O nome é obrigatório' });
        }

        const preco = parseFloat(req.body.preco);
        if (isNaN(preco) || preco < 0) {
            return res.status(400).json({ error: 'O preço deve ser um número válido e não pode ser negativo' });
        }

        const estoque = parseInt(req.body.estoque);
        if (isNaN(estoque) || estoque < 0) {
            return res.status(400).json({ error: 'O estoque deve ser um número inteiro válido e não pode ser negativo' });
        }

        const produto = await prisma.produto.create({
            data: {
                nome: req.body.nome,
                descricao: req.body.descricao || '',
                preco: req.body.preco,
                estoque: req.body.estoque,
            },
        });

        res.status(201).json(produto); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o produto' });
    }
});

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();  
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);  
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque } = req.body;
    
    try {
        const produto = await prisma.produto.update({
            where: { id: String(id) },
            data: { nome, descricao, preco, estoque },
        });

        res.status(200).json(produto);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);  
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await prisma.produto.delete({
            where: { id: String(id) }
        });

        res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);  
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

// Porta dinâmica
const port = process.env.PORT || 3000;  // Usa a porta fornecida pelo ambiente
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
