const express = require("express");
const routerempresa = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { pool } = require("./conexao");
const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

routerempresa.post("/loginEmpresa", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca empresa pelo email
        const [result] = await pool.query(
            "SELECT * FROM tbl_empresa WHERE email = ?",
            [email]
        );

        if (result.length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Empresa não encontrada."
            });
        }

        const empresa = result[0];

        // Verifica senha
        const senhaCorreta = await bcrypt.compare(senha, empresa.senha);
        if (!senhaCorreta) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Senha incorreta."
            });
        }

        // TOKEN GERADO COM O ID CERTO
        const token = jwt.sign(
            {
                id: empresa.id,      // <-- CAMPO REAL DA TABELA
                tipo: "empresa",
                nome: empresa.nome,
                cnpj: empresa.cnpj
            },
            SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            sucesso: true,
            mensagem: "Login bem-sucedido!",
            token,
            dados: empresa
        });

    } catch (erro) {
        console.log("Erro no loginEmpresa:", erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        });
    }
});

module.exports = routerempresa;
