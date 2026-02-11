exports.handler = async function(event) {
  try {
    const { amount } = JSON.parse(event.body);

    // Validação de segurança
    if (!amount || amount < 1 || amount > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Valor inválido" })
      };
    }

    const response = await fetch("https://api.elitepaybr.com/api/v1/deposit", {
      method: "POST",
      headers: {
        "x-client-id": process.env.CLIENT_ID,
        "x-client-secret": process.env.CLIENT_SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Number(amount),
        description: "Doação para Dona Josefa",
        payerName: "Doacao Site",
        payerDocument: "54978012856"
      })
    });

    const data = await response.json();

    if (!data.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.message || "Erro na API ElitePay" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        transactionId: data.transactionId,
        qrcodeUrl: data.qrcodeUrl,
        copyPaste: data.copyPaste
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno no servidor" })
    };
  }
};
