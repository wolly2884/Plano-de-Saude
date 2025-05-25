// src/screens/Senha/Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    Senhacontainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 20,
    },
    content: {
      flex: 1,
      width: '100%'
    },
    Senhainput: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: theme.placeholderColor,
      backgroundColor: theme.inputBackground,
      color: theme.inputTextColor,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 16,
    },
    Senhabutton: {
      width: '100%',
      height: 50,
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonDisabled: {
      backgroundColor: theme.placeholderColor,
      opacity: 0.6,
    },
    SenhabuttonText: {
      color: theme.buttonTextColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
    SenharegisterLink: {
      color: theme.linkColor,
      fontSize: 16,
      textDecorationLine: 'underline',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
    },
    loadingText: {
      color: theme.textColor,
      fontSize: 16,
      marginTop: 10,
    },
  });