import axios from 'axios';
import { API_URL_CHATBOT, authorization_chat } from '@env';

const ChatMessage = async (message) => {
  try {
    const options = {
      method: "POST",
      url: API_URL_CHATBOT,
      headers: {
        'authorization': authorization_chat,
        'Content-Type': 'application/json',
      },
      data: {
        providers: "openai,cohere",
        text: message,
        temperature: 0.2,
        max_tokens: 250,
        fallback_providers: "",
      },
    };

    // Envia a solicitação para a API da Eden AI
    const response = await axios.request(options);

    return response.data.cohere.generated_text;
  } catch (error) {
    console.error('Error sending chat message:', error?.response?.data || error.message);
    throw error;
  }
};

export { ChatMessage };
