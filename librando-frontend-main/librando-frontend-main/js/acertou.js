document.addEventListener("DOMContentLoaded", async () => {
    const button = document.getElementById('enviarBtn');
    const url = CONFIG.URL

    button.addEventListener("click", async () => {
        const id = localStorage.getItem("id"); // ✅ jeito certo
        try {
            const res = await fetch(`${url}/update-streak/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (!res.ok) {
                console.error('Erro ao atualizar streak');
                return;
            }

            // ✅ Só redireciona depois que salvar com sucesso
            window.location.href = "caminho.html";

        } catch (err) {
            console.error('Falha na requisição:', err);
        }
    });
});

