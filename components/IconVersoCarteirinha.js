import React from 'react';
import Svg, { Rect } from 'react-native-svg';

const IconVersoCarteirinha = ({ width = 44, height = 48 }) => (
  <Svg width={width} height={height} viewBox="0 0 64 48">
    <Rect x="2" y="6" width="60" height="36" rx="4" ry="4" fill="#00d1d1" stroke="#007a7a" strokeWidth="2" />
    <Rect x="6" y="10" width="52" height="6" fill="#333" />
    <Rect x="10" y="22" width="40" height="3" rx="1" fill="white" />
    <Rect x="10" y="28" width="30" height="3" rx="1" fill="white" />
    <Rect x="48" y="30" width="10" height="10" fill="white" />
    <Rect x="50" y="32" width="2" height="2" fill="#00d1d1" />
    <Rect x="54" y="32" width="2" height="2" fill="#00d1d1" />
    <Rect x="50" y="36" width="2" height="2" fill="#00d1d1" />
    <Rect x="54" y="36" width="2" height="2" fill="#00d1d1" />
  </Svg>
);

export default IconVersoCarteirinha;
