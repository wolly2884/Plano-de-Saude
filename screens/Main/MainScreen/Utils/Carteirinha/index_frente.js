import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Rodape from '../../../../../components/Rodape';
import IconCarteirinha from '../../../../../components/IconCarteirinha';
import Logointro from '../../../../../components/logointro';
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles, isTablet } from './ModalStyles'; // <-- import separado

const CarterinhaVirtual = ({ navigation, route }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [healthPlan, setHealthPlan] = useState('');
  const [username, setUsername] = useState('');
  const [CNS, setCNS] = useState('');
  const [tabletDevice, setTabletDevice] = useState(false); // novo estado

  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    // Verifica se é tablet uma vez ao montar
    setTabletDevice(isTablet());
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          let storedCardNumber = '';
          let storedHealthPlan = '';
          let storedCNS = '';
          let storedUsername = '';
          const items = route.params?.items;

          if (items === undefined) {
            storedCardNumber = await AsyncStorage.getItem('cardNumber');
            storedHealthPlan = await AsyncStorage.getItem('healthPlan');
            storedCNS = await AsyncStorage.getItem('CNS');
            storedUsername = await AsyncStorage.getItem('username');
          } else {
            storedCardNumber = items.cd_cardnumber;
            storedHealthPlan = items.ds_healthplan;
            storedCNS = items.cd_cns;
            storedUsername = items.nm_beneficiario;
          }

          setCardNumber(storedCardNumber);
          setHealthPlan(storedHealthPlan);
          setCNS(storedCNS);
          setUsername(storedUsername);
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };

      checkLoginStatus();
    }, [navigation])
  );

  return (
    <View style={styles.CVsafeArea}>
      <View style={styles.container}>
        <LinearGradient style={styles.CVgradient} colors={['#192f6a', 'red']}>
          <SafeAreaView style={styles.CVsafeArea}>
            <View style={styles.logointro}>
              <Logointro />
            </View>

            <View style={styles.containerCard}>
              <Text style={styles.tipcard}>Individual</Text>
              <Text style={styles.acomodation}>SAUDE TOP QUARTO PLUS</Text>
              <Text style={styles.healthPlan}>{healthPlan}</Text> 
              <Text style={styles.empresa}>FATEC SAUDE</Text> 
              <Text style={styles.username}>{username}</Text> 
              <Text style={styles.validcard}>VALIDO ATÉ</Text> 
              <Text style={styles.validinfo}>05/2025</Text> 
            </View>
            <Text style={styles.cardcns}>CARTÃO NACIONAL DE SAUDE : {CNS} </Text> 
            <Text style={styles.cnsinfo}>{cardNumber}</Text>
          </SafeAreaView>
        </LinearGradient>

        <TouchableOpacity
          style={styles.bottonverso}
          onPress={() => navigation.navigate('Carterinha Verso')}
        >
          <IconCarteirinha style={{ width: 20, height: 20 }} />
          <Text style={styles.Textstyle}>Verso do Cartão</Text>
        </TouchableOpacity>
      </View>

      <Rodape />
    </View>
  );
};

export default CarterinhaVirtual;
