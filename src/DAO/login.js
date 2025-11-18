// Seleciona o botão de login
document.getElementById("btnLogin").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const tipo = document.getElementById("tipo").value; // candidato ou empresa
    const msg = document.getElementById("msg");

    // Validação simples dos campos
    if (!email || !senha || !tipo) {
        msg.innerText = "❌ Preencha todos os campos!";
        return;
    }

    try {
        // Requisição POST para login
        const resposta = await fetch("https://faithful-spirit-teste1.up.railway.app/tcc/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha, tipo })
        });

        const data = await resposta.json();
        console.log("Dados do backend:", data);

        if (data.sucesso) {
            msg.innerText = "✅ Login realizado! Redirecionando...";

            // Normaliza os dados do usuário
            const usuario = {
                id: data.usuario.id,
                tipo: data.usuario.tipo,
                nome: data.usuario.nome || data.usuario.nome_completo || "Sem nome"
            };

            // Salva no localStorage
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            localStorage.setItem("token", data.token);

            // Redireciona conforme tipo
            if (usuario.tipo === "empresa") {
                window.location.href = "./paginainicialempresa.html";
            } else {
                window.location.href = "./paginainicialcandidato.html";
            }

        } else {
            msg.innerText = "❌ " + data.mensagem;
        }

    } catch (erro) {
        console.error("Erro ao conectar com o servidor:", erro);
        msg.innerText = "❌ Erro ao conectar com o servidor.";
    }
});
