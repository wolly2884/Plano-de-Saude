import React, { useCallback, useState } from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../../context/ThemeContext';
import Rodape from '../../../../../components/Rodape';
import { getStyles } from './ModalStyles';

const ConfiguracoesSwitch = ({ navigation }) => {
  const { toggleTheme, isNightMode, theme } = useTheme();
  const styles = getStyles(theme);

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const toggleBiometricSwitch = async () => {
    try {
      const newValue = !isBiometricEnabled;
      setIsBiometricEnabled(newValue);
      await AsyncStorage.setItem('biometricConfigured', JSON.stringify(newValue));
    } catch (error) {
      console.error('Erro ao salvar configuração biométrica:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadBiometricSetting = async () => {
        try {
          const biometricFlag = await AsyncStorage.getItem('biometricConfigured');
          if (biometricFlag !== null) {
            setIsBiometricEnabled(JSON.parse(biometricFlag));
          }
        } catch (error) {
          console.error('Erro ao carregar configuração biométrica:', error);
        }
      };
      loadBiometricSetting();
    }, [navigation])
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.Scrollcontainer}>
        <Text style={styles.section_text}>Configuração</Text>

        {/* Biometria */}
        <View style={styles.switchContainer}>
          <Text style={styles.textPrice}>Autenticação biométrica</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isBiometricEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleBiometricSwitch}
            value={isBiometricEnabled}
          />
        </View>

        {/* Tema */}
        <View style={styles.switchContainer}>
          <Text style={styles.textPrice}>Modo escuro</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isNightMode ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isNightMode}
          />
        </View>
      </ScrollView>

      <Rodape />
    </View>
  );
};

export default ConfiguracoesSwitch;