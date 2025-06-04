import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert,  TouchableOpacity, Platform, Linking } from 'react-native';
import InputTexto from '../../../../../components/InputTexto';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as IntentLauncher from 'expo-intent-launcher';
import { getStyles } from './styles';
import { useTheme } from '../../../../../context/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import Rodape from '../../../../../components/Rodape';

const App = ({ route, navigation }) => {
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Boletos');
  const [folders, setFolders] = useState(['Boletos', 'Downloads']);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [boletoImage] = useState('https://banco.bradesco/erro-404/assets/img/logo.svg');
    const { theme } = useTheme();
    const styles = getStyles(theme);
  const [boletoData, setBoletoData] = useState({
    Vencimento: '',
    Local_de_Pagamento: 'Pagável em qualquer banco até o vencimento, após somente no banco emissor.',
    EspecieDc: 'FT',
    Aceite: 'SIM',
    Data_Processamento: '',
    Data_Documento: '',
    Uso_Banco: ' ',
    Numero_Documento: ' ',
    Carteira: '02',
    Especie: 'R$',
    Quantidade: '1',
    Valor: '0.00',
    Valor_Documento: '280.00',
    Instrucoes: 'JUROS POR DIA DE ATRASO: R$0  SERÁ PROTESTADO APÓS 5 DIAS DO VENCIMENTO  -->ATENÇÃO: NÃO PAGUE AO REPRESENTANTE<--   DÚVIDAS LIGUE:(11)   DPTO COBRANÇA EMAIL: ',
    Desconto: '0.00',
    Outra_Deducoes: '0.00',
    Multa_Mora: '0.00',
    Outros_Acrescimos: '0.00',
    Valor_Cobrado: '0.00',
    Nosso_Numero: '0.00',
    Cedente: ' ',
    Codigo_Cedente: ' ',
    Sacado: '',
  });

  const { familyTotalBalance, ano, mes, id, sacado } = route.params || {};

  const formatDate = (year, month) => {
    let date;
    let day = new Date().getDate().toString().padStart(2, '0');
    month = month ? month.toString().padStart(2, '0') : '05';
    year = year ? year.toString().padStart(4, '0') : new Date().getFullYear().toString();

    if (year && month && day && !isNaN(new Date(year, month - 1, day))) {
      date = new Date(year, month - 1, day);
    } else {
      date = new Date();
    }
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatSacado = (sacadoData) => {
    if (!sacadoData || Object.values(sacadoData).every(val => !val || val === 'Desconhecido')) {
      return '';
    }
    const {
      nm_sacado = 'Desconhecido',
      nm_sacado_cpf = 'Desconhecido',
      nm_sacado_logradouro = 'Desconhecido',
      nm_sacado_numero = 'Desconhecido',
      nm_sacado_complemento = 'Desconhecido',
      nm_sacado_cidade = 'Desconhecido',
      nm_sacado_estado = 'Desconhecido',
      nm_sacado_cep = 'Desconhecido',
    } = sacadoData;

    const addressLine = [
      nm_sacado_logradouro !== 'Desconhecido' ? nm_sacado_logradouro : null,
      nm_sacado_numero !== 'Desconhecido' ? `Nº ${nm_sacado_numero}` : null,
      nm_sacado_complemento !== 'Desconhecido' ? nm_sacado_complemento : null,
    ].filter(part => part).join(', ');

    const cityStateLine = [
      nm_sacado_cidade !== 'Desconhecido' ? nm_sacado_cidade : null,
      nm_sacado_estado !== 'Desconhecido' ? nm_sacado_estado : null,
    ].filter(part => part).join(', ');

    const fields = [
      nm_sacado !== 'Desconhecido' ? nm_sacado : null,
      nm_sacado_cpf !== 'Desconhecido' ? `Cpf : ${nm_sacado_cpf}` : null,
      addressLine || null,
      cityStateLine || null,
      nm_sacado_cep !== 'Desconhecido' ? `Cep: ${nm_sacado_cep}` : null,
    ].filter(field => field);

    return fields.join('<br>');
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
        Alert.alert('Erro', 'Plataforma não suportada para abrir o PDF.');
      }
    } catch (error) {
      console.error('Erro ao abrir o PDF:', error);
      Alert.alert('Erro', `Falha ao abrir o PDF: ${error.message}`);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'Permissões de armazenamento são necessárias para salvar PDFs.');
      }

      try {
        const directory = FileSystem.documentDirectory;
        const contents = await FileSystem.readDirectoryAsync(directory);
        const subDirectories = [];
        for (const item of contents) {
          const info = await FileSystem.getInfoAsync(`${directory}${item}`);
          if (info.isDirectory && item.match(/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s_-]+$/)) {
            subDirectories.push(item);
          }
        }
        setFolders(['Boletos', 'Downloads', ...subDirectories]);
        setSelectedFolder('Boletos');

        const today = formatDate(ano, mes, id);
        const formattedSacado = formatSacado(sacado);
        setBoletoData((prev) => ({
          ...prev,
          Vencimento: today,
          Data_Processamento: today,
          Data_Documento: today,
          Valor_Documento: familyTotalBalance ? familyTotalBalance.toString() : prev.Valor_Documento,
          Sacado: formattedSacado,
        }));
      } catch (error) {
        console.error('Erro ao carregar pastas:', error);
        Alert.alert('Erro', `Falha ao carregar pastas: ${error.message}`);
      }
    };
    initialize();
  }, [ano, mes, id, familyTotalBalance, sacado]);

  const handleInputChange = (field, value) => {
    setBoletoData((prev) => ({ ...prev, [field]: value }));
  };

  const getInputStyle = (isValid) => ({
    ...styles.inputContainer,
    ...(isValid ? styles.dropdownError : {}),
  });

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      if (!selectedFolder || selectedFolder.trim() === '') {
        Alert.alert('Erro', 'Por favor, selecione ou crie uma pasta válida.');
        return;
      }

      if (!boletoData.Valor_Documento || !boletoData.Vencimento || !boletoData.Sacado || boletoData.Sacado === '') {
        Alert.alert('Erro', 'Por favor, preencha o valor do documento, a data de vencimento e o sacado válido.');
        return;
      }

      if (!boletoData.Vencimento.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        Alert.alert('Erro', 'Data de vencimento deve estar no formato DD/MM/YYYY.');
        return;
      }

      const { uri: pdfUri } = await Print.printToFileAsync({
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ficha de Compensação - Bradesco</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              .boleto {
                border: 1px solid #000;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px dashed #000;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              .header img {
                height: 40px;
              }
              .header .codes {
                font-size: 14px;
                font-weight: bold;
              }
              .section {
                margin-bottom: 0.1px;
              }
              .table {
                border: 1px solid #000;
                width: 100%;
                box-sizing: border-box;
              }
              .table-row {
                display: flex;
                border-bottom: 1px solid #000;
              }
              .table-row:last-child {
                border-bottom: none;
              }
              .table-cell {
                flex: 1;
                padding: 5px;
                border-right: 1px solid #000;
                min-height: 30px;
                min-width: 90px;
              }
              .table-cell2 {
                flex: 1;
                padding: 5px;
                border-right: 1px solid #000;
                min-height: 20px;
                min-width: 30px;
              }
              .table-cell:last-child, .table-cell2:last-child {
                border-right: none;
              }
              .table-cell span, .table-cell2 span {
                font-size: 10px;
                display: block;
              }
              .sacado-section {
                border: 1px solid #000;
                padding: 8px;
                margin-top: 10px;
                font-size: 11px;
                line-height: 1.5;
              }
              .sacado-section span.label {
                display: block;
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 6px;
              }
              .sacado-section div {
                white-space: pre-wrap;
              }
              .barcode {
                height: 50px;
                background: repeating-linear-gradient(
                  90deg,
                  #000,
                  #000 2px,
                  #fff 2px,
                  #fff 4px
                );
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                border-top: 1px dashed #000;
                padding-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="boleto">
              <div class="header">
                <img src="${boletoImage}" alt="Bradesco Logo">
                <div class="codes">
                  <span>237-2</span> | <span>2379</span> | <span>90000</span> | <span>69000</span> | <span>6 800000000087064</span>
                </div>
              </div>
              <div class="section">
                <div class="table">
                  <div class="table-row">
                    <div class="table-cell"><span>Local de Pagamento</span><span>${boletoData.Local_de_Pagamento}</span></div>
                    <div class="table-cell2"><span>Vencimento</span><span>${boletoData.Vencimento}</span></div>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="table">
                  <div class="table-row">
                    <div class="table-cell"><span>Cedente</span><span>${boletoData.Cedente}</span></div>
                    <div class="table-cell"><span>Agência/Código do Cedente</span><span>${boletoData.Codigo_Cedente}</span></div>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="table">
                  <div class="table-row">
                    <div class="table-cell"><span>Data do Documento</span><span>${boletoData.Data_Documento}</span></div>
                    <div class="table-cell"><span>Número do Documento</span><span>${boletoData.Numero_Documento}</span></div>
                    <div class="table-cell"><span>Espécie do Documento</span><span>${boletoData.EspecieDc}</span></div>
                    <div class="table-cell"><span>Aceite</span><span>${boletoData.Aceite}</span></div>
                    <div class="table-cell"><span>Data Processamento</span><span>${boletoData.Data_Processamento}</span></div>
                    <div class="table-cell"><span>Nosso Número</span><span>${boletoData.Nosso_Numero}</span></div>
                  </div>
                </div>
              </div>
              <div class="section">
                <div class="table">
                  <div class="table-row">
                    <div class="table-cell"><span>Uso do Banco</span><span>${boletoData.Uso_Banco}</span></div>
                    <div class="table-cell"><span>Carteira</span><span>${boletoData.Carteira}</span></div>
                    <div class="table-cell"><span>Espécie</span><span>${boletoData.Especie}</span></div>
                    <div class="table-cell"><span>Quantidade</span><span>${boletoData.Quantidade}</span></div>
                    <div class="table-cell"><span>Valor</span><span>${boletoData.Valor}</span></div>
                    <div class="table-cell"><span>Valor do Documento</span><span>${boletoData.Valor_Documento}</span></div>
                  </div>
                </div>
              </div>
              <table style="border-collapse: collapse; width: 100%; height: 208px;" border="1">
                <tbody>
                  <tr style="height: 43px; vertical-align: top;">
                    <td style="width: 80%; height: 208px; text-align: justify; vertical-align: top;" rowspan="6">
                      <span style="font-size: 10px;">Instruções (Texto de Responsabilidade do Cedente)</span>
                      <span>${boletoData.Instrucoes}</span>
                    </td>
                    <td style="width: 20.405%; height: 43px;">
                      <span style="font-size: 10px;">(-) Desconto/Abatimento</span>
                      <span>${boletoData.Desconto}</span>
                    </td>
                  </tr>
                  <tr style="height: 34px; vertical-align: top;">
                    <td style="width: 20.405%; height: 41px;">
                      <span style="font-size: 10px;">(-) Outras Deduções</span>
                      <span>${boletoData.Outra_Deducoes}</span>
                    </td>
                  </tr>
                  <tr style="height: 29px; vertical-align: top;">
                    <td style="width: 20.405%; height: 40px;">
                      <span style="font-size: 10px;">(+) Multa/Mora</span>
                      <span>${boletoData.Multa_Mora}</span>
                    </td>
                  </tr>
                  <tr style="height: 37px; vertical-align: top;">
                    <td style="width: 20.405%; height: 37px;">
                      <span style="font-size: 10px;">(+) Outros Acréscimos</span>
                      <span>${boletoData.Outros_Acrescimos}</span>
                    </td>
                  </tr>
                  <tr style="height: 47px; vertical-align: top;">
                    <td style="width: 20.405%; height: 47px;">
                      <span style="font-size: 10px;">(+) Valor Cobrado</span>
                      <span>${boletoData.Valor_Cobrado}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="barcode"></div>
              <div class="sacado-section">
                <span class="label">Sacado</span>
                <div>${boletoData.Sacado}</div>
              </div>
              <div class="footer">FICHA DE COMPENSAÇÃO</div>
            </div>
          </body>
          </html>
        `,
        base64: false,
      });

      const fileInfo = await FileSystem.getInfoAsync(pdfUri);
      if (!fileInfo.exists) {
        throw new Error('PDF file does not exist at: ' + pdfUri);
      }

      let destinationPath = '';
      let successMessage = '';

      if (selectedFolder === 'Downloads') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          const customDirectory = `${FileSystem.documentDirectory}Boletos/`;
          await FileSystem.makeDirectoryAsync(customDirectory, { intermediates: true });
          const fileName = `boleto_${boletoData.Vencimento.replace(/\//g, '-')}_${Date.now()}.pdf`;
          destinationPath = `${customDirectory}${fileName}`;
          await FileSystem.moveAsync({ from: pdfUri, to: destinationPath });
          successMessage = `Permissão negada. PDF salvo em ${destinationPath}`;
        } else {
          try {
            const fileName = `boleto_${boletoData.Vencimento.replace(/\//g, '-')}_${Date.now()}.pdf`;
            const asset = await MediaLibrary.createAssetAsync(pdfUri);
            await MediaLibrary.createAlbumAsync('Download', asset, false);
            successMessage = 'PDF salvo na pasta Downloads.';
            destinationPath = pdfUri;
          } catch (mediaError) {
            const customDirectory = `${FileSystem.documentDirectory}Boletos/`;
            await FileSystem.makeDirectoryAsync(customDirectory, { intermediates: true });
            const fileName = `boleto_${boletoData.Vencimento.replace(/\//g, '-')}_${Date.now()}.pdf`;
            destinationPath = `${customDirectory}${fileName}`;
            await FileSystem.moveAsync({ from: pdfUri, to: destinationPath });
            successMessage = `Erro ao salvar em Downloads: ${mediaError.message}. PDF salvo em ${destinationPath}`;
          }
        }
      } else {
        const customDirectory = `${FileSystem.documentDirectory}${selectedFolder}/`;
        await FileSystem.makeDirectoryAsync(customDirectory, { intermediates: true });
        const fileName = `boleto_${boletoData.Vencimento.replace(/\//g, '-')}_${Date.now()}.pdf`;
        destinationPath = `${customDirectory}${fileName}`;
        await FileSystem.moveAsync({ from: pdfUri, to: destinationPath });
        successMessage = `PDF salvo em ${destinationPath}`;
      }

      Alert.alert(
        'Sucesso',
        successMessage,
        [
          {
            text: 'Abrir PDF',
            onPress: async () => {
              await openPDF(destinationPath || pdfUri);
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      let message = 'Falha ao gerar ou salvar o PDF.';
      if (error.message.includes('permission')) {
        message = 'Permissão de armazenamento negada.';
      } else if (error.message.includes('file')) {
        message = 'Erro ao acessar o sistema de arquivos.';
      }
      console.error('Erro ao gerar ou salvar o PDF:', error);
      Alert.alert('Erro', `${message}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
    <View style={styles.container}>
      <Text style={styles.title}>Confira os Dados Para a Geração do Boleto</Text>
      <Text style={styles.label}>Valor do Documento</Text>

      <View style={{ width: '100%' }}>
        <InputTexto
          placeholderTextColor={theme.placeholderColor}
          style={getInputStyle(true)}
          text="Valor do Documento"
          value={"R$ " + boletoData.Valor_Documento}
          editar={false}
        />
      </View>
      <Text style={styles.label}>Data de Vencimento (DD/MM/YYYY)</Text>

      <View style={{ width: '100%' }}>
        <InputTexto
          placeholderTextColor={theme.placeholderColor}
          style={getInputStyle(true)}
          text="Data de Vencimento (DD/MM/YYYY)"
          value={boletoData.Vencimento}
          editar={false}
        />
      </View>
      <Text style={styles.label}>Sacado</Text>

      <View style={{ width: '100%' }}>
        <InputTexto
          placeholderTextColor={theme.placeholderColor}
          style={getInputStyle(true)}
          text="Sacado"
          value={boletoData.Sacado}
          editar={false}
          multiline={true}
          numberOfLines={6}
        />
      </View>
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%'}}>
      <TouchableOpacity style={styles.searchButton} onPress={() => generatePDF()}>
        <View style={styles.menuview}>
          <Text style={styles.searchButtonText}>{isLoading ? 'Gerando...' : 'Gerar e Salvar PDF'}</Text>
        </View>
        <AntDesign name="right" size={24} color="white" />
        <AntDesign name="right" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchButton} onPress={() => navigation.goBack()}>
        <View style={styles.menuview}>
          <Text style={styles.searchButtonText}>Voltar</Text>
        </View>
        <AntDesign name="left" size={24} color="white" /> 
      </TouchableOpacity>
      </View>
        </View>
        <Rodape />
    </View>
  );
};

export default App;