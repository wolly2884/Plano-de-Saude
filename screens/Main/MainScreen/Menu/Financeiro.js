import React from 'react';
import { View, Text } from 'react-native';
import Botao from '../../../../components/BotaoMenu';
import {styles} from './styles'


const Menu = ({ navigation }) => { 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>O que você precisa hoje:</Text>
      
      <View style={styles.rowContainer}  >
        <Botao  text={'Extrato Utilização'}      nav={'Extrato Utilização'}        image={require('../../../../assets/src/utilizacao.png')}  />
        <Botao  text={'Extrato Financeiro'}      nav={'Extrato Financerio'}        image={require('../../../../assets/src/financeiro.png')} />
        <Botao  text={'Extrato Coparticipação'}  nav={'Extrato Coparticipação'}    image={require('../../../../assets/src/copart.png')}     />
      </View>

      <View style={styles.rowContainer2}  >
        <Botao  text={'Geração Imposto Renda'}   nav={'Imposto de Renda'}          image={require('../../../../assets/src/IRPF.png')}  />
        <Botao  text={'2ª do Boleto'}            nav={'Via Boleto'}                image={require('../../../../assets/src/boleto.png')} />
      </View>
    </View>
  );
};

export default Menu;
