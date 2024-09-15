import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { View } from 'react-native';


//import Experiencia from './src/pages/Experiencia/app';
import Home from './Home';
import Atendimento from './Atendimento';
import Financeiro from './Financeiro';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, name, color }) => {
  let iconName;

  if (name === 'Home') {
    iconName = focused ? 'person' : 'person-outline';
  } else if (name === 'Atendimento') {
    iconName = focused ? 'chatbubble-ellipses-sharp' : 'chatbubble-ellipses-outline';
  } else if (name === 'Financeiro') {
    iconName = focused ? 'wallet-sharp' : 'wallet-outline';
  } else if (name === 'Settings') {
    iconName = focused ? 'settings' : 'settings-outline';
  }

  return <Icon name={iconName} size={24} color={color} />;
};

const App = () => {
  return (
    <View style={{flex: 1}}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon focused={focused} name={route.name} color={color} />
        ),
        tabBarLabelStyle:{
          fontSize: 16, // Defina o tamanho da fonte aqui
          fontWeight: 'bold', // Opcional, adicione caso queira negrito
          fontStyle: 'italic',
          bottom: 10,
        },
        tabBarStyle: {
          height: 70,
          top: -20,
        },
        tabBarActiveTintColor: 'red',
        tabBarActiveBackgroundColor: "rgba(0, 0, 0, 0.1)",
        swipeEnabled: false,
        headerMode: 'float',
      })}
      
    >
      <Tab.Screen name="Home" options={{headerShown: false }}>
        {props => <Home {...props}  navigation={props.navigation} />}
      </Tab.Screen>

      <Tab.Screen name="Atendimento"  options={{ headerShown: false }}>
        {props => <Atendimento {...props}  navigation={props.navigation} />}
      </Tab.Screen>

      <Tab.Screen name="Financeiro"  options={{ headerShown: false }}>
        {props => <Financeiro {...props}  navigation={props.navigation} />}
      </Tab.Screen>

      <Tab.Screen name="Settings"  options={{ headerShown: false }}>
        {props => <Settings {...props}  navigation={props.navigation} />}
      </Tab.Screen>
      
    </Tab.Navigator>
    </View>
  );
};

export default App;