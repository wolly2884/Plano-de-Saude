import React from 'react';
import { View, TouchableOpacity, Linking, Text } from 'react-native';
import {styles} from './styles'
import Rodape  from '../../../../../components/Rodape'

const DownloadPDFScreen = () => {
  const ComponentedeContedoeEstrutura = 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/PadroTISS_ComponentedeContedoeEstrutura_202211.zip';
  const ComponenteOrganizacional = 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/PadroTISS_ComponenteOrganizacional_202403.pdf';
  const TUSS = 'https://www.ans.gov.br/arquivos/extras/tiss/Padrao_TISS_Representacao_de_Conceitos_em_Saude_202403.zip'
  const SegurancaPrivacidade = 'https://www.gov.br/ans/pt-br/arquivos/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss/padrao-tiss/PadroTISS_segurana_202305.zip'

  const ComponenteComunicacao = 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-2013-tiss/PadroTISSComunicao202301.zip'
  const handleDownload = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error('Não é possível abrir este link');
      }
    } catch (error) {
      console.error('Erro ao abrir o link:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download de Manuais e Arquivos</Text>
      
      <Text style={styles.title}>Padrão Tiss</Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity style={styles.button} onPress={() => handleDownload(ComponentedeContedoeEstrutura)}>
          <Text style={styles.buttonText}>Componente de Conteúdo e Estrutura</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => handleDownload(ComponenteOrganizacional)}>
          <Text style={styles.buttonText}>Componente Organizacional</Text>
        </TouchableOpacity>    
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity style={styles.button} onPress={() => handleDownload(TUSS)}>
          <Text style={styles.buttonText}>Representacao de Conceitos em Saude</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleDownload(SegurancaPrivacidade)}>
          <Text style={styles.buttonText}> Componente de Segurança e Privacidade</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity style={styles.button} onPress={() => handleDownload(ComponenteComunicacao)}>
          <Text style={styles.buttonText}>Componente de Comunicação</Text>
        </TouchableOpacity>
      </View>
      <Rodape />
    </View>
  );
};



export default DownloadPDFScreen;
