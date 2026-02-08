
// Cole este código dentro de: netlify/functions/create-preference.js

const { MercadoPagoConfig, Preference } = require('mercadopago');

// A chave secreta será lida das "variáveis de ambiente" do Netlify.
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

exports.handler = async (event, context) => {
  // A função só aceita requisições do tipo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Pega os dados (título e preço) que o frontend enviou
    const { title, price } = JSON.parse(event.body);

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'task-payment',
            title: title,
            quantity: 1,
            unit_price: Number(price),
          },
        ],
      },
    });

    // Retorna o ID da preferência para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ preferenceId: result.id }),
    };

  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao criar a preferência de pagamento.' }),
    };
  }
};
