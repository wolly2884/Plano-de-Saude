import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cpf } from 'cpf-cnpj-validator';
import { getStyles } from './Styles';
import api from '../../api/api';
import Modal from 'react-native-modal';
import { useTheme } from '../../context/ThemeContext';
import { TextInput } from 'react-native-paper';
import { getFontSize, getFontFamily, isTablet } from '../../context/scaling';

const App = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [storedCPF, setStoredCPF] = useState('');
  const [storedEmail, setStoredEmail] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const initialFields = [
    { key: 'cd_age', value: '' },
    { key: 'cd_cardnumber', value: '' },
    { key: 'cd_cns', value: '' },
    { key: 'cd_cpf', value: '' },
    { key: 'ds_email', value: '' },
    { key: 'ds_healthplan', value: '' },
    { key: 'cd_password', value: '' },
    { key: 'nm_beneficiario', value: '' },
    { key: 'ic_beneficiario', value: '' },
    { key: 'id_titular', value: '' },
    { key: 'created_at', value: '' },
  ];
  const [fields, setFields] = useState(initialFields);
  const [users, setUsers] = useState([]);

  const handleLogin = async () => {
    try {
      const biometricFlag = await AsyncStorage.getItem('biometricConfigured');
      if (biometricFlag !== null && biometricFlag !== 'true') {
        setIsModalVisible(true);
      } else {
        navigation.navigate('pagina');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      Alert.alert('Erro', 'Não foi possível realizar o login. Tente novamente.');
    }
  };

  const validateLogin = async () => {
    if (validCPF() || validEmail()) {
      try {
        const userData = await api.get('Beneficiario/find/' + login);

        console.log(userData)
        if (!userData?.data?.rows?.length) {
          Alert.alert('Usuário não encontrado', 'Verifique o CPF ou e-mail.');
          return false;
        }

        updateFieldsFromUserData(userData);

        const user = userData.data.rows[0];
        setStoredCPF(user.cd_cpf || '');
        setStoredEmail(user.ds_email || '');
        setStoredPassword(user.cd_password || '');

        await AsyncStorage.setItem('CPF', user.cd_cpf || '');
        await AsyncStorage.setItem('age', user.cd_age?.toString() || '');
        await AsyncStorage.setItem('cardNumber', user.cd_cardnumber || '');
        await AsyncStorage.setItem('healthPlan', user.ds_healthplan || '');
        await AsyncStorage.setItem('username', user.nm_beneficiario || '');
        await AsyncStorage.setItem('CNS', user.cd_cns || '');
        await AsyncStorage.setItem('ID', user.id?.toString() || '');
        await AsyncStorage.setItem('Email', user.ds_email || '');
        await AsyncStorage.setItem('Users', JSON.stringify(users));

        return true;
      } catch (error) {
        console.error('Erro ao validar login:', error);
        Alert.alert('Erro', 'Falha ao validar credenciais. Tente novamente.');
        return false;
      }
    } else if (login.length !== 0) {
      Alert.alert('Erro', 'CPF ou e-mail inválido.');
      return false;
    }
    console.log(userData);
    return false;
  };

  const updateFieldsFromUserData = (userData) => {
    if (!userData?.data?.rows?.length) return;

    const rows = userData.data.rows;
    const tempUsers = [];

    rows.forEach((row, index) => {
      const tempFields = Object.keys(row).map((key) => ({
        key,
        value: row[key]?.toString() || '',
      }));
      tempUsers.push({ key: `User_${index}`, fields: tempFields });
    });

    setFields(tempUsers[0]?.fields || initialFields);
    setUsers((prevUsers) => [...prevUsers, ...tempUsers]);
  };

  const validCPF = () => {
    const formattedCPF = cpf.format(login);
    return formattedCPF.length === 14 && cpf.isValid(formattedCPF);
  };

  const validEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(login);
  };

  const handleLoginPress = async () => {
    if (login.trim() && password.trim()) {
      const isValid = await validateLogin();
      console.log(isValid);

      if (isValid && password === storedPassword) {
        await handleLogin();
      } else {
        Alert.alert('Credenciais inválidas', 'Verifique seu CPF, e-mail ou senha.');
      }
    } else {
      Alert.alert('Campos vazios', 'Por favor, preencha o login e a senha.');
    }
  };

  const handleModalConfirm = async () => {
    await AsyncStorage.setItem('biometricConfigured', 'true');
    setIsModalVisible(false);
    navigation.navigate('pagina');
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    navigation.navigate('pagina');
  };

  return (
    <View style={styles.loginsearchBar}>
      <TextInput
        style={styles.logininput}
        placeholder="Insira seu E-mail ou CPF"
        placeholderTextColor={theme.placeholderColor || '#999'}
        value={login}
        onChangeText={setLogin}
        onBlur={validateLogin}
        mode="outlined"
        textColor={theme.textColor || '#000'}
        underlineColor="transparent"
        activeOutlineColor="#fff"
        outlineColor="#666"
        label="E-mail ou CPF"
        theme={{
          colors: {
            text: theme.textColor || '#000',
            placeholder: theme.placeholderColor || '#999',
            primary: theme.textColor || '#000',
            background: theme.inputBackground || '#fff',
          },
          fonts: {
            regular: {
              fontFamily: getFontFamily('regular'),
              fontSize: getFontSize(16),
            },
          },
        }}
      />
      <TextInput
        style={styles.logininput}
        placeholder="Insira sua senha"
        placeholderTextColor={theme.placeholderColor || '#999'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        textColor={theme.textColor || '#000'}
        underlineColor="transparent"
        activeOutlineColor="#fff"
        outlineColor="#666"
        label="Senha"
        theme={{
          colors: {
            text: theme.textColor || '#000',
            placeholder: theme.placeholderColor || '#999',
            primary: theme.textColor || '#000',
            background: theme.inputBackground || '#fff',
          },
          fonts: {
            regular: {
              fontFamily: getFontFamily('regular'),
              fontSize: getFontSize(16),
            },
          },
        }}
      />
      <TouchableOpacity style={styles.loginnavBar} onPress={handleLoginPress}>
        <Text style={styles.loginnavItem}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Recuperar Senha')}>
        <Text style={styles.loginTexto}>Esqueceu sua Senha</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.loginTexto}>Ainda não tem uma conta? Registre-se aqui.</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Deseja ativar o uso da biometria para login futuro?</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleModalConfirm}>
            <Text style={styles.modalButtonText}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleModalCancel}>
            <Text style={styles.modalButtonText}>Não</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default App;