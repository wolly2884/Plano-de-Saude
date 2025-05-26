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

        <SafeAreaView style={styles.containerVerso} />    
        <SafeAreaView style={styles.faixaverso} />

        <Text style={styles.versoText}>Confira a Assinatura</Text>
        <Text style={styles.versoText2}>Assinatura do Segurado</Text>
        <Text style={styles.versoText3}>{relacio}</Text>    
        <Text style={styles.versoText4}>{assistpessoal}</Text>
        
        <View style={styles.logointroverso}>
            <Logointro />
        </View>
      </LinearGradient>

      <TouchableOpacity style={styles.bottonverso} onPress={ () => navigation.navigate('Carterinha Virtual')}>
          <IconCarteirinha style={styles.imagebotton} />
          <Text style={styles.Textstyle}>Frente do Cartão</Text>
      </TouchableOpacity>
    </View>

    <Rodape />
    </View>
  );
};

export default App;
