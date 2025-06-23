import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Dimensions,
  Animated, FlatList, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Rodape from '../../../../../components/Rodape';
import InputTexto from '../../../../../components/InputTexto1';
import api from '../../../../../api/api';
import { getStyles } from './styles';
import { useTheme } from '../../../../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate, formatCEP, formatCPF } from '../../../../../components/validations';

const cardWidth = Dimensions.get('window').width * 0.85;
const cardSpacing = 40;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function FinanceDashboard({ navigation }) {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [ano, setAno] = useState('');
  const [mes, setMes] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [familyTotalBalance, setFamilyTotalBalance] = useState('0.00');
  const [id, setId] = useState('');

  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Fetch beneficiaries on mount
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
          value: b.nm_beneficiario  || 'Desconhecido',
        })))
        
        setId(storedID) ;
      } catch (err) {
        console.error('Erro ao buscar beneficiários:', err);
        Alert.alert('Erro', 'Não foi possível carregar os beneficiários.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBeneficiarios();
  }, []);

  // Reset index and cards when filters change
  useEffect(() => {
    setIndex(0);
    setShowCards(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [beneficiarios, ano, mes]);

  // Update index based on scroll position
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const newIndex = Math.round(value / (cardWidth + cardSpacing));
      if (newIndex !== index && newIndex >= 0 && newIndex < selectedCards.length) {
        setIndex(newIndex);
      }
    });
    return () => scrollX.removeListener(listener);
  }, [index, selectedCards.length]);

  // Fetch titles for a single beneficiary or all beneficiaries
  const fetchTitulos = useCallback(async (beneficiarioId, fetchAll = false) => {
    
    if (!ano || !mes) {
      setError(true);
      Alert.alert('Erro', 'Preencha os campos Ano e Mês.');
      return;
    }

    if (!/^\d{4}$/.test(ano) || !/^(0[1-9]|1[0-2])$/.test(mes)) {
      setError(true);
      Alert.alert('Erro', 'Ano ou mês inválido.');
      return;
    }

    setIsLoading(true);
    try {
      let allCards = [];
      let totalFamilyBalance = 0;
      if (fetchAll) {
        for (const beneficiario of beneficiarios) {
          const { data } = await api.get('/titulos/tit_benef', {
            params: { beneficiario_id: parseInt(beneficiario.key), ano, mes },
          });
          if (data.rowCount > 0) {
            const cards = data.rows.map(titulo => ({
              balance: `R$${parseFloat(titulo.vl_total_titulo).toFixed(2)}`,
              lastFour: formatDate(titulo.dt_vencimento) || '****',
              expiry: formatDate(titulo.dt_geracao_titulo) || 'N/A',
              valtype: titulo.tp_lancto || 'Desconhecido',
            }));
            allCards = [...allCards, ...cards];
            totalFamilyBalance += cards.reduce((acc, card) => {
              return acc + parseFloat(card.balance.replace('R$', '').replace(',', '.'));
            }, 0);
          }
        }
        setFamilyTotalBalance(totalFamilyBalance.toFixed(2));
        if (!beneficiarioId) {
          setSelectedCards(allCards);
        }
      } else {
        const { data } = await api.get('/titulos/tit_benef', {
          params: { beneficiario_id: parseInt(beneficiarioId), ano, mes },
        });
        if (data.rowCount > 0) {
          const cards = data.rows.map(titulo => ({
            balance: `R$${parseFloat(titulo.vl_total_titulo).toFixed(2)}`,
            lastFour: formatDate(titulo.dt_vencimento) ,
            expiry: formatDate(titulo.dt_geracao_titulo) || 'N/A',
            valtype: titulo.tp_lancto || 'Desconhecido',
          }));
          setSelectedCards(cards);
        } else {
          Alert.alert('Aviso', 'Nenhum título encontrado.');
          setSelectedCards([]);
        }
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
  }, [ano, mes, beneficiarios]);

  const pesquisar = () => {
    fetchTitulos(id);
    fetchTitulos(beneficiarios, true); // Fetch family total
  };

  // Calculate total balance for selected beneficiary
  const totalBalance = selectedCards.reduce((acc, card) => {
    return acc + parseFloat(card.balance.replace('R$', '').replace(',', '.'));
  }, 0).toFixed(2);

  // Scroll to specific card
  const scrollToCard = useCallback((i) => {
    const newIndex = Math.min(Math.max(i, 0), selectedCards.length - 1);
    flatListRef.current?.scrollToOffset({
      offset: newIndex * (cardWidth + cardSpacing),
      animated: true,
    });
    setIndex(newIndex);
  }, [selectedCards.length]);

  // Handle card change via indicator click
  const handleCardChange = (i) => {
    scrollToCard(i);
  };

  // Render card
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.valtype}</Text>
      <Text style={styles.cardAmount}>{item.balance}</Text>
      <Text style={styles.cardInfo}>Vencimento : {item.lastFour}</Text>
      <Text style={styles.cardInfo}>Geração : {item.expiry}</Text>
    </View>
  );

  const getInputStyle = (isValid) => ({
    ...styles.inputContainer,
    ...(isValid ? styles.dropdownError : {}),
  });

  // Generate sacado object based on selected beneficiary
  const sacado = () => {
    if (!familyTotalBalance || parseFloat(familyTotalBalance) <= 0) {
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

    const selectedBeneficiary = beneficiarios.find(b => b.ic_beneficiario === 'T');
    if (!selectedBeneficiary) {
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
      nm_sacado: selectedBeneficiary.value || 'Desconhecido',
      nm_sacado_cpf: formatCPF(selectedBeneficiary.cd_cpf) || 'Desconhecido',
      nm_sacado_logradouro: selectedBeneficiary.nm_logradouro || 'Desconhecido',
      nm_sacado_numero: selectedBeneficiary.cd_numero || 'Desconhecido',
      nm_sacado_complemento: selectedBeneficiary.nm_complemento || 'Desconhecido',
      nm_sacado_cidade: selectedBeneficiary.nm_cidade || 'Desconhecido',
      nm_sacado_estado: selectedBeneficiary.sg_estado || 'Desconhecido',
      nm_sacado_cep: formatCEP(selectedBeneficiary.cd_cep) || 'Desconhecido',
    };
  };

  const handleSubmit = () => {

    if (!ano || !mes) {
      Alert.alert('Erro', 'Preencha os campos Ano e Mês.');
      return;
    }
    if (!familyTotalBalance || parseFloat(familyTotalBalance) <= 0) {
      Alert.alert('Erro', 'O saldo total da família deve ser maior que zero.');
      return;
    }

    const sacadoData = sacado();
    navigation.navigate('Boleto', {
      familyTotalBalance: familyTotalBalance,
      ano: ano,
      mes: mes,
      id: id,
      sacado: sacadoData,
    });
  };

  return (
  <View style={{flex: 1}}>
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.filterRow}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '48%' }}>
              <InputTexto
                placeholderTextColor={theme.placeholderColor}
                style={getInputStyle(error && !ano)}
                text="Ano"
                value={ano}
                funcao={setAno}
                max={4}
                teclado="numeric"
                icon={!ano && error ? 'calendar-alert' : 'calendar'}
                redicon={!ano && error}
              />
            </View>

            <View style={{ width: '48%', left: '4%' }}>
              <InputTexto
                style={getInputStyle(error && !mes)}
                text="Mês"
                value={mes}
                funcao={setMes}
                max={2}
                teclado="numeric"
                icon={!mes && error ? 'calendar-alert' : 'calendar'}
                redicon={!mes && error}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {!ano && error && <Text style={styles.errorMessage}>Preencha o campo Ano</Text>}
            {!mes && error && <Text style={[styles.errorMessage, { left: !ano ? 60 : 190 }]}>Preencha o campo Mês</Text>}
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={pesquisar} disabled={isLoading}>
          <Text style={styles.searchButtonText}>{isLoading ? 'Procurando titulo' : 'Pesquisar'}</Text>
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