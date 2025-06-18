// src/screens/MainScreen/index.js
import React, { useEffect } from 'react';
import { View, Text, Switch, Image } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getStyles } from './Styles';
import Rodape from '../../../components/Rodape';
import LogoSVG from '../../../components/LogoSVG';
import PlanFacil   from '../../../components/PlanoFacil';
import Logointro from '../../../components/logointro';

import Login from '../../LoginScreen/index';
import Planos from '../ScreenTabs/PlanosTabs/index';
import Noticias from '../ScreenTabs/NoticiasTabs/index';
import RedeCredenciada from '../ScreenTabs/RedeCredenciadaTabs/index';
import { useTheme } from '../../../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const App = ({ navigation }) => {
  const { theme, toggleTheme, isNightMode } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => {
      // ScreenOrientation.unlockAsync(); // Uncomment if needed
    };
  }, []);

  return (
    <View style={styles.navcontainer}>
      <View style={styles.navcontent}>
        <View style={styles.homenavBar}>
          <View style={styles.navRow}>
            <View style={{ alignItems: 'center', marginTop: 70 }}>
              <View style={{left: 30, height: 60, top: 5, alignContent: 'center', justifyContent: 'center'}}>
                <Logointro />
              </View>
              <Text style={styles.welcomeText}>
                Bem vindo ao Login do Portal do Beneficiário
              </Text>
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
                  <Text
                    style={{
                      fontSize: 13,
                      color: focused
                        ? theme.tabBarActiveTextColor
                        : theme.tabBarTextColor,
                    }}
                  >
                    {label}
                  </Text>
                );
              },
              tabBarStyle: {
                backgroundColor: theme.tabBarBackground,
              },
              tabBarIndicatorStyle: {
                backgroundColor: theme.tabBarIndicatorColor,
              },
              tabBarItemStyle: { width: 135 },
            })}
          >
            <Tab.Screen name="Planos" component={Planos} />
            <Tab.Screen name="Noticias" component={Noticias} />
            <Tab.Screen name="Rede Credenciada" component={RedeCredenciada} />
          </Tab.Navigator>
        </View>
      </View>
      <Rodape />
    </View>
  );
};

export default App;