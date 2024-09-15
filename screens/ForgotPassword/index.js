import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './Styles';
import Rodape from '../../components/Rodape';
import api from '../../api/api';
import { cpf } from 'cpf-cnpj-validator'; 

const App = ({ navigation }) => {
  const [username , setUsername]  = useState([]);
  const [login    , setLogin]     = useState('');
  const [mudanome , setmudanome]  = useState(false);

  const handleRecover = async () => {
    try {
      validateLogin();
      let userData = await api.get('Beneficiario/find/' + login );

      if (userData.data.rows.length !== 0) {
        setUsername(userData.data.rows)
        setmudanome(true);
      } else {
        Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.', [
          { text: 'OK' },
            ]);
        setmudanome(false);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados:', error);
      Alert.alert('Erro', 'Não foi possível recuperar a senha. Tente novamente.', [
        { text: 'OK' },
          ]);
      setmudanome(false);
    }
  };

  const versenha =()=>{
    if (username) {
      Alert.alert( `Olá, ${username[0].nm_beneficiario}, Tudo bem!`, `Esta é sua senha : ${username[0].cd_password} , em modelo de teste será mostrado em tela, mas futuramente será envida para o email de cadastro`, [
        { text: 'OK' },
          ]);
      setLogin(' ');
      setUsername([]);
      setmudanome(false);
    } else {
      Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.', [
        { text: 'OK' },
          ]);
      setmudanome(false);
    }
  };

  const validateLogin = () => {  
    if (validCPF() || validEmail()) {
      return true;
    } else if (login.length != 0 ) {
      Alert.alert('Erro', 'Login inválido.', [
        { text: 'OK' },
          ]);
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
  
  return (
    <View style={styles.Senhacontainer}>
      <TextInput
        style={styles.Senhainput}
        placeholder="Insira seu E-mail ou CPF"
        value={login} onChangeText={setLogin}
      />

      <TouchableOpacity style={styles.Senhabutton} onPress={() => {mudanome ? versenha() : handleRecover()}}>
        <Text style={styles.SenhabuttonText}>{mudanome ? 'Mostrar Senha' : 'Recuperar Senha'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.SenharegisterLink}>Ainda não tem uma conta? Registre-se aqui.</Text>
      </TouchableOpacity>

      <Rodape />
    </View>
  );
};

export default App;
