import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { styles } from './Styles';
import Rodape from '../../../components/Rodape';
import LogoSVG from '../../../components/LogoSVG';
import Login from '../../LoginScreen/index';
import Planos from '../ScreenTabs/PlanosTabs/index';
import Noticias from '../ScreenTabs/NoticiasTabs/index';
import RedeCredenciada from '../ScreenTabs/RedeCredenciadaTabs/index';

const Tab = createMaterialTopTabNavigator();

const App = ({ navigation }) => {
  useEffect(() => {
    // Lock screen orientation to PORTRAIT_UP
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    return () => {
      // Unlock screen orientation when component unmounts
      // ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View style={styles.navcontainer}>
      <View style={styles.navcontent}>
        <View style={styles.homenavBar}>
          <View style={styles.navRow}>
            <View style={{ alignItems: 'center', marginTop: 80 }}>
              <LogoSVG />
              <Text style={{ textAlign: 'center' }}>Bem vindo ao Login do Portal do Beneficiário</Text>
            </View>
          </View>
          <Login navigation={navigation} />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarLabel: ({ focused }) => {
                let label = '';
                switch (route.name) {
                  case 'Planos':
                    label = 'Planos';
                    break;
                  case 'Noticias':
                    label = 'Notícias';
                    break;
                  case 'Rede Credenciada':
                    label = 'Rede Credenciada';
                    break;
                  default:
                    break;
                }
                return (
                  <Text style={{ fontSize: 13, color: focused ? '#00BFFF' : 'black' }}>{label}</Text>
                );
              },
              tabStyle: { width: 135 },
              style: { backgroundColor: 'white' },
              indicatorStyle: { backgroundColor: '#00BFFF' },
            })}
          >
            <Tab.Screen name='Planos' component={Planos} />
            <Tab.Screen name='Noticias' component={Noticias} />
            <Tab.Screen name='Rede Credenciada' component={RedeCredenciada} />
          </Tab.Navigator>
        </View>
      </View>
      <Rodape />
    </View>
  );
};

export default App;
