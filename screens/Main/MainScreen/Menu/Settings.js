import React from 'react';
import { View, Text} from 'react-native';
import Botao from '../../../../components/BotaoMenu';
import { useTheme } from '../../../../context/ThemeContext';
import { getStyles } from './ModalStyles';

const Menu = ({ navigation }) => {
  const { theme, isThemeLoaded } = useTheme();
    const styles = getStyles(theme);
    
    return (
    <View style={styles.container}>
      <Text style={styles.title}>O que você precisa hoje:</Text>

      <View style={styles.rowContainer}>
        <Botao text={'Alteração de Senha'} nav={'Alteração de Senha'} image={require('../../../../assets/src/senha.png')} />
        <Botao text={'Alteração do Dados'} nav={'Alteração do Dados'} image={require('../../../../assets/src/dados.png')} />
        <Botao text={'Alteração do Email'} nav={'Alteração do Email'} image={require('../../../../assets/src/email.png')} />
      </View>

      <View style={styles.rowContainer2}>
        <Botao text={'Inclusão Dependente'}     nav={'Inclusão de Dependente'} image={require('../../../../assets/src/Dependente.jpg')} />
        <Botao text={'Configuração'}            nav={'Configurações'}           image={require('../../../../assets/src/config.png')} />
      </View>
    </View>
  );
};

export default Menu;
