import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Dimensions,
  ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Rodape from '../../../../../components/Rodape';
import InputTexto from '../../../../../components/InputTexto';
import api from '../../../../../api/api';
import { getStyles } from './styles';
import { useTheme } from '../../../../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCEP, formatCPF } from '../../../../../components/validations';

const cardWidth = Dimensions.get('window').width * 0.85;

export default function FinanceDashboard({ navigation }) {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [anoe, setAnoe] = useState('');
  const [anoc, setAnoc] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [familyTotalBalance, setFamilyTotalBalance] = useState('0.00');
  const [id, setId] = useState('');

  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      setIsLoading(true);
      const storedID = await AsyncStorage.getItem('ID');
      try {
        const { data } = await api.get(`/beneficiario/get/${storedID}`);
        setBeneficiarios(data.rows.map(b => ({
          key: b.id.toString(),
          nm_logradouro: b.nm_logradouro || 'Desconhecido',
          cd_cpf: b.cd_cpf || 'Desconhecido',
          cd_numero: b.cd_numero || 'Desconhecido',
          nm_complemento: b.nm_complemento || 'Desconhecido',
          nm_cidade: b.nm_cidade || 'Desconhecido',
          cd_cep: b.cd_cep || 'Desconhecido',
          sg_estado: b.sg_estado || 'Desconhecido',
          ic_beneficiario: b.ic_beneficiario || 'Desconhecido',
          value: b.nm_beneficiario || 'Desconhecido',
        })));
        setId(storedID);
      } catch (err) {
        console.error('Erro ao buscar beneficiários:', err);
        Alert.alert('Erro', 'Não foi possível carregar os beneficiários.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeneficiarios();
  }, []);

  const fetchTitulos = useCallback(async (fetchAll = false) => {
    if (!anoe || !/^\d{4}$/.test(anoe)) {
      setError(true);
      Alert.alert('Erro', 'Preencha corretamente o campo Ano (formato: 2024).');
      return;
    }

    setIsLoading(true);
    try {
      let allCards = [];
      let totalFamilyBalance = 0;

      if (fetchAll) {
        for (const beneficiario of beneficiarios) {
          const { data } = await api.get('/titulos/tit_benef', {
            params: { beneficiario_id: parseInt(beneficiario.key), anoe },
          });

          if (data.rowCount > 0) {
            const cards = data.rows.map(titulo => {
              const selectedBeneficiary = beneficiarios.find(
                b => parseInt(b.key) === titulo.id_beneficiario
              );

              const valorTotal = parseFloat(titulo.vl_total_titulo || 0);
              const valorCopart = parseFloat(titulo.vl_coparticipacao  || 0); // ajustar se houver campo de coparticipação
              const contribuicao = valorTotal - valorCopart;

              const cpf = selectedBeneficiary ? selectedBeneficiary.cd_cpf : 'Desconhecido';
              const nome = selectedBeneficiary ? selectedBeneficiary.value : 'Desconhecido';

              return {
                vl_total_titulo: `R$${valorTotal.toFixed(2)}`,
                vl_coparticipacao: `R$${valorCopart.toFixed(2)}`,
                vl_contribuicao: `R$${contribuicao.toFixed(2)}`,
                balance: `R$${valorTotal.toFixed(2)}`,
                id_beneficiario: titulo.id_beneficiario,
                nm_beneficiario: nome,
                cd_cpf: cpf,
                ano_exercicio: anoe,
                ano_calendario: anoc,
              };
            });

            allCards = [...allCards, ...cards];

            totalFamilyBalance += cards.reduce((acc, card) => {
              return acc + parseFloat(card.balance.replace('R$', '').replace(',', '.'));
            }, 0);
          }
        }

        setFamilyTotalBalance(totalFamilyBalance.toFixed(2));
        setSelectedCards(allCards);
      }
    } catch (err) {
      console.error('Erro ao buscar títulos:', err);
      Alert.alert('Erro', `Erro ao carregar os títulos: ${err.message}`);
      setSelectedCards([]);
      setFamilyTotalBalance('0.00');
    } finally {
      setIsLoading(false);
      setShowCards(true);
    }
  }, [anoe, beneficiarios]);

  const pesquisar = () => {
    fetchTitulos(true);
  };

  const sacado = () => {
    const selectedBeneficiary = beneficiarios.find(b => b.ic_beneficiario === 'T');
    if (!selectedBeneficiary || parseFloat(familyTotalBalance.replace('R$', '').replace(',', '.')) <= 0) {
      return {
        nm_sacado: 'Desconhecido',
        nm_sacado_cpf: 'Desconhecido',
        nm_sacado_logradouro: 'Desconhecido',
        nm_sacado_numero: 'Desconhecido',
        nm_sacado_complemento: 'Desconhecido',
        nm_sacado_cidade: 'Desconhecido',
        nm_sacado_estado: 'Desconhecido',
        nm_sacado_cep: 'Desconhecido',
      };
    }

    return {
      nm_sacado: selectedBeneficiary.value,
      nm_sacado_cpf: formatCPF(selectedBeneficiary.cd_cpf),
      nm_sacado_logradouro: selectedBeneficiary.nm_logradouro,
      nm_sacado_numero: selectedBeneficiary.cd_numero,
      nm_sacado_complemento: selectedBeneficiary.nm_complemento,
      nm_sacado_cidade: selectedBeneficiary.nm_cidade,
      nm_sacado_estado: selectedBeneficiary.sg_estado,
      nm_sacado_cep: formatCEP(selectedBeneficiary.cd_cep),
    };
  };

  const handleSubmit = () => {
    if (!anoe || !/^\d{4}$/.test(anoe)) {
      Alert.alert('Erro', 'Preencha o campo Ano.');
      return;
    }

    if (!familyTotalBalance || parseFloat(familyTotalBalance.replace('R$', '').replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'O saldo total da família deve ser maior que zero.');
      return;
    }

    if (!selectedCards.length) {
      Alert.alert('Erro', 'Nenhum título encontrado para gerar boleto.');
      return;
    }

    navigation.navigate('Irpf', {
      familyTotalBalance,
      anoe,
      id,
      sacado: sacado(),
      Titulos: selectedCards,
    });
  };

  const getInputStyle = (hasError) => ({
    ...styles.inputContainer,
    ...(hasError ? styles.dropdownError : {}),
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <View style={styles.filterRow}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '48%' }}>
                <InputTexto
                  placeholderTextColor={theme.placeholderColor}
                  style={getInputStyle(error && !anoe)}
                  text="Ano Exercício"
                  value={anoe}
                  funcao={setAnoe}
                  max={4}
                  teclado="numeric"
                  icon={!anoe && error ? 'calendar-alert' : 'calendar'}
                  redicon={!anoe && error}
                />
              
            </View>

            <View style={{ width: '48%', marginLeft: '4%' }}>
                <InputTexto
                  placeholderTextColor={theme.placeholderColor}
                  style={getInputStyle(error && !anoc)}
                  text="Ano Calendario"
                  value={anoc}
                  funcao={setAnoc}
                  max={4}
                  teclado="numeric"
                  icon={!anoc && error ? 'calendar-alert' : 'calendar'}
                  redicon={!anoc && error}
                />
              </View>
            </View>


            {error && !anoc && (
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.errorMessage}>Preencha o campo Ano</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={pesquisar}
            disabled={isLoading}
          >
            <Text style={styles.searchButtonText}>
              {isLoading ? 'Procurando título...' : 'Pesquisar'}
            </Text>
            <Ionicons name="search" size={24} color={theme.buttonTextColor} />
          </TouchableOpacity>

          {familyTotalBalance && (
            <>
              <Text style={styles.balanceLabel}>Total da Fatura</Text>
              <Text style={styles.balanceAmount}>R${familyTotalBalance}</Text>
            </>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSubmit} style={styles.actionButton}>
              <Ionicons name="card-outline" size={24} color={theme.inputTextColor} />
              <Text style={styles.actionText}>Gerar Boleto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down-circle-outline" size={24} color={theme.inputTextColor} />
              <Text style={styles.actionText}>Pagar Via Pix</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Rodape />
    </View>
  );
}
