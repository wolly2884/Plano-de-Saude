import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rodape  from '../../../../../components/Rodape'
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './Styles';

// Função para gerar um token aleatório
const generateRandomToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

export default function TokenScreen({ navigation, route }) {
  const [token, setToken] = useState(generateRandomToken());
  const [timeLeft, setTimeLeft] = useState(60); // Temporizador de 60 segundos
  const [expirationDate] = useState(moment().add(1, 'days')); // Expira em 1 dia
  const isExpired = moment().isAfter(expirationDate);

  const [cardNumber, setCardNumber] = useState('');
  const [healthPlan, setHealthPlan] = useState('');
  const [username, setUsername] = useState('');

  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          let storedCardNumber = '';
          let storedUsername = '';
          let storedHealthPlan = '';

          const items = route.params?.items;

          if (items === undefined) {
            storedCardNumber = await AsyncStorage.getItem('cardNumber');
            storedUsername = await AsyncStorage.getItem('username');
            storedHealthPlan = await AsyncStorage.getItem('healthPlan');
          } else {
            storedCardNumber = items.cd_cardnumber;
            storedHealthPlan = items.ds_healthplan;
            storedUsername = items.nm_beneficiario;
          }

          setCardNumber(storedCardNumber?.trim() || '');
          setUsername(storedUsername?.trim() || '');
          setHealthPlan(storedHealthPlan?.trim() || '');
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };

      checkLoginStatus();
    }, [route.params])
  );

  // Temporizador para atualizar o token a cada 30 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (isExpired) {
            Alert.alert('Token Expirado', 'O token não é mais válido.');
            clearInterval(timer);
            return 0;
          }
          setToken(generateRandomToken()); // Gera novo token
          return 30; // Reseta o temporizador
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar
  }, [isExpired]);

  return (
    <View style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.header}>Token Gerado com Sucesso!</Text>
      <Text style={styles.subHeader}>Apresente este token no atendimento:</Text>

      {/* Exibe o token */}
      <Text style={styles.token}>{token}</Text>

      {/* Exibe o QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value={token}
          size={150}
          backgroundColor="#D3FFD3"
          color="black"
        />
      </View>

      {/* Exibe o temporizador e a data de expiração */}
      <Text style={styles.expiry}>
        Expira em: {expirationDate.format('DD/MM [às] HH:mm')}
      </Text>
      <Text style={styles.timer}>Atualiza em: {timeLeft} segundos</Text>

      {/* Exibe os dados do usuário */}
      <View style={styles.usertexto}>
        <Text style={styles.userInfo}>Beneficiario:</Text>
        <Text style={styles.beninfo}> {username}</Text>
      </View>

      <View style={styles.usertexto}>
        <Text style={styles.userInfo}>Plano de Saúde:</Text>
        <Text style={styles.beninfo}> {healthPlan}</Text>
      </View>

      <View style={styles.usertexto}>
        <Text style={styles.userInfo}>Número do Cartão:</Text>
        <Text style={styles.beninfo}> {cardNumber}</Text>
      </View>
      </View>
      
       <Rodape />
    </View>
  );
}