import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../../../../../context/ThemeContext'; // ajuste conforme seu projeto
import { getStyles } from './styles'; // ajuste conforme seu projeto
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMPRESA_EMAIL } from '@env';

export default function Suporte() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [contato, setContato] = useState('5521999999999'); // padrão caso não carregue
  const [email, setEmail] = useState(EMPRESA_EMAIL || 'suporte@empresa.com');

  // Carrega os dados da empresa do AsyncStorage ao montar componente
  useEffect(() => {
    const DadosEmpresa = async () => {
      try {
        const empresaString = await AsyncStorage.getItem('EmpresaUser');
        if (empresaString) {
          const empresa = JSON.parse(empresaString);
          // telefone padrão ou número salvo em contato
          setContato(empresa.contato || '5521999999999');
          // email salvo no storage ou do .env
          setEmail(empresa.ds_email || EMPRESA_EMAIL || 'suporte@empresa.com');
        }
      } catch (error) {
        console.error('Erro ao obter dados da empresa:', error);
      }
    };

    DadosEmpresa();
  }, []);

  const abrirWhatsapp = () => {
    const telefone = contato.replace(/\D/g, ''); // remove caracteres não numéricos
    const mensagem = 'Olá! Preciso de ajuda com o acesso ao aplicativo.';
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.')
    );
  };

  const enviarEmail = () => {
    const assunto = 'Ajuda com o acesso ao app';
    const corpo = 'Olá, estou com dificuldade para acessar o aplicativo.';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

    Linking.openURL(mailto).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de email.')
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suporte ao Usuário</Text>
      <Text style={styles.message}>
        Se sua empresa ainda não tem acesso ao aplicativo ou você está com dificuldades, entre em contato conosco:
      </Text>

      <TouchableOpacity style={styles.button} onPress={abrirWhatsapp}>
        <Text style={styles.buttonText}>Falar com suporte via WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={enviarEmail}>
        <Text style={styles.buttonText}>Enviar email para suporte</Text>
      </TouchableOpacity>
    </View>
  );
}
