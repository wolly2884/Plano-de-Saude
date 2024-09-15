import axios from 'axios';
import url from '../components/Url_api';

export const Postmedi = async (userData) => {
  const uri = url + '/Medicamento';
  try {
    const response = await axios.post(uri, userData, {
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
