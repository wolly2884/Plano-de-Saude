// src/screens/BemVindo/index.js
import React, { useState } from 'react';
import { View, ActivityIndicator, Text, Image, Alert, Platform, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/api';
import LogoSVG from '../../components/LogoSVG';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStyles} from './styles'

function BemVindo({ navigation }) {
  const { theme, isThemeLoaded } = useTheme();
  const [loading, setLoading] = useState(true);
  const styles = getStyles(theme);
  const image = require('../../assets/totvs.gif');

  useFocusEffect(
    React.useCallback(() => {
      const checkTokenAndAuthenticate = async () => {
        try {
          const savedToken = await AsyncStorage.getItem('ID');
          const biometricFlag = await AsyncStorage.getItem('biometricConfigured');

          if (savedToken !== null) {
            if (biometricFlag === 'true') {
              console.log('Attempting biometric authentication');
              await authenticateUser(savedToken);
            } else {
              console.log('Biometric not configured, navigating to Home');
              navigation.navigate('Home');
            }
          } else {
            console.log('No token found, fetching data');
            await fetchData();
          }
        } catch (e) {
          console.error('Erro ao buscar token:', e);
          Alert.alert('Erro', 'Falha ao verificar autenticação. Redirecionando...');
          navigation.navigate('Home');
        } finally {
          setLoading(false);
        }
      };

      const authenticateUser = async (savedToken) => {
        try {
          const isCompatible = await LocalAuthentication.hasHardwareAsync();
          console.log('Biometric hardware available:', isCompatible);
          if (!isCompatible) {
            throw new Error('Seu dispositivo não suporta biometria.');
          }

          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          console.log('Biometrics enrolled:', isEnrolled);
          if (!isEnrolled) {
            throw new Error('Nenhuma biometria cadastrada.');
          }

          const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: Platform.OS === 'ios' ? 'Autentique-se com Face ID ou Touch ID' : 'Autentique-se para continuar',
            fallbackLabel: 'Usar senha',
            cancelLabel: 'Cancelar',
            requireConfirmation: true,
            biometricsSecurityLevel: 'strong',
            disableDeviceFallback: Platform.OS === 'ios' ? false : true,
          });
          console.log('Biometric auth result:', biometricAuth);

          if (biometricAuth.success) {
            console.log('Biometric authentication successful');
            await AsyncStorage.setItem('biometricConfigured', 'true');
            navigation.navigate('pagina');
          } else if (biometricAuth.error === 'user_cancel') {
            console.log('Autenticação biométrica cancelada pelo usuário.');
            await AsyncStorage.removeItem('biometricConfigured');
            navigation.navigate('Home');
          } else {
            throw new Error('Autenticação biométrica falhou.');
          }
        } catch (error) {
          console.error('Erro na autenticação biométrica:', error);
          Alert.alert('Erro de Autenticação', error.message);
          await AsyncStorage.removeItem('biometricConfigured');
          navigation.navigate('Home');
        }
      };

      const fetchData = async () => {
        try {
          const response = await api.get('/Protected');
          await AsyncStorage.setItem('biometricConfigured', 'false');
          navigation.navigate('Home');
        } catch (error) {
          console.error('Erro ao buscar dados protegidos:', error);
          navigation.navigate('Home');
        } finally {
          setLoading(false);
        }
      };

      checkTokenAndAuthenticate();
    }, [navigation, isThemeLoaded])
  );

  if (loading || !isThemeLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.loader}>
          <LogoSVG width={200} height={40} />
          <Image source={image} style={styles.image} />
          <ActivityIndicator
            size="large"
            color={theme.linkColor}
            accessibilityLabel="Carregando autenticação"
          />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return null;
}

export default BemVindo;