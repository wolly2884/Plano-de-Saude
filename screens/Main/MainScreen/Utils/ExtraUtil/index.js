import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Dimensions,
  Animated, FlatList, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Rodape from '../../../../../components/Rodape';
import InputTexto from '../../../../../components/InputTexto';
import SelectBeneficiario  from '../../../../../components/SelectBeneficiario';

import api from '../../../../../api/api';
import { getStyles } from './styles';

import { useTheme } from '../../../../../context/ThemeContext';

const cardWidth = Dimensions.get('window').width * 0.85;
const cardSpacing = 40;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function FinanceDashboard({ navigation }) {
  const flatListRef = useRef(null);

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCpf, setSelectedCpf] = useState('');
  const [ano, setAno] = useState('');
  const [mes, setMes] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const beneficiaryName = beneficiarios.find(b => b.key === selectedItem)?.value || '';
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useFocusEffect(useCallback(() => {
    const loadBeneficiarios = async () => {
      try {
        const storedID = await AsyncStorage.getItem('ID');
        const response = await api.get(`/Beneficiario/get/${storedID}`);
        const rows = response.data?.rows || [];

        if (rows.length) {
          const items = rows.map(b => ({
            key: b.id,
            value: b.nm_beneficiario,
            cd_cpf: b.cd_cpf,
          }));
          setBeneficiarios(items);
        } else {
          Alert.alert('Aviso', 'Nenhum beneficiário encontrado.');
        }
      } catch (err) {
        console.error('Erro ao carregar beneficiários:', err);
        Alert.alert('Erro', 'Erro ao carregar os beneficiários.');
      }
    };

    loadBeneficiarios();
  }, []));

  useEffect(() => {
    setIndex(0);
    setShowCards(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [beneficiarios, ano, mes]);

  const fetchTitulos = async (beneficiarioId) => {
    if (!ano || !mes || !beneficiarioId) {
      setError(true);
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!/^\d{4}$/.test(ano) || !/^(0[1-9]|1[0-2])$/.test(mes)) {
      setError(true);
      Alert.alert('Erro', 'Ano ou mês inválido.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.get('/titulos/tit_benef', {
        params: { beneficiario_id: parseInt(beneficiarioId), ano, mes },
      });

      if (data.rowCount > 0) {
        const cards = data.rows.map(titulo => ({
          balance: `R$${parseFloat(titulo.vl_total_titulo).toFixed(2)}`,
          lastFour: titulo.ultimos_quatro_digitos || '****',
          expiry: titulo.dt_geracao_titulo || 'N/A',
          valtype: titulo.tp_lancto || 'Desconhecido',
        }));
        setSelectedCards(cards);
      } else {
        Alert.alert('Aviso', 'Nenhum título encontrado.');
        setSelectedCards([]);
      }
    } catch (err) {
      console.error('Erro ao buscar títulos:', err);
      Alert.alert('Erro', 'Erro ao carregar os títulos.');
      setSelectedCards([]);
    } finally {
      setIsLoading(false);
      setShowCards(true);
    }
  };

  const handleSelectBeneficiario = (item) => {
    setSelectedItem(item.key);
    setSelectedCpf(item.cd_cpf);
    if (ano && mes) fetchTitulos(item.key);
  };

  const pesquisar = () => {
    if (!selectedItem) {
      setError(true);
      Alert.alert('Erro', 'Selecione um beneficiário.');
      return;
    }
    fetchTitulos(selectedItem);
  };

  const totalBalance = selectedCards.reduce((acc, card) => {
    return acc + parseFloat(card.balance.replace('R$', '').replace(',', '.'));
  }, 0).toFixed(2);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.valtype}</Text>
      <Text style={styles.cardAmount}>{item.balance}</Text>
      <Text style={styles.cardInfo}>**** **** **** {item.lastFour} | {item.expiry}</Text>
    </View>
  );

  const scrollToCard = (i) => {
    const idx = Math.min(i, selectedCards.length - 1);
    flatListRef.current?.scrollToOffset({
      offset: idx * (cardWidth + cardSpacing),
      animated: true,
    });
    setIndex(idx);
  };

  const getInputStyle = (isValid) => ({
    ...styles.inputContainer,
    ...(isValid ? styles.dropdownError : {}),
  });

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.filterRow}>
          <SelectBeneficiario
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            onSelect={() => {
              const item = beneficiarios.find(b => b.key === selectedItem);
              if (item) handleSelectBeneficiario(item);
            }}
            isEmpty={!selectedCpf && error}
          />

          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{  width: '48%' }}>

            <InputTexto 
              placeholderTextColor={theme.placeholderColor}
              style={getInputStyle(error && !ano)}
              text="Ano" 
              value={ano} 
              funcao={setAno} 
              max={4} 
              teclado="numeric" 
              icon={!ano && error ? 'calendar-alert' : 'calendar'} redicon={!ano && error} />
          </View>
          <View style={{ width: '48%', left: '4%' }}>
            <InputTexto text="Mês" value={mes} funcao={setMes} max={2} teclado="numeric" icon={!mes && error ? 'calendar-alert' : 'calendar'} redicon={!mes && error} />
          </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {!ano && error && <Text style={styles.errorMessage}>Preencha o campo Ano</Text>}
            {!mes && error && <Text style={[styles.errorMessage, { left: !ano ? 60 : 190 }]}>Preencha o campo Mês</Text>}
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={pesquisar} disabled={isLoading}>
          <Text style={styles.searchButtonText}>Pesquisar</Text>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>

        {isLoading && <Text>Carregando...</Text>}

        {beneficiaryName && showCards && (
          <>
            <Text style={styles.balanceLabel}>{beneficiaryName}</Text>
            <Text style={styles.balanceAmount}>R${totalBalance}</Text>
          </>
        )}

        {showCards && selectedCards.length > 0 ? (
          <AnimatedFlatList
            ref={flatListRef}
            data={selectedCards}
            renderItem={renderCard}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + cardSpacing}
            snapToAlignment="center"
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingHorizontal: (Dimensions.get('window').width - cardWidth - 25) / 2,
            }}
            ItemSeparatorComponent={() => <View style={{ width: cardSpacing }} />}
          />
        ) : showCards ? (
          <Text style={styles.noCards}>Nenhum cartão disponível</Text>
        ) : null}

        {showCards && selectedCards.length > 0 && (
          <View style={styles.indicatorContainer}>
            {selectedCards.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => scrollToCard(i)}>
                <View style={[styles.indicator, index === i && styles.activeIndicator]} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card-outline" size={24} color="#333" />
            <Text style={styles.actionText}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-down-circle-outline" size={24} color="#333" />
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-up-circle-outline" size={24} color="#333" />
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={{ width: '115%', position: 'absolute', bottom: 0 }}>
        <Rodape />
      </View>
    </View>
  );
}
