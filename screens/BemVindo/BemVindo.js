import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import LogoSVG from '../../components/LogoSVG';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BemVindo({ navigation }) {
  const [loading, setLoading] = useState(true);
  const image = require('../../assets/totvs.gif');

  useFocusEffect(
    React.useCallback(() => {
      const checkTokenAndAuthenticate = async () => {
        try {
          const savedToken = await AsyncStorage.getItem('ID');
          const biometricFlag = await AsyncStorage.getItem('biometricConfigured');
          console.log("Token salvo: ", savedToken);
          console.log("Biometria configurada: ", biometricFlag);

          if (savedToken !== null) {
            if (biometricFlag === 'true') { // Verifica se a biometria está ativa
              await authenticateUser(savedToken); // Autentica o usuário
            } else {
              navigation.navigate('Home'); // Se biometria não está ativa, vai para Home
            }
          } else {
            await fetchData(); // Se não há token salvo, busca dados
          }
        } catch (e) {
          console.error("Erro ao buscar token:", e);
          navigation.navigate('Home');
        }
      };

      const authenticateUser = async (savedToken) => {
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
            fallbackLabel: 'Use sua senha',
            cancelLabel: 'Cancelar',
            requireConfirmation: true,
            biometricsSecurityLevel: 'strong',
            disableDeviceFallback: true,
          });

          if (biometricAuth.success) {
            await AsyncStorage.setItem('biometricConfigured', 'true');
            navigation.navigate('pagina'); // Usuário autenticado, navega para a próxima página
          } else if (biometricAuth.error === 'user_cancel') {
            console.log('Autenticação biométrica cancelada pelo usuário.');
            await AsyncStorage.removeItem('biometricConfigured'); // Removendo a chave corretamente
            navigation.navigate('Home');
          } else {
            throw new Error('Autenticação biométrica falhou.');
          }
        } catch (error) {
          console.error("Erro na autenticação biométrica:", error);
          Alert.alert('Erro de Autenticação', error.message);
          await AsyncStorage.removeItem('biometricConfigured'); // Removendo a chave corretamente
          navigation.navigate('Home');
        } finally {
          setLoading(false);
        }
      };

      const fetchData = async () => {
        try {
          const response = await api.get('/Protected');
          await AsyncStorage.setItem('biometricConfigured', 'false'); // Define que a biometria não está configurada
          navigation.navigate('Home');
        } catch (error) {
          console.error("Erro ao buscar dados protegidos:", error);
          navigation.navigate('Home');
        } finally {
          setLoading(false);
        }
      };

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

  return null;
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
  },
});

export default BemVindo;
