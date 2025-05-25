import Svg, { Rect, Circle } from 'react-native-svg';

const IconCarteirinha = ({ width = 44, height = 48 }) => (
  <Svg width={width} height={height} viewBox="0 0 64 48">
    <Rect x="2" y="6" width="60" height="36" rx="4" ry="4" fill="#00d1d1" stroke="#007a7a" strokeWidth="2" />
    <Circle cx="14" cy="24" r="6" fill="white" />
    <Rect x="26" y="16" width="28" height="4" rx="1" fill="white" />
    <Rect x="26" y="24" width="20" height="4" rx="1" fill="white" />
    <Rect x="26" y="32" width="24" height="4" rx="1" fill="white" />
  </Svg>
);

export default IconCarteirinha;
