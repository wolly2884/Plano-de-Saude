// src/screens/AcessoNegado.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../../context/ThemeContext'; // supondo que ThemeContext está neste caminho
import { getStyles } from './styles'; // supondo que styles está neste arquivo

export default function AcessoNegado() {
  const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.title,{color: 'red'}]}>Acesso Negado</Text>
      <Text style={styles.message}>
        Sua empresa ainda não possui permissão para acessar o aplicativo.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Suporte')}>
        <Text style={styles.buttonText}>Ir para o Suporte</Text>
      </TouchableOpacity>
    </View>
  );
}

