import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../../context/ThemeContext';
import { getStyles } from './ModalStyles';

import Home from './Home';           // Importação default correta
import Atendimento from './Atendimento';
import Financeiro from './Financeiro';
import Settings from './Settings';
import TabBarIcon from '../../../../components/TabBarIcon'; // Importação do componente de ícone

const Tab = createBottomTabNavigator();


const App = () => {
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.inicontainer}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} name={route.name} color={color} />
          ),
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: styles.tabBarActiveTintColor,
          tabBarInactiveTintColor: styles.tabBarInactiveTintColor || '#888',
          tabBarActiveBackgroundColor: styles.tabBarActiveBackgroundColor,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Atendimento" component={Atendimento} />
        <Tab.Screen name="Financeiro" component={Financeiro} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </View>
  );
};

export default App;
