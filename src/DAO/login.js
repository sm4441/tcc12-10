const { conexao } = require('./conexao');
const bcrypt = require('bcryptjs');
document.getElementById("btnLogin").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value;
    const msg = document.getElementById("msg");

    if (!email || !senha) {
        msg.innerText = "Preencha todos os campos!";
        return;
    }

    try {
        const resposta = await fetch("https://faithful-spirit-teste1.up.railway.app/tcc/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha, tipo })
        });

        const data = await resposta.json();

        if (data.sucesso) {
            // ✅ Salva token e dados do usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("nome", data.usuario.nome || data.usuario.nome_completo);
            localStorage.setItem("tipo", data.usuario.tipo);

            msg.innerText = "✅ Login realizado! Redirecionando...";

            // Redireciona para a página correta
            if (data.usuario.tipo === "empresa") {
                window.location.href = "./paginainicialempresa.html";
            } else {
                window.location.href = "./paginainicialcandidato.html";
            }
        } else {
            msg.innerText = "❌ " + data.mensagem;
        }

    } catch (erro) {
        msg.innerText = "Erro ao conectar com o servidor.";
        console.error(erro);
    }
});
