import axios from 'axios';
import url from '../components/Url_api';

export const PutAtend = async (userData) => {
  const uri = url + '/Atendimento';

  try {
    const response = await axios.put(uri, userData, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {userData},
    });

    if (response.status !== 200) {
      throw new Error('Erro ao gravar os Dados');
    }

    return response.data.rows; // Retornar os dados da resposta
  } catch (error) {
    console.error('Erro ao gravar os Dados:', error);
    throw error;
  }
};
