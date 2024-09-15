// DataGenerator.js

export const generateFakeData = async () => {
  const url = `https://api.invertexto.com/v1/faker?token=4222%7Cq8iSzAlqNWE7LsmfktmWKOKxAc496Mgq&fields=name%2Ccpf%2Ccnpj%2Cemail%2Ccompany%2Cbirth_date%2Ccredit_card&locale=pt_BR`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados fictícios:', error);
    throw error;
  }
};
