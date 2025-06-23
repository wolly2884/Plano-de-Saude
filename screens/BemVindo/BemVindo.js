import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './styles';
import api from '../../api/api';
import { EMPRESA_EMAIL } from '@env';

export default function BemVindo() {
  const [countdown, setCountdown] = useState(10);
  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [authenticated, setAuthenticated] = useState(false);
  const [hasTriedBiometric, setHasTriedBiometric] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const checkEmpresaAccess = async (email) => {
    try {
      const response = await api.get(`/Token/find/${email}`);

      // Extrai o primeiro item do array rows
      const empresa = response.data?.rows?.[0];

      if (!empresa) {
        // Se não encontrou dados da empresa, bloqueia acesso
        navigation.replace('AcessoNegado');
        return false;
      }

      // Salva os dados da empresa no AsyncStorage
      await AsyncStorage.setItem('EmpresaUser', JSON.stringify(empresa));

      // Verifica se dt_valid é uma data futura (válida)
      const dtValid = new Date(empresa.dt_valid);
      const agora = new Date();

      if (dtValid > agora) {
        return true; // Empresa válida
      } else {
        navigation.replace('AcessoNegado');
        return false; // Empresa com acesso expirado
      }
    } catch (error) {
      navigation.replace('AcessoNegado');
      return false;
    }
  };

  const authenticateUser = async () => {
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
        navigation.navigate('pagina');
      } else {
        await AsyncStorage.removeItem('biometricConfigured');
        navigation.navigate('Home');
      }
    } catch (error) {
      await AsyncStorage.removeItem('biometricConfigured');
      navigation.navigate('Home');
    }
  };

  const checkTokenAndAuthenticate = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem('ID');
      const biometricFlag = await AsyncStorage.getItem('biometricConfigured');
      const empresaTemAcesso = await checkEmpresaAccess(EMPRESA_EMAIL);

      if (!empresaTemAcesso) {
        return { savedToken: null, biometricFlag: false };
      }

      if (savedToken !== null && biometricFlag === 'true') {

        const empresaTemAcesso = await checkEmpresaAccess(EMPRESA_EMAIL);

        if (!empresaTemAcesso) {
          return { savedToken: null, biometricFlag: false };
        }
        return { savedToken, biometricFlag: true };
      } else {
        navigation.navigate('Home');
        return { savedToken: null, biometricFlag: false };
      }
    } catch (e) {
      navigation.navigate('Home');
      return { savedToken: null, biometricFlag: false };
    }
  }, [navigation]);

  // Use focus effect para chamar a verificação quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      if (!authenticated && !hasTriedBiometric) {
        (async () => {
          const data = await checkTokenAndAuthenticate();
          if (data.savedToken && data.biometricFlag) {
            setHasTriedBiometric(true);
            authenticateUser();
          }
        })();
      }
    }, [checkTokenAndAuthenticate, authenticated, hasTriedBiometric])
  );

  useEffect(() => {
    if (authenticated) return;

    const progressAnimation = Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false,
    });
    
    progressAnimation.start();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          if (!authenticated) {
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
  }, [authenticated]);

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
          uri: 'https://lottie.host/58adf468-8d4b-48fc-99c0-61c1da62b117/QVrTc3FY63.lottie',
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
