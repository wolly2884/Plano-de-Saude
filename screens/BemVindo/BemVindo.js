import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import LogoSVG from '../../components/LogoSVG';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BemVindo({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const image = require('../../assets/totvs.gif');

  useFocusEffect(
    React.useCallback(() => {
      const checkTokenAndAuthenticate = async () => {
        try {
          // Verifica se há um token salvo no AsyncStorage
          const savedToken = await AsyncStorage.getItem('ID');
          
          if (savedToken) {
            // Se o token existir, autentica com biometria
            await authenticateUser();
          } else {
            // Se não existir token, segue para carregar os dados e navega diretamente
            await fetchData();
          }
        } catch (e) {
          console.error("Erro ao buscar token:", e);
          // Navega para a tela de senha em caso de erro ao buscar o token
          navigation.navigate('Home');
        }
      };

      const authenticateUser = async () => {
        try {
          const isCompatible = await LocalAuthentication.hasHardwareAsync();

          if (!isCompatible) {
            throw new Error('Seu dispositivo não suporta biometria.');
          }

          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          if (!isEnrolled) {
            throw new Error('Nenhuma biometria cadastrada.');
          }

          const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentique-se para continuar',
            fallbackLabel: 'Use sua senha'
          });

          if (biometricAuth.success) {
            // Autenticação bem-sucedida, navega para a página principal
            navigation.navigate('pagina');
          } else {
            throw new Error('Autenticação biométrica falhou.');
          }
        } catch (error) {
          console.error("Erro na autenticação biométrica:", error);
          Alert.alert('Erro de Autenticação', error.message);
          // Navega para a tela de senha em caso de erro na autenticação
          navigation.navigate('Home');
        } finally {
          setLoading(false);
        }
      };

      const fetchData = async () => {
        try {
          const response = await api.get('/Protected');
          //console.log(response.data); // Manipule os dados da resposta conforme necessário
          // Supondo que a navegação para 'Home' seja apropriada após a obtenção dos dados
          navigation.navigate('Home');
        } catch (error) {
          console.error("Erro ao buscar dados protegidos:", error);
          // Navega para a tela de senha em caso de erro na requisição
          navigation.navigate('Home');
        } finally {
          setLoading(false);
        }
      };

      // Inicia o processo de verificação e autenticação
      checkTokenAndAuthenticate();
    }, [navigation])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loader}>
          <LogoSVG />
          <Image source={image} style={styles.image} />
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }

  // A renderização do erro não é mais necessária, pois em caso de erro o usuário será redirecionado para a tela de senha
  return null; // Não renderiza nada caso a navegação ocorra
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  }
});

export default BemVindo;
