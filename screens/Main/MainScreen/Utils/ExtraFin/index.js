import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const App = () => {
  const generatePDF = async () => {
    try {
      // Obter a data atual e formatá-la como DD/MM/YYYY
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${today.getFullYear()}`;

      const Vencimento = formattedDate;
      const Local_de_Pagamento = 'Pagavel em qualquer banco até o vencto, após somente no banco emissor.';
      const EspecieDc = 'FT';
      const Aceite = 'SIM';
      const Data_Processamento = formattedDate;
      const Data_Documento = formattedDate;
      const Uso_Banco = ' ';
      const Numero_Documento = ' ';
      const Carteira = '02';
      const Especie = 'R$';
      const Quantidade = '1';
      const Valor = '0.00 ';
      const Valor_Documento = '280.00 ';
      const Instrucoes = 'JUROS POR DIA DE ATRASO: R$0  SERÁ PROTESTADO APÓS 5 DIAS DO VENCIMENTO  -->ATENÇÃO: NÃO PAGUE AO REPRESENTANTE<--   DÚVIDAS LIGUE:(11)   DPTO COBRANÇA EMAIL: ';
      const Desconto = '0.00';
      const Outra_Deducoes =  '0.00';
      const Multa_Mora =  '0.00';
      const Outros_Acrescimos =  '0.00';
      const Valor_Cobrado =  '0.00';
      const Nosso_Numero =  '0.00';
      const Cedente = '  ';
      const Codigo_Cedente = ' ';

      // Generate PDF content
      const htmlContent = `
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
              .section-title {
                  font-weight: bold;
                  margin-bottom: 5px;
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
              .table-cell:last-child {
                  border-right: none;
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
                  <img src="https://banco.bradesco/erro-404/assets/img/logo.svg" alt="Bradesco Logo">
                  <div class="codes">
                      <span>237-2</span> | <span>2379</span> | <span>90000</span> | <span>69000</span> | <span>6 800000000087064</span>
                  </div>
              </div>

              <div class="section">
                  <div class="table">
                      <div class="table-row">
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Local de Pagamento </span>
                              <input type="text" style="width: 100%; border: none;" value="${Local_de_Pagamento}" readonly>
                          </div>
                          <div class="table-cell2">
                              <span style="font-size: 10px; vertical-align: top"> Vencimento </span>
                              <input type="text" style="width: 100%; border: none;" value="${Vencimento}" readonly>
                          </div> 
                      </div>
                  </div>
              </div>

              <div class="section">
                  <div class="table">
                      <div class="table-row">
                          <div class="table-cell"> 
                              <span style="font-size: 10px; vertical-align: top"> Cedente </span>
                              <input type="text" style="width: 100%; border: none;" value="${Cedente}" readonly>
                          </div>
                          <div class="table-cell">  
                              <span style="font-size: 10px; vertical-align: top"> Agencia/ Codigo do Cedente </span>
                              <input type="text" style="width: 100%; border: none;" value="${Codigo_Cedente}" readonly>
                          </div> 
                      </div>
                  </div>
              </div>

              <div class="section">
                  <div class="table">
                      <div class="table-row">
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Data do Documento </span>
                              <input type="text" style="width: 100%; border: none;" value="${Data_Documento}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Numero do Documento </span>
                              <input type="text" style="width: 100%; border: none;" value="${Numero_Documento}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Especie do Documento </span>
                              <input type="text" style="width: 100%; border: none;" value="${EspecieDc}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Aceite </span>
                              <input type="text" style="width: 100%; border: none;" value="${Aceite}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Data Processamento </span>
                              <input type="text" style="width: 100%; border: none;" value="${Data_Processamento}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Nosso Numero </span>
                              <input type="text" style="width: 100%; border: none;" value="${Nosso_Numero}" readonly>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="section">
                  <div class="table">
                      <div class="table-row">
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Uso do Banco </span>
                              <input type="text" style="width: 100%; border: none;" value="${Uso_Banco}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Carteira </span>
                              <input type="text" style="width: 100%; border: none;" value="${Carteira}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Especie </span>
                              <input type="text" style="width: 100%; border: none;" value="${Especie}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Quantidade </span>
                              <input type="text" style="width: 100%; border: none;" value="${Quantidade}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Valor </span>
                              <input type="text" style="width: 100%; border: none;" value="${Valor}" readonly>
                          </div>
                          <div class="table-cell">
                              <span style="font-size: 10px; vertical-align: top"> Valor do Documento </span>
                              <input type="text" style="width: 100%; border: none;" value="${Valor_Documento}" readonly>
                          </div>
                      </div>
                  </div>
              </div>
                <table style="border-collapse: collapse; width: 100%; height: 208px;" border="1">
                    <tbody>
                      <tr style="height: 43px; vertical-align: top;">
                        <td style="width: 80%; height: 208px; text-align: justify; vertical-align: top;" rowspan="6">
                          <span style="font-size: 10px; vertical-align: top;"> Instruções (Testo de Responsabilidade do Cedente)</span>
                          <input type="text" style="width: 100%; border: none;" value="${Instrucoes}" readonly>
                        </td>
                        <td style="width: 20.405%; height: 43px;">
                          <span style="font-size: 10px; vertical-align: top;"> (-) Desconto/ Abatimento </span>
                          <input type="text" style="width: 100%; border: none;" value="${Desconto}" readonly>
                        </td>
                      </tr>
                      
                      <tr style="height: 34px; vertical-align: top;">
                        <td style="width: 60%; height: 41px; vertical-align: top;">
                          <span style="font-size: 10px; vertical-align: top;"> (-) Outras Deduções </span>
                          <input type="text" style="width: 100%; border: none;" value="${Outra_Deducoes}" readonly>
                        </td>
                      </tr>
                      
                      <tr style="height: 29px; vertical-align: top;">
                        <td style="width: 60%; height: 40px;">
                          <span style="font-size: 10px; vertical-align: top;"> (+) Multa/ Mora </span>
                          <input type="text" style="width: 100%; border: none;" value="${Multa_Mora}" readonly>
                        </td>
                      </tr>
                      
                      <tr style="height: 37px; vertical-align: top;">
                        <td style="width: 60%; height: 37px;">
                          <span style="font-size: 10px; vertical-align: top;"> (+) Outros Acrescimos </span>
                          <input type="text" style="width: 100%; border: none;" value="${ Outros_Acrescimos}" readonly>
                        </td>
                      </tr>
                      
                      <tr style="height: 47px; vertical-align: top;">
                        <td style="width: 60%; height: 47px;">
                          <span style="font-size: 10px; vertical-align: top;"> (+) Valor Cobrado </span>
                          <input type="text" style="width: 100%; border: none;" value="${Valor_Cobrado}" readonly>
                        </td>
                      </tr>
                    
                    </tbody>
                </table>
              <div class="barcode"></div>
              <div class="footer">
                  FICHA DE COMPENSAÇÃO
              </div>
          </div>
      </body>
      </html>
      `;

      // Generate PDF
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Definir o caminho de destino no diretório de documentos
      const timestamp = Date.now();
      const fileName = `sample_${timestamp}.pdf`;
      const destinationPath = `${FileSystem.documentDirectory}${fileName}`;

      // Mover o PDF para o diretório de documentos
      await FileSystem.moveAsync({
        from: pdfUri,
        to: destinationPath,
      });

      Alert.alert(
        'Success',
        `PDF saved to ${destinationPath}`,
        [
          {
            text: 'Share PDF',
            onPress: async () => {
              const isAvailable = await Sharing.isAvailableAsync();
              if (isAvailable) {
                await Sharing.shareAsync(destinationPath);
              } else {
                Alert.alert('Error', 'Sharing is not available on this device.');
              }
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('Error generating or saving PDF:', error);
      Alert.alert('Error', `Failed to generate or save PDF: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PDF Generator</Text>
      <Button title="Generate and Save PDF" onPress={generatePDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default App;