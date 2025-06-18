import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native'; // Import Easing
import Svg, { Path, Circle, Line, Text } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LogoIntro = ({ width = 290, height = 130, fill }) => {
  const { theme } = useTheme();
  const fillColor = fill || theme.fillColor;

  const strokeWidthAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Define a animação de ida (1 para 10)
    const animateTo10 = Animated.timing(strokeWidthAnim, {
      toValue: 15,
      duration: 500,
      easing: Easing.linear, // Pode ajustar a função de easing
      useNativeDriver: false,
    });

    // Define a animação de volta (10 para 1)
    const animateTo1 = Animated.timing(strokeWidthAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear, // Pode ajustar a função de easing
      useNativeDriver: false,
    });

    // Cria uma sequência: 1->10, depois 10->1
    const sequenceAnimation = Animated.sequence([
      animateTo10,
      animateTo1,
    ]);

    // Loop infinito da sequência
    const loopAnimation = Animated.loop(sequenceAnimation);

    loopAnimation.start();

    return () => {
      loopAnimation.stop();
      strokeWidthAnim.setValue(1); // Garante que volta ao estado inicial
    };
  }, [strokeWidthAnim]); // Adiciona strokeWidthAnim às dependências

  return (
    <Svg width={width} height={height} viewBox="0 0 450 100">
      <AnimatedPath
        d="M50,60 C50,45 80,35 80,60 C70,75 60,90 50,90 C50,90 30,75 30,60 C30,45 50,45 50,60Z"
        fill="none"
        stroke="#00d1d1"
        strokeWidth={strokeWidthAnim} // Passa o Animated.Value diretamente
      />

      <Circle cx="65" cy="85" r="10" fill="white" stroke="#00d1d1" strokeWidth={3} />
      <Line x1="65" y1="79" x2="65" y2="91" stroke="#ff2e2e" strokeWidth={2.5} />
      <Line x1="59" y1="85" x2="71" y2="85" stroke="#ff2e2e" strokeWidth={2.5} />

      <Text
        x="100"
        y="75"
        fill="#00d1d1"
        fontSize="40"
        fontWeight="bold"
        fontStyle="italic"
        fontFamily="Arial"
      >
        Plano Fácil
      </Text>

      <Text
        x="100"
        y="100"
        fill={theme.textColor || "#000"}
        fontSize="26"
        fontFamily="Brush Script MT"
      >
        App Mobile
      </Text>
    </Svg>
  );
};

export default LogoIntro;