import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Rodape  from '../../../../../components/Rodape'
import IconCarteirinha  from '../../../../../components/IconVersoCarteirinha'
import Logointro from '../../../../../components/logointro';
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './ModalStyles';

const App = ({ navigation }) => {

  const relacio = 'Central de Relacionamento\ncom o cliente : 0800 721 2700\nSAC 0800 727 6699\n\nCentral de Atendimento ao Cliente\nao Surdo : 0800 721 2708\n\nwww.PlanoFacil.com.br';
  const assistpessoal = 'Assistente Pessoa\n[Somente aqueles que possuem esse cobertura]\n\nligações no Brasil : 0800 14 02 02\nLigações no exterior : 55 11 4133 9111';
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={{flex: 1}}>
    <View style={styles.container}>
      <LinearGradient style={styles.CVgradient} colors={['#192f6a', 'red']}>

        <SafeAreaView 
          style={{
            width: 60, 
            height: '100%', 
            backgroundColor: '#000', 
            left: 220 
          }}
        />
        
        <Text 
          style={{
            transform: [{ rotate: '90deg' }], 
            left: 50, 
            bottom: 180, 
            color: '#fff', 
            fontSize: 10
          }}
        >
          Confira a Assinatura
        </Text>
        
        <Text 
          style={{
            transform: [{ rotate: '90deg' }], 
            left: -30, 
            bottom: 200, 
            color: '#fff', 
            fontSize: 10
          }}
        >
          Assinatura do Segurado
        </Text>
  
        <Text 
          style={{
            transform: [{ rotate: '90deg' }], 
            left: -98,  
            bottom: 420, 
            color: '#fff', 
            fontSize: 10
          }}
        >
          {relacio}
        </Text>
        
        <Text 
          style={{
            transform: [{ rotate: '90deg' }], 
            left: -100, 
            bottom: 250, 
            color: '#fff', 
            fontSize: 10
          }}
        >
          {assistpessoal}
        </Text>

        <SafeAreaView 
          style={{
            width: 60, 
            height: '95%', 
            backgroundColor: '#fff', 
            left: 140,
            bottom: 710,
          }}
        />
        
        <View style={{width: 50, bottom: 120, right: 40, transform: [{ rotate: '90deg' }], position: 'absolute' }}>
            <Logointro />
        </View>

        <SafeAreaView>
        </SafeAreaView>
      </LinearGradient>

      <TouchableOpacity style={{marginLeft: 50, top: 30, flexDirection: 'row'}} onPress={ () => navigation.navigate('Carterinha Virtual')}>
          <IconCarteirinha style={{width: 30, height: 30}} />
          <Text style={styles.Textstyle}>Frente do Cartão</Text>
      </TouchableOpacity>
    </View>

    <Rodape />
    </View>
  );
};

export default App;
