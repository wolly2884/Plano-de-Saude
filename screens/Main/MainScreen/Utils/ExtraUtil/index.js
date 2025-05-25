import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, FlatList, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list';
import Rodape from '../../../../../components/Rodape';
import InputTexto from '../../../../../components/InputTexto';
import { styles } from './styles';
import api from '../../../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const cardWidth = Dimensions.get('window').width * 0.85;
const cardSpacing = 40;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function FinanceDashboard({ navigation }) {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [ano, setAno] = useState('');
  const [mes, setMes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [error, setError] = useState(false);
  const [ID, setID] = useState('');
  const [beneficiario, setBeneficiarios] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCpf, setSelectedCpf] = useState('');
  const [selectedCards, setSelectedCards] = useState([]); // Estado para armazenar os cartões retornados pela API

  const beneficiaryName = beneficiario.find(b => b.cd_cpf === selectedCpf)?.value || '';

  useFocusEffect(
    useCallback(() => {
      const loadBeneficiarios = async () => {
        try {
          const storedID = await AsyncStorage.getItem('ID');
          const userData = await api.get(`/Beneficiario/get/${storedID}`);

          if (userData.data.rowCount > 0) {
            const loadedBeneficiarios = userData.data.rows.map((beneficiario) => ({
              key: beneficiario.id,
              value: beneficiario.nm_beneficiario,
              cd_cpf: beneficiario.cd_cpf,
            }));
            setBeneficiarios(loadedBeneficiarios);
          } else {
            Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
          Alert.alert('Erro', 'Não foi possível carregar os beneficiários.');
        }
      };
      loadBeneficiarios();
    }, [])
  );

  useEffect(() => {
    setIndex(0);
    setShowCards(false);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [beneficiario, ano, mes]);

  const fetchTitulos = async (beneficiarioId) => {
    if (!ano || !mes || !beneficiarioId) {
      setError(true);
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!/^\d{4}$/.test(ano) || !/^(0[1-9]|1[0-2])$/.test(mes)) {
      Alert.alert('Erro', 'Ano ou mês inválido.');
      setError(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get('/titulos/tit_benef', {
        params: {
          beneficiario_id: parseInt(beneficiarioId),
          ano,
          mes,
        },
      });

      console.log('Resposta da API /titulos:', response.data);

      if (response.data && response.data.rowCount > 0) {
        const titulos = response.data.rows.map((titulo) => ({
          balance: `R$${parseFloat(titulo.vl_total_titulo).toFixed(2)}`,
          lastFour: titulo.ultimos_quatro_digitos || '****',
          expiry: titulo.dt_geracao_titulo || 'N/A',
          valtype: titulo.tp_lancto || 'Desconhecido',
        }));
        setSelectedCards(titulos);
        setShowCards(true);
      } else {
        setSelectedCards([]);
        setShowCards(true);
        Alert.alert('Aviso', 'Nenhum título encontrado para os filtros selecionados.');
      }
    } catch (error) {
      console.error('Erro ao buscar títulos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os títulos.');
      setSelectedCards([]);
      setShowCards(true);
    } finally {
      setIsLoading(false);
    }
  };

  const pesquisar = () => {
    if (!selectedItem) {
      setError(true);
      Alert.alert('Erro', 'Selecione um beneficiário.');
      return;
    }
    fetchTitulos(selectedItem);
  };

  const totalBalance = selectedCards.reduce((sum, card) => {
    const balance = parseFloat(card.balance.replace('R$', '').replace(',', '.'));
    return sum + balance;
  }, 0).toFixed(2);

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.min(
      Math.round(scrollOffset / (cardWidth + cardSpacing)),
      selectedCards.length - 1
    );
    setIndex(newIndex);
  };

  const scrollToCard = (i) => {
    const validIndex = Math.min(i, selectedCards.length - 1);
    setIndex(validIndex);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: validIndex * (cardWidth + cardSpacing),
        animated: true,
      });
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.valtype}</Text>
      <Text style={styles.cardAmount}>{item.balance}</Text>
      <Text style={styles.cardInfo}>**** **** **** {item.lastFour} | {item.expiry}</Text>
    </View>
  );

  const selecionado = (item) => {
    setID(item.key);
    setSelectedCpf(item.cd_cpf);
    setSelectedItem(item.key);
    if (ano && mes) {
      fetchTitulos(item.key); // Chama a API automaticamente ao trocar beneficiário, se ano e mês estiverem preenchidos
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.filterRow}>
          <View style={{ flex: 1, width: '100%', marginBottom: 20 }}>
            <SelectList
              placeholder="Selecione o Beneficiario"
              setSelected={setSelectedItem}
              data={beneficiario}
              search={true}
              inputStyles={{ fontSize: 20, textAlign: 'center', color: !selectedCpf && error ? 'red' : 'black' }}
              onSelect={() => selecionado(beneficiario.find(item => item.key === selectedItem))} />

            {!selectedCpf && error && <Text style={styles.errorMessage}>Selecione o Beneficiario</Text>}
          </View>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <InputTexto text="Ano" value={ano} funcao={setAno} max={4} teclado="numeric" editar={true} icon={!ano && error ? 'calendar-alert' : 'calendar'} redicon={!ano && error} />
            <InputTexto text="Mês" value={mes} funcao={setMes} istrue={false} max={2} teclado="numeric" icon={!mes && error ? 'calendar-alert' : 'calendar'} redicon={!mes && error} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            {!ano && error && <Text style={styles.errorMessage}>Preencha o campo Ano</Text>}
            {!mes && error && <Text style={[styles.errorMessage, { left: !ano ? 60 : 190 }]}>Preencha o campo Mês</Text>}
          </View>
        </View>

        <View style={styles.beneficiaryRow}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={pesquisar}
              disabled={isLoading}
              style={styles.searchButton}
              accessible
              accessibilityLabel="Pesquisar"
            >
              <Text style={styles.searchButtonText}>Pesquisar</Text>
              <Ionicons name="search" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && <Text>Carregando...</Text>}

        {beneficiaryName && showCards && (
          <>
            <Text style={styles.balanceLabel}>{beneficiaryName}</Text>
            <Text style={styles.balanceAmount}>R${totalBalance}</Text>
          </>
        )}

        {showCards && selectedCards.length > 0 ? (
          <View style={styles.cardContainer}>
            <AnimatedFlatList
              ref={flatListRef}
              data={selectedCards}
              renderItem={renderCard}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + cardSpacing}
              snapToAlignment="center"
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: handleScroll } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingHorizontal: (Dimensions.get('window').width - cardWidth - 25) / 2,
              }}
              ItemSeparatorComponent={() => <View style={{ width: cardSpacing }} />}
            />
          </View>
        ) : showCards ? (
          <Text style={styles.noCards}>Nenhum cartão disponível</Text>
        ) : null}

        {showCards && selectedCards.length > 0 && (
          <View style={styles.indicatorContainer}>
            {selectedCards.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => scrollToCard(i)}
                accessible
                accessibilityLabel={`Selecionar cartão ${i + 1}`} >

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
      <View style={{ width: '115%', position: 'absolute', bottom: 0, borderRadius: 30 }}>
        <Rodape />
      </View>
    </View>
  );
}