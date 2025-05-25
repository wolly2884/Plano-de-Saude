import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { styles } from './Styles';
import Rodape from '../../components/Rodape';
import api from '../../api/api';
import { cpf } from 'cpf-cnpj-validator'; 
import InputTexto from '../../components/InputTexto';

const App = ({ navigation }) => {
  const [username , setUsername]  = useState([]);
  const [login    , setLogin]     = useState('');
  const [mudanome , setMudanome]  = useState(false);
  const [error    , setError]     = useState(false);

  const handleRecover = async () => {
    try {
      if (!validateLogin()) return;
      
      let formattedLogin = cpf.isValid(login) ? cpf.strip(login) : login;
      let userData = await api.get(`Beneficiario/find/${formattedLogin}`);

      if (userData.data.rows.length !== 0) {
        setUsername(userData.data.rows);
        setMudanome(true);
      } else {
        Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.', [{ text: 'OK' }]);
        setMudanome(false);
        setError(true);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados:', error);
      Alert.alert('Erro', 'Não foi possível recuperar a senha. Tente novamente.', [{ text: 'OK' }]);
      setMudanome(false);
      setError(true);
    }
  };

  const versenha = () => {
    if (username.length > 0) {
      Alert.alert(
        `Olá, ${username[0].nm_beneficiario}, Tudo bem!`,
        `Esta é sua senha: ${username[0].cd_password}. Em modelo de teste será mostrado em tela, mas futuramente será enviada para o e-mail de cadastro.`,
        [{ text: 'OK' }]
      );
      setLogin('');
      setUsername([]);
      setMudanome(false);
    } else {
      Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.', [{ text: 'OK' }]);
      setMudanome(false);
      setError(true);
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
    return false;
  };

  const validCPF = () => cpf.isValid(login);
  
  const validEmail = () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(login);
  
  return (
    <View style={styles.Senhacontainer}>
      <ScrollView contentContainerStyle={{ marginTop: -3, bottom: 10 }}>
      
        <InputTexto 
          text="Insira seu E-mail ou CPF"        
          value={login}    
          funcao={setLogin}                 
          istrue={false}  
          max={50} 
          teclado="default"    
          icon={!login && error ? 'account-alert' : 'account'}
          redicon={!login && error}
        />
        {!login && error && (<Text style={styles.lenerror}>Informações erradas ou em branco</Text>)}

        <TouchableOpacity style={styles.Senhabutton} onPress={() => { mudanome ? versenha() : handleRecover() }}>
          <Text style={styles.SenhabuttonText}>{mudanome ? 'Mostrar Senha' : 'Recuperar Senha'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.SenharegisterLink}>Ainda não tem uma conta? Registre-se aqui.</Text>
        </TouchableOpacity>
     
      </ScrollView>
      <Rodape />
    </View>
  );
};

export default App;
