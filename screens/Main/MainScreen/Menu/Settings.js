import React from 'react';
import { View, Text} from 'react-native';
import Botao from '../../../../components/BotaoMenu';
import {styles} from './styles';

const Menu = ({ navigation }) => { 
  return (
    <View style={styles.container}>

      <Text style={styles.title}>O que você precisa hoje:</Text>

      <View style={styles.rowContainerchat}>
        <Botao  text={'Alteração de Senha'}     nav={'Alteração de Senha'}    image={require('../../../../assets/src/senha.png')} />
        <Botao  text={'Alteração do Dados'}     nav={'Alteração do Dados'}    image={require('../../../../assets/src/dados.png')} />
        <Botao  text={'Inclusão de Dependente'} nav={'Inclusão de Dependente'}image={require('../../../../assets/src/Dependente.jpg')} />
      </View>

    </View>
  );
};

export default Menu;
