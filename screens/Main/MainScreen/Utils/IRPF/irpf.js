import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, Alert, TouchableOpacity, Platform, Linking, ActivityIndicator,
} from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as IntentLauncher from 'expo-intent-launcher';
import { getStyles } from './styles';
import { useTheme } from '../../../../../context/ThemeContext';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';

const App = ({ route, navigation }) => {
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Boletos');
  const [folders, setFolders] = useState(['Boletos', 'Downloads']);
  const [isLoading, setIsLoading] = useState(false);
  const boletoImage = 'https://nodestart.onrender.com/assets/logo.jpg';
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { familyTotalBalance, ano, mes, id, sacado, Titulos } = route.params || {};

  const [boletoData, setBoletoData] = useState({
    Titulo: 'Demonstrativo Anual de Despesas Médicas IRPF',
    Subtitulo: 'Razão Social: Plano Facil Saúde',
    Cnpj: '12.3456.333/0001-95',
    Beneficiario: 'Nome do Beneficiário',
    Ano_Exercicio: '2022',
    Ano_Calendario: '2021',
    Logo: boletoImage,
    Logo_Alt: 'Logo IPAM',
    Nome: 'Nome do Beneficiário',
    Cpf: '999.999.999-99',
    Logradouro: 'Rua Exemplo',
    Numero: '123',
    Complemento: 'Apto 456',
    Cidade: 'Cidade Exemplo',
    Estado: 'SP',
    Cep: '12345-678',
  });

  const formatDate = (year, month) => {
    const day = new Date().getDate().toString().padStart(2, '0');
    month = month ? month.toString().padStart(2, '0') : '05';
    year = year ? year.toString().padStart(4, '0') : new Date().getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const openPDF = async (fileUri) => {
    try {
      if (Platform.OS === 'android') {
        const fileInfo = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: fileInfo,
          type: 'application/pdf',
          flags: 1,
        });
      } else if (Platform.OS === 'ios') {
        await Linking.openURL(fileUri);
      } else {
        Alert.alert('Erro', 'Plataforma não suportada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o PDF.');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'Permissões de armazenamento são necessárias.');
      }

      try {
        const directory = FileSystem.documentDirectory;
        const contents = await FileSystem.readDirectoryAsync(directory);
        const subDirectories = [];
        for (const item of contents) {
          const info = await FileSystem.getInfoAsync(`${directory}${item}`);
          if (info.isDirectory) subDirectories.push(item);
        }
        setFolders(['Boletos', 'Downloads', ...subDirectories]);
        setSelectedFolder('Boletos');

        const today = formatDate(ano, mes);
        setBoletoData((prev) => ({
          ...prev,
          nome: sacado.nm_sacado || 'Nome do Beneficiário',
          Ano_Exercicio: ano || new Date().getFullYear().toString(),
          Ano_Calendario: ano || new Date().getFullYear().toString(),
          Vencimento: today,
          Data_Processamento: today,
          Data_Documento: today,
          Valor_Documento: familyTotalBalance?.toString() ?? '0,00',
          Sacado: sacado ?? '',
        }));
      } catch (error) {
        Alert.alert('Erro ao carregar pastas', error.message);
      }
    };

    initialize();
  }, [ano, mes, familyTotalBalance, sacado]);

  const Geratr = () => {
    if (!Array.isArray(Titulos)) return '';
    return Titulos.map((titulo) => {
      const nome = titulo.nm_beneficiario || 'Desconhecido';
      const cpf = titulo.cd_cpf || '---';
      const vlContrib = titulo.vl_contribuicao || '0,00';
      const vlCopart = titulo.vl_coparticipacao || '0,00';
      const vlTotal = titulo.vl_total_titulo || '0,00';
      return `
        <tr>
          <td>${nome} CPF: ${cpf}<br>CLIENTE QUITE NO ANO ${boletoData.Ano_Exercicio}</td>
          <td>${vlContrib}</td>
          <td>${vlCopart}</td>
          <td>R$ 0,00</td>
          <td>R$ 0,00</td>
          <td>${vlTotal}</td>
        </tr>
      `;
    }).join('');
  };

  const generatePDF = async () => {
    setIsLoading(true);
    const tr = Geratr();

    try {
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: `
          <html>
          <head>
            <style>
              body { font-family: Arial; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid black; padding: 5px; font-size: 10px; text-align: center; }
              .header, .obs { margin: 10px 0; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="${boletoData.Logo}" alt="${boletoData.Logo_Alt}" height="40" /><br/>
              <h2>${boletoData.Titulo}</h2>
              <p>${boletoData.Subtitulo} - CNPJ: ${boletoData.Cnpj}</p>
            </div>
            <p><strong>Titular:</strong> ${boletoData.nome}</p>
            <p><strong>Ano Exercício:</strong> ${boletoData.Ano_Exercicio} | <strong>Calendário:</strong> ${boletoData.Ano_Calendario}</p>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contribuição</th>
                  <th>Coparticipação</th>
                  <th>Reembolsado</th>
                  <th>Não reembolsado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>${tr}</tbody>
            </table>
            <div class="obs">
              <p><strong>Observações:</strong></p>
              <p>- Declarar apenas os valores dedutíveis</p>
              <p>- Não declarar valores já reembolsados</p>
            </div>
          </body>
          </html>
        `,
        base64: false,
      });

      const fileName = `boleto_${Date.now()}.pdf`;
      const destinationPath = `${FileSystem.documentDirectory}${selectedFolder}/${fileName}`;

      // Cria pasta se necessário
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}${selectedFolder}`, {
        intermediates: true,
      });

      await FileSystem.moveAsync({ from: pdfUri, to: destinationPath });

      Alert.alert('PDF Gerado', 'Arquivo salvo com sucesso!');
      await openPDF(destinationPath);
    } catch (error) {
      Alert.alert('Erro ao gerar PDF', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
    <View style={styles.container}>
      <Text style={styles.title}>Gerar Demonstrativo Imposto Renda</Text>

      <TouchableOpacity onPress={generatePDF} style={styles.closeButton}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.closeButtonText}>Gerar PDF</Text>
        )}
      </TouchableOpacity>
    </View>  
      <Rodape />
    </View>
  );
};

export default App;
