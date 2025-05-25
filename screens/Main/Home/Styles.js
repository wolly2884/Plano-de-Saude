// src/screens/MainScreen/Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    navcontainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    navcontent: {
      flex: 1,
      justifyContent: 'center',
    },
    homenavBar: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      top: 1,
    },
    navRow: {
      alignItems: 'center',
      marginBottom: 0,
    },
    welcomeText: {
      color: theme.textColor,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
  });