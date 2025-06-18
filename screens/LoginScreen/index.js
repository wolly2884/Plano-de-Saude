import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cpf } from 'cpf-cnpj-validator';
import api from '../../api/api';
import Modal from 'react-native-modal';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './Styles';

const LoginScreen = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [storedCPF, setStoredCPF] = useState('');
  const [storedEmail, setStoredEmail] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const validCPF = () => {
    const onlyDigits = login.replace(/\D/g, '');
    if (onlyDigits.length === 11 && cpf.isValid(onlyDigits)) {
      setLogin(onlyDigits);
      return true;
    }
    return false;
  };

  const validEmail = () => {
    const email = login.toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) {
      setLogin(email);
      return true;
    }
    return false;
  };

  const storeUserData = async (data) => {
    const {
      cd_cpf,
      ds_email,
      cd_password,
      cd_age,
      cd_cardnumber,
      ds_healthplan,
      nm_beneficiario,
      cd_cns,
      id,
    } = data;

    await AsyncStorage.multiSet([
      ['CPF', cd_cpf],
      ['age', cd_age],
      ['cardNumber', cd_cardnumber],
      ['healthPlan', ds_healthplan],
      ['username', nm_beneficiario],
      ['CNS', cd_cns],
      ['ID', id.toString()],
      ['Email', ds_email],
    ]);
  };

  const formatBeneficiaries = (rows) =>
    rows.map(item => ({
      key: item.id,
      value: item.nm_beneficiario,
      nm_beneficiario: item.nm_beneficiario,
      cd_cpf: item.cd_cpf,
      cd_password: item.cd_password,
      cd_age: item.cd_age,
      ic_estado_civil: item.ic_estado_civil,
      ic_sexo: item.ic_sexo,
      ds_email: item.ds_email,
      cd_celular: item.cd_celular,
      nm_logradouro: item.nm_logradouro,
      cd_numero: item.cd_numero,
      nm_complemento: item.nm_complemento,
      nm_cidade: item.nm_cidade,
      cd_cep: item.cd_cep,
      sg_estado: item.sg_estado,
      cd_cardnumber: item.cd_cardnumber,
      ds_healthplan: item.ds_healthplan,
      cd_cns: item.cd_cns,
      dt_inclusao: item.dt_inclusao,
    }));

  const validateLogin = async () => {
    if (validCPF() || validEmail()) {
      const sanitizedLogin = cpf.isValid(login) ? login.replace(/\D/g, '') : login.toLowerCase();
    
      try {
        const response = await api.get(`Beneficiario/find/${sanitizedLogin}`);
        const { rowCount, rows } = response.data;

        if (rowCount > 0) {
          const user = rows[0];
          setStoredCPF(user.cd_cpf);
          setStoredEmail(user.ds_email);
          setStoredPassword(user.cd_password);

          await storeUserData(user);
          await AsyncStorage.setItem('beneficiaries', JSON.stringify([]));
          await AsyncStorage.setItem('beneficiaries', JSON.stringify(formatBeneficiaries(rows)));

          return true;
        } else {
          Alert.alert('Erro', 'Usuário não encontrado.');
          return false;
        }
      } catch (error) {
        console.error('Erro na API:', error);
        Alert.alert('Erro', 'Não foi possível validar os dados.');
        return false;
      }
    } else if (login.trim().length > 0) {
      Alert.alert('Erro', 'Login inválido.');
    }
    return false;
  };

  const handleLogin = async () => {
    try {
      const biometricFlag = await AsyncStorage.getItem('biometricConfigured');

      if (
        (login === storedCPF && password === storedPassword) ||
        (login === storedEmail && password === storedPassword) 
      ) {
        if (biometricFlag !== null && biometricFlag === 'false') {
          setIsModalVisible(true);
        } else {
          navigation.navigate('pagina');
        }
      } else {
        Alert.alert('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro ao validar login:', error);
      Alert.alert('Erro', 'Não foi possível realizar o login. Tente novamente.');
    }
  };

  const handleLoginPress = async () => {
    if (login.trim() && password.trim()) {
      setLoading(true);
      const isValid = await validateLogin();
      setLoading(false);
      if (isValid) {
        handleLogin();
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
        value={login}
        onChangeText={setLogin}
        onBlur={validateLogin}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.logininput}
        placeholder="Insira sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginnavBar} onPress={handleLoginPress}>
        <Text style={styles.loginnavItem}>Entrar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 10 }} />}

      <TouchableOpacity onPress={() => navigation.navigate('Recuperar Senha')}>
        <Text style={styles.loginTexto}>Esqueceu sua Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.loginTexto}>Ainda não tem uma conta? Registre-se aqui.</Text>
      </TouchableOpacity>

      {/* Modal de confirmação */}
      <Modal isVisible={isModalVisible} backdropOpacity={0.7}>
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

export default LoginScreen;
