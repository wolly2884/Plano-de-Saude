import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.backgroundColor,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerText: {
      fontSize: 14,
      color: theme.textColor,
    },
  });