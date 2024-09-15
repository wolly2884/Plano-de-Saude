import React from 'react';
import { View, Text } from 'react-native';
import Botao from '../../../../components/BotaoMenu';
import {styles} from './styles'


const Menu = ({ navigation }) => { 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>O que você precisa hoje:</Text>

      <View style={styles.rowContainer}  >
        <Botao  text={'Contato'}                nav={'Contato'}                image={require('../../../../assets/src/atendimento.png')}  />
        <Botao  text={'Atendimento ao Cliente'} nav={'Atendimento ao Cliente'} image={require('../../../../assets/src/contato.png')} />
        <Botao  text={'Manuais'}                nav={'Manuais'}                image={require('../../../../assets/src/manuais.png')}     />
      </View>

      <View style={styles.rowContainer2}  >
        <Botao  text={'Agenda Medica'}          nav={'Agendamento'}            image={require('../../../../assets/src/agendamedica.png')} />
        <Botao  text={'Receita'}                nav={'Medicamentos'}           image={require('../../../../assets/src/receitamedica.png')} />
    </View>

    </View>
  );
};

export default Menu;

