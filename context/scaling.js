// src/utils/scaling.js
import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Guideline sizes based on iPhone 11 (414x896)
const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

// Scale factor based on screen width
const scale = (size) => (width / guidelineBaseWidth) * size;

// Scale vertical dimensions based on height
const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// Responsive font size
const responsiveFontSize = (fontSize) => {
  const scaledSize = scale(fontSize);
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Detect if the device is a tablet
const isTablet = () => {
  const aspectRatio = width / height;
  return Math.min(width, height) >= 600 || (aspectRatio > 1.2 && width >= 800);
};

// Get font size with platform and device adjustments
const getFontSize = (baseSize) => {
  const tabletMultiplier = isTablet() ? 1.3 : 1; // 30% larger on tablets
  const platformAdjustment = Platform.OS === 'ios' ? 1.1 : 1; // 10% larger on iOS
  const scaledSize = responsiveFontSize(baseSize * tabletMultiplier * platformAdjustment);
  return Math.min(scaledSize, baseSize * 1.5); // Cap at 1.5x base size
};

// Get scaled dimension for width/height
const getScaledDimension = (baseSize) => {
  const tabletMultiplier = isTablet() ? 1.4 : 1; // 40% larger on tablets
  return Math.round(scale(baseSize * tabletMultiplier));
};

// Default font family per platform
const getFontFamily = (weight = 'regular') => {
  const fontMap = {
    ios: {
      regular: 'System',
      bold: 'System',
      medium: 'System',
    },
    android: {
      regular: 'Roboto',
      bold: 'Roboto-Bold',
      medium: 'Roboto-Medium',
    },
  };
  return fontMap[Platform.OS][weight] || fontMap[Platform.OS].regular;
};

export { getFontSize, getFontFamily, getScaledDimension, isTablet, scale, verticalScale };