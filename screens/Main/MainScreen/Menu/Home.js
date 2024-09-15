import React from 'react';
import { View, Text} from 'react-native';
import Botao from '../../../../components/BotaoMenu';
import {styles} from './styles';

const Menu = ({ navigation }) => { 
  return (
    <View style={styles.container}>

      <Text style={styles.title}>O que você precisa hoje:</Text>

      <View style={styles.rowContainer}>
        <Botao  text={'Carterinha Virtual'}     nav={'Carterinha Virtual'} navegar={ navigation }  image={require('../../../../assets/src/cartao.png')} />
        <Botao  text={'Gerar Token'}            nav={'Gerar Token'}        navegar={ navigation }  image={require('../../../../assets/src/qrcode.png')} />
        <Botao  text={'Rede Credenciada'}       nav={'Rede Credenciada'}   navegar={ navigation }  image={require('../../../../assets/src/redecredenciada.png')} />
      </View>

      <View style={styles.rowContainer2}>
        <Botao  text={'Noticias'}               nav={'Noticias'}      navegar={ navigation } image={require('../../../../assets/src/Noticias.png')} />
        <Botao  text={'Minha Agenda'}           nav={'Alarmes'}       navegar={ navigation } image={require('../../../../assets/src/Alarme.png')} />
        <Botao  text={'Logout'}                 nav={'Logout'}        navegar={ navigation } image={require('../../../../assets/src/logout.png')} />
      </View>

    </View>
  );
};

export default Menu;
