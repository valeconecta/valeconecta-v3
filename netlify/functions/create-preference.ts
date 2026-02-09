// Esta é uma função serverless da Netlify.
// O nome do arquivo (create-preference.ts) se torna o endpoint.
// A regra de reescrita no netlify.toml torna-a acessível em /api/create-preference.

// Importa os tipos do Netlify Functions para ter type-safety.
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Permite requisições de qualquer origem (CORS).
  // Em produção, você pode restringir isso ao seu domínio.
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Responde a requisições OPTIONS (pre-flight) para CORS.
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Garante que apenas o método POST seja aceito.
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    // Em uma aplicação real, você usaria a SDK do Mercado Pago aqui
    // com sua CHAVE PRIVADA (guardada como variável de ambiente) para criar
    // uma preferência de pagamento real.
    // Ex: const body = JSON.parse(event.body || "{}");
    // const preference = await mercadopago.preferences.create({ ... });

    // Para este exemplo, simulamos uma resposta de sucesso como o frontend espera.
    const mockPreferenceId = `mock-preference-id-${Date.now()}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ preferenceId: mockPreferenceId }),
    };
  } catch (error) {
    console.error("Erro ao criar preferência (simulado):", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Falha ao criar a preferência de pagamento." }),
    };
  }
};

export { handler };
