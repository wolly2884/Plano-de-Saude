import axios from 'axios';

const API_URL = 'https://api.edenai.run/v2/text/generation';

const ChatMessage = async (message) => {
  try {
    const options = {
      method: "POST",
      url: API_URL,
      headers: {
        'authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGRiOGI1ZGEtM2QzOS00ODJiLWJkZjYtNWI5ODI1NWEyMmUxIiwidHlwZSI6ImFwaV90b2tlbiJ9.XCUh1EvF_EsbhhswsmWxBIpMCTnBiU5hgNGInUfi390",
      },
      data: {
        providers: "openai,cohere",
        text: message,
        temperature: 0.2,
        max_tokens: 250,
        fallback_providers: "",
      },
    };

    console.log(options);

    // Envia a solicitação para a API da Eden AI
    const response = await axios.request(options);

    return response.data.cohere.generated_text;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export { ChatMessage };
