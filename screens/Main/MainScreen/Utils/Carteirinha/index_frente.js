import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Rodape  from '../../../../../components/Rodape'
import IconCarteirinha  from '../../../../../components/IconCarteirinha'
import Logointro from '../../../../../components/logointro';
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './ModalStyles';

const CarterinhaVirtual = ({ navigation, route }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [healthPlan, setHealthPlan] = useState('');
  const [username, setUsername] = useState('');
  const [CNS, setCNS] = useState('');
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);

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
    <View style={{flex: 1}}>
    <View style={styles.container}>
      <LinearGradient style={styles.CVgradient} colors={['#192f6a', 'red']}>
       
        <SafeAreaView style={styles.CVsafeArea}>
          <Text style={styles.CVtitle}>Individual</Text>
           
          <View style={{width: 50, bottom: 120, right: 30, transform: [{ rotate: '90deg' }], position: 'absolute' }}>
              <Logointro />
          </View>
          <View >
            <Text style={{fontSize: 15,
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: 10,
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: 40,
                        right: 0,
                        top: 130
                      }}>SAUDE TOP QUARTO PLUS</Text> 
          </View>
          <View >
            <Text style={{fontSize: 15,
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: 10,
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: 20,
                        right: 0,
                        top: 100
                      }}>{healthPlan}</Text> 
            </View>
            <View >
              <Text style={{fontSize: 25,
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: 10,
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: -30,
                        right: 0,
                        top: 65
                      }}>FATEC SAUDE</Text> 
            </View>

            <View >
              <Text style={{fontSize: 15,
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: 10,
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: -55,
                        right: 0,
                        top: 30
                      }}>{username}</Text> 
            </View>

             <View >
              <Text style={{fontSize: 15,
                        color: 'white',
                        fontWeight: 'bold',
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: -20,
                        right: 0,
                        top: 315
                      }}>VALIDO ATÉ</Text> 
              <Text style={{fontSize: 18,
                        color: 'white',
                        fontWeight: 'bold',
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: -35,
                        right: 0,
                        top: 294
                      }}>05/2025</Text> 
            </View>

            <View >
              <Text style={{fontSize: 10,
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: 10,
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: -100,
                        right: 0,
                        top: -40
                      }}>CARTÃO NACIONAL DE SAUDE : {CNS} </Text> 
            </View>

            <View >
              <Text style={{fontSize: 22,
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: 10,
                        transform: [{ rotate: '90deg' }],
                        bottom: 0,
                        left: -120,
                        right: 0,
                        top: -75
                      }}>{cardNumber}</Text> 
            </View>
        </SafeAreaView>

        <SafeAreaView>
        </SafeAreaView>
      </LinearGradient>

      <TouchableOpacity style={{marginLeft: 50, top: 20, flexDirection: 'row'}} onPress={ () => navigation.navigate('Carterinha Verso')}>
          <IconCarteirinha style={{width: 20, height: 20}} />
          <Text style={styles.Textstyle}>Verso do Cartão</Text>
      </TouchableOpacity>
    </View>

      <Rodape />
    </View>
  );
};

export default CarterinhaVirtual;
