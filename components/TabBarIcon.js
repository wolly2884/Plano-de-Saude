import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TabBarIcon = ({ focused, name, color }) => {
  // Valor animado para scale (igual antes)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Valor animado para rotação (só para settings)
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Anima scale normal
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    // Se for Settings e estiver focado, dispara rotação 360 graus
    if (name === 'Settings' && focused) {
      rotateAnim.setValue(0); // reseta o valor antes
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  // Interpolação para graus de rotação
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          name === 'Settings' ? { rotate } : { rotate: '0deg' },
        ],
      }}
    >
      <Icon name={iconName} size={24} color={color} />
    </Animated.View>
  );
};

export default TabBarIcon;
