import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const Rodape = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
      <View style={styles.footer}>
        <Text style={styles.footerText} accessibilityLabel="Footer copyright">
          © 2025 Portal do Beneficiário
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Rodape;

export const getStyles = (theme) =>
  StyleSheet.create({
    footerContainer: {
      backgroundColor: theme.backgroundColor
    },

    footer: {
      borderWidth: 1,
      borderTopColor: theme.textColor,
      padding: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundColor,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },

    footerText: {
      fontSize: 14,
      color: theme.textColor
    },
  });
