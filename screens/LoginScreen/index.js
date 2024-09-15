import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cpf } from 'cpf-cnpj-validator'; 
import {styles} from './Styles'
import api from '../../api/api';

const App = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [storedCPF, setstoredCPF] = useState('')
  const [storedEmail, setstoredEmail] = useState('')
  const [storedPassword, setstoredPassword] = useState('')

  const handleLogin = async () => {

    try {    
      if ((login === storedCPF && password === storedPassword) || (login === storedEmail && password === storedPassword) || Platform.OS === 'web') {
        navigation.navigate('pagina');
      } else {
        Alert.alert('Credenciais inválidas');
      } 

      } catch (error) {
        console.error('Erro ao recuperar ou armazenar os dados:', error);
        Alert.alert('Erro', 'Não foi possível realizar o login. Tente novamente.', [
          { text: 'OK' },
            ]);
      }
  };

  const validateLogin = async () => {  
    if (validCPF() || validEmail()) {
      
      let userData = await api.get('Beneficiario/find/' + login );
      
      const sCPF = userData.data.rows[0].cd_cpf;
      setstoredCPF(sCPF);  
      
      const sEmail = userData.data.rows[0].ds_email;
      setstoredEmail(sEmail);

      const sPassword = userData.data.rows[0].cd_password;
      setstoredPassword(sPassword);

      const sAge        = userData.data.rows[0].cd_age;
      const sCardNumber = userData.data.rows[0].cd_cardnumber;
      const sHealthPlan = userData.data.rows[0].ds_healthplan;
      const sNome       = userData.data.rows[0].nm_beneficiario;
      const sCNS        = userData.data.rows[0].cd_cns;
      const sID         = userData.data.rows[0].id.toString();

      //await AsyncStorage.clear();
      await AsyncStorage.setItem('CPF'        , sCPF);
      await AsyncStorage.setItem('age'        , sAge);
      await AsyncStorage.setItem('cardNumber' , sCardNumber);
      await AsyncStorage.setItem('healthPlan' , sHealthPlan);
      await AsyncStorage.setItem('username'   , sNome);
      await AsyncStorage.setItem('CNS'        , sCNS);
      await AsyncStorage.setItem('ID'         , sID);

      return true;
    } else if (login.length != 0 ) {
      Alert.alert('Erro', 'Login inválido.');
      return false;
    }
    return false;
  };

  const validCPF = () => {
    const formattedCPF = cpf.format(login);
    if (formattedCPF.length === 14 && cpf.isValid(formattedCPF)) {
      setLogin(login);
      return true;
    }
    return false;
  };
  
  const validEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(login)){
      setLogin(login);
      return true;
    }
    return false;
  };

  const handleLoginPress = () => {
    if (login.trim() !== '' && password.trim() !== '') { // Check if login and password are not empty
      if (validateLogin()) {
        handleLogin();
      }
    } else {
      Alert.alert('Campos vazios', 'Por favor, preencha o login e a senha.');
    }
  };

  return (
    <View style={styles.loginsearchBar}>
      <TextInput style={styles.logininput} placeholder="Insira seu E-mail ou CPF" value={login} onChangeText={setLogin} onBlur={validateLogin} />
      <TextInput style={styles.logininput} placeholder="Insira sua senha" secureTextEntry value={password} onChangeText={setPassword} />
      
      <TouchableOpacity style={styles.loginnavBar} onPress={handleLoginPress}>
        <Text style={styles.loginnavItem}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Recuperar Senha')}>
        <Text style={styles.loginTexto}>Esqueceu sua Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.loginTexto}>Ainda não tem uma conta? Registre-se aqui.</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;