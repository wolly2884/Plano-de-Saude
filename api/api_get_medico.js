import axios from 'axios';
import url from '../components/Url_api'

export const Getmed = async (id) => {
  const uri = url + '/Medico/get/' + id;
  try {
    const response = await axios.get(uri, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      throw new Error('Erro ao encontrar os dados');
    }

    // Check if response data is null
    if (response.data === null) {
      console.log('Response data is null');
      return {"sucesso": false};
    }

    return {"sucesso": response.data.rows.length !== 0 ?  true : false, "resposta" : response.data.rows}; // Retornar os dados da resposta
  } catch (error) {
    console.error('Error:', error);
    return {"sucesso" : false};
  }
};