// src/screens/MainScreen/index.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

import { getStyles } from './Styles';
import Rodape from '../../../components/Rodape';
import Logointro from '../../../components/logointro';
import Login from '../../../screens/LoginScreen/index';
import ScreenTabs from '../ScreenTabs/ScreenTabs';
import { useTheme } from '../../../context/ThemeContext';

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
          <ScreenTabs navigation={navigation} />
        </View>
      </View>
      <Rodape />
    </View>
  );
};

export default App;