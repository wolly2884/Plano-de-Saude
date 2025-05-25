import React from 'react';
import Svg, { Path, Circle, Line, Text } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext'; // ajuste o caminho conforme seu projeto

const LogoIntro = ({ width = 290, height = 130, fill }) => {
  const { theme } = useTheme();
  const fillColor = fill || theme.fillColor;

  return (
    <Svg width={width} height={height} viewBox="0 0 450 130">
      {/* Coração arredondado */}
      <Path
        d="M50,60
           C50,45 70,45 70,60
           C70,75 50,90 50,90
           C50,90 30,75 30,60
           C30,45 50,45 50,60Z"
        fill="none"
        stroke="#00d1d1"
        strokeWidth={4}
      />

      {/* Círculo com + */}
      <Circle cx="65" cy="85" r="10" fill="white" stroke="#00d1d1" strokeWidth={3} />
      <Line   x1="65" y1="79" x2="65" y2="91" stroke="#ff2e2e" strokeWidth={2.5} />
      <Line   x1="59" y1="85" x2="71" y2="85" stroke="#ff2e2e" strokeWidth={2.5} />

      {/* Texto Plano Fácil */}
      <Text
        x="100"
        y="65"
        fill="#00d1d1"
        fontSize="30"
        fontWeight="bold"
        fontStyle="italic"
        fontFamily="Arial"
      >
        Plano Fácil
      </Text>

      {/* Texto App Mobile */}
      <Text
        x="100"
        y="100"
        fill= 'white'
        fontSize="26"
        fontFamily="Brush Script MT"
      >
        App Mobile
      </Text>
    </Svg>
  );
};

export default React.memo(LogoIntro);
