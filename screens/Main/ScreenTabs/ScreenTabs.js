import React from 'react';
import { Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Planos from './PlanosTabs/index';
import Noticias from './NoticiasTabs/index';
import RedeCredenciada from './RedeCredenciadaTabs/index';
import { useTheme } from '@react-navigation/native'; // ou o seu ThemeContext

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  const theme = useTheme(); // ou seu próprio theme

  return (
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
                  ? theme.colors.primary // ou theme.tabBarActiveTextColor
                  : theme.colors.text,    // ou theme.tabBarTextColor
              }}
            >
              {label}
            </Text>
          );
        },
        tabBarStyle: {
          backgroundColor: theme.colors.card, // ou theme.tabBarBackground
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary, // ou theme.tabBarIndicatorColor
        },
        tabBarItemStyle: { width: 135 },
        tabBarScrollEnabled: true, // necessário se a largura total ultrapassar a tela
      })}
    >
      <Tab.Screen name="Planos" component={Planos} />
      <Tab.Screen name="Noticias" component={Noticias} />
      <Tab.Screen name="Rede Credenciada" component={RedeCredenciada} />
    </Tab.Navigator>
  );
}
