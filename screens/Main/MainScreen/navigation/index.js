import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../context/ThemeContext';
import { getStyles } from './Styles';
import Rodape from '../../../../components/Rodape';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../Menu/NewAbas';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../../../../components/cartaoAnimed';
import api from '../../../../api/api';
import dateUtils from '../../../../api/functions';
import Logointro from '../../../../components/logointro';


const App = ({ navigation }) => {
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [itens, setItens] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const storedID = await AsyncStorage.getItem('ID');

          if (!storedID) {
            
            // If no ID is stored, navigate to the login screen
            navigation.navigate('Logout');
            return; // Exit the function to avoid further execution
          }

          // Get current date
          const formattedDate = dateUtils.getFormattedDate(); // "2025-03-26"

          // Fetch user data
          const userData = await api.get(`Beneficiario/get/${storedID}`);
          const cpfArray = userData.data.rows.map(item => `'${item.cd_cpf}'`).join(',');

          // Fetch agenda data
          const istem = await api.get(`/Agenda/get/${cpfArray}&'${formattedDate}'`);

          setItens(istem.data.rowCount > 0);
          setBeneficiarios(userData.data.rows);
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };

      checkLoginStatus();
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', top: 65, justifyContent: 'space-around' }}>
        <TouchableOpacity style={{ left: 1, top: 1 }} onPress={() => navigation.navigate('Alarmes')}>
          <Icon name={itens ? "event-available" : "event-busy"} size={30} color="white" style={{ left: 230, top: 8 }} />
        </TouchableOpacity>
        <TouchableOpacity style={{ left: 1, top: 1 }} onPress={() => navigation.navigate('Logout')}>
          <Icon name="logout" size={30} color="white" style={{ left: 70, top: 8 }} />
        </TouchableOpacity>
      </View>
      <View style={{height: 8, top: -5}}>
        <Logointro />
      </View>
      <Screen items={beneficiarios} navigation={navigation} />
      <SafeAreaView style={styles.centro}>
        <Menu navigation={navigation} />
      </SafeAreaView>
      <Rodape />
    </View>
  );
};

export default App;
