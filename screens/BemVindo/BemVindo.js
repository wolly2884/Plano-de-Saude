import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Alert, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './styles';

export default function BemVindo() {
  const [countdown, setCountdown] = useState(10);
  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [authenticated, setAuthenticated] = useState(false);
  const [hasTriggeredBiometric, setHasTriggeredBiometric] = useState(false); // Novo estado
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const authenticateUser = async (savedToken) => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) throw new Error('Seu dispositivo não suporta biometria.');

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) throw new Error('Nenhuma biometria cadastrada.');

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          Platform.OS === 'ios'
            ? 'Autentique-se com Face ID ou Touch ID'
            : 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar',
        requireConfirmation: true,
        biometricOnly: true,
      });

      if (result.success) {
        await AsyncStorage.setItem('biometricConfigured', 'true');
        setAuthenticated(true);
        navigation.navigate('pagina'); // Navega para a página principal
      } else if (result.error === 'user_cancel') {
        await AsyncStorage.removeItem('biometricConfigured');
        navigation.navigate('Home');
      } else {
        throw new Error('Autenticação biométrica falhou.');
      }
    } catch (error) {
      Alert.alert('Erro de Autenticação', error.message);
      await AsyncStorage.removeItem('biometricConfigured');
      navigation.navigate('Home');
    }
  };

  const checkTokenAndAuthenticate = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem('ID');
      const biometricFlag = await AsyncStorage.getItem('biometricConfigured');

      if (savedToken !== null && biometricFlag === 'true') {
        // Não dispara autenticação imediatamente, espera o countdown chegar a 5s
        return { savedToken, biometricFlag: true };
      } else {
        navigation.navigate('Home');
        return { savedToken: null, biometricFlag: false };
      }
    } catch (e) {
      Alert.alert('Erro', 'Falha ao verificar autenticação. Redirecionando...');
      navigation.navigate('Home');
      return { savedToken: null, biometricFlag: false };
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!authenticated && !hasTriggeredBiometric) {
        checkTokenAndAuthenticate();
      }
    }, [checkTokenAndAuthenticate, authenticated, hasTriggeredBiometric])
  );

  useEffect(() => {
    if (authenticated || hasTriggeredBiometric) {
      // Para a animação e countdown se autenticado ou biometria já disparada
      return;
    }

    const progressAnimation = Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
    });
    progressAnimation.start();

    let tokenData = null;
    checkTokenAndAuthenticate().then((data) => {
      tokenData = data;
    });

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 5 && tokenData?.savedToken && tokenData?.biometricFlag && !hasTriggeredBiometric) {
          setHasTriggeredBiometric(true);
          authenticateUser(tokenData.savedToken); // Dispara autenticação aos 5 segundos
        }
        if (prev === 1) {
          clearInterval(interval);
          if (!authenticated && !hasTriggeredBiometric) {
            fadeOutAndNavigate();
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      progressAnimation.stop();
    };
  }, [authenticated, hasTriggeredBiometric, checkTokenAndAuthenticate]);

  const fadeOutAndNavigate = () => {
    if (authenticated) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Home');
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>Bem-vindo ao Plano Facil!</Text>

      <LottieView
        source={{
          uri:
            'https://lottie.host/58adf468-8d4b-48fc-99c0-61c1da62b117/QVrTc3FY63.lottie',
        }}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.countdown}>
        Estamos preparando o aplicativo para você em {countdown}s...
      </Text>
      <AnimatedProgress progress={progress} />
    </Animated.View>
  );
}

function AnimatedProgress({ progress }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setAnimatedProgress(value));
    return () => progress.removeListener(id);
  }, [progress]);

  return (
    <Progress.Bar progress={animatedProgress} width={200} color="#1E90FF" animated />
  );
}