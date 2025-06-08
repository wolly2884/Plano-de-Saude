// src/screens/App.js (or wherever App is located)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator,SafeAreaView } from 'react-native';
import Rodape from '../../components/Rodape';
import api from '../../api/api';
import { cpf } from 'cpf-cnpj-validator';
import InputTexto from '../../components/InputTexto';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './Styles';

const App = ({ navigation }) => {
  const [username, setUsername] = useState(null);
  const [login, setLogin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleRecover = async () => {
    try {
      if (!validateLogin()) return;

      setIsLoading(true);
      setError(false);

      const formattedLogin = cpf.isValid(login) ? cpf.strip(login) : login;
      const payload = { identifier: formattedLogin };
      const userData = await api.post('/Beneficiario/forgot-password', payload);

      Alert.alert('Envio de Email', userData.data?.message || 'E-mail enviado com sucesso', [{ text: 'OK' }]);

      if (userData.data) {
        setUsername(userData.data);
      } else {
        Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.', [{ text: 'OK' }]);
        setError(true);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados:', error);
      Alert.alert('Erro', 'Não foi possível recuperar a senha. Tente novamente.', [{ text: 'OK' }]);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const validateLogin = () => {
    if (!login) {
      Alert.alert('Erro', 'Campo de login não pode estar vazio.', [{ text: 'OK' }]);
      setError(true);
      return false;
    }

    if (validCPF() || validEmail()) {
      return true;
    }

    Alert.alert('Erro', 'Login inválido.', [{ text: 'OK' }]);
    setError(true);
    return false;
  };

  const validCPF = () => cpf.isValid(login);

  const validEmail = () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(login);

  const getInputStyle = () => ({
    ...styles.inputContainer,
    ...(error ? styles.dropdownError : {}),
  });

  return (
    <View style={{ flex: 1 }}>
          <View style={{flex: 1}}>
            <View style={styles.container}>    
              <View style={{ flex: 1 }}>
                   
                <InputTexto
                  text="Insira seu E-mail ou CPF"
                  value={login}
                  funcao={setLogin}
                  istrue={false}
                  max={50}
                  teclado="default"
                  icon={error ? 'account-alert' : 'account'}
                  redicon={error}
                  style={getInputStyle()}
                  placeholderTextColor={theme.placeholderColor}
                />
                {error && (
                  <Text style={styles.lenerror}>Informações erradas ou em branco</Text>
                )}
              </View>
    
              <TouchableOpacity
                style={[styles.Senhabutton, isLoading && styles.SenhabuttonDisabled]}
                onPress={handleRecover}
                disabled={isLoading}
                accessibilityLabel="Recuperar senha"
              >
                {isLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={theme.buttonTextColor} />
                    <Text style={[styles.SenhabuttonText, { marginLeft: 8 }]}>
                      Gerando Email...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.SenhabuttonText}>Recuperar Senha</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.SenharegisterLink}>
                  Ainda não tem uma conta? Registre-se aqui.
                </Text>
              </TouchableOpacity>
            </View>
           </View>
    
          <Rodape />
        </View>
  );
};

export default App;