// src/screens/Senha/index.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './Styles';
import Rodape from '../../components/Rodape';
import api from '../../api/api';
import { cpf } from 'cpf-cnpj-validator';

const Senha = ({ navigation }) => {
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);
  const [login, setLogin] = useState('');
  const [userData, setUserData] = useState(null);
  const [isUserFound, setIsUserFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecover = async () => {
    setIsLoading(true);
    try {
      if (!validateLogin()) return;

      const normalizedLogin = login.trim(); // Trim whitespace
      const response = await api.get(`Beneficiario/find/${encodeURIComponent(normalizedLogin)}`);
      const rows = response.data?.rows;

      if (rows?.length > 0) {
        setUserData(rows[0]);
        setIsUserFound(true);
      } else {
        Alert.alert('Usuário não encontrado', 'Verifique o E-mail ou CPF e tente novamente.', [{ text: 'OK' }]);
        setIsUserFound(false);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados:', error);
      const message = error.response?.status === 404
        ? 'Usuário não encontrado.'
        : 'Não foi possível recuperar a senha. Tente novamente.';
      Alert.alert('Erro', message, [{ text: 'OK' }]);
      setIsUserFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showPassword = () => {
    if (userData) {
      Alert.alert(
        `Olá, ${userData.nm_beneficiario}!`,
        `Sua senha: ${userData.cd_password} (Em teste, exibida na tela. Futuramente, será enviada por e-mail.)`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
        { accessibilityLabel: 'Senha recuperada' }
      );
      setLogin('');
      setUserData(null);
      setIsUserFound(false);
    } else {
      Alert.alert('Usuário não encontrado', 'Verifique o E-mail ou CPF e tente novamente.', [{ text: 'OK' }]);
      setIsUserFound(false);
    }
  };

  const validateLogin = () => {
    const trimmedLogin = login.trim();
    if (!trimmedLogin) {
      Alert.alert('Erro', 'Por favor, insira um E-mail ou CPF.', [{ text: 'OK' }]);
      return false;
    }
    if (validCPF(trimmedLogin) || validEmail(trimmedLogin)) {
      return true;
    }
    Alert.alert('Erro', 'E-mail ou CPF inválido.', [{ text: 'OK' }]);
    return false;
  };

  const validCPF = (input) => {
    const formattedCPF = cpf.format(input.replace(/[^\d]/g, '')); // Remove non-digits
    return formattedCPF.length === 14 && cpf.isValid(formattedCPF);
  };

  const validEmail = (input) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input);
  };

  return (
    <View style={styles.content}>
      <View style={styles.content}>
        <KeyboardAvoidingView
          style={styles.Senhacontainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View style={styles.content}>
            <TextInput
              style={styles.Senhainput}
              placeholder="Insira seu E-mail ou CPF"
              placeholderTextColor={theme.placeholderColor}
              value={login}
              onChangeText={setLogin}
              keyboardType="default"
              autoCapitalize="none"
              accessibilityLabel="Campo para E-mail ou CPF"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.Senhabutton, isLoading && styles.buttonDisabled]}
              onPress={isUserFound ? showPassword : handleRecover}
              disabled={isLoading}
              accessibilityLabel={isUserFound ? 'Mostrar senha' : 'Recuperar senha'}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.buttonTextColor} />
              ) : (
                <Text style={styles.SenhabuttonText}>
                  {isUserFound ? 'Mostrar Senha' : 'Recuperar Senha'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} disabled={isLoading}>
              <Text style={styles.SenharegisterLink}>Ainda não tem uma conta? Registre-se aqui.</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      <Rodape />
    </View>
  );
};

export default Senha;