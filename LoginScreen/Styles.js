import { StyleSheet, Platform } from 'react-native';
import { getFontSize, getFontFamily } from '../../context/scaling';

export const getStyles = (theme) =>
  StyleSheet.create({
    loginsearchBar: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logininput: {
      width: '100%',
      height: 50,
      marginVertical: 1,
      backgroundColor: theme.inputBackground || '#fff',
      fontSize: getFontSize(16),
      fontFamily: getFontFamily('regular'),
      color: theme.textColor,
      paddingHorizontal: 1,
    },
    loginnavBar: {
      backgroundColor: theme.primaryColor || '#007AFF',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginVertical: 20,
      width: '100%',
      alignItems: 'center',
    },
    loginnavItem: {
      color: theme.buttonTextColor || '#fff',
      fontSize: getFontSize(18),
      fontFamily: getFontFamily('bold'),
      fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
      textAlign: 'center',
    },
    loginTexto: {
      color: theme.linkColor || '#007AFF',
      fontSize: getFontSize(14),
      fontFamily: getFontFamily('regular'),
      marginVertical: 10,
      textDecorationLine: 'underline',
      textAlign: 'center',
    },
    modalContainer: {
      backgroundColor: theme.modalBackground || '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
      alignSelf: 'center',
    },
    modalText: {
      color: theme.textColor || '#000',
      fontSize: getFontSize(16),
      fontFamily: getFontFamily('regular'),
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: theme.primaryColor || '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginVertical: 5,
      width: '50%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: theme.buttonTextColor || '#fff',
      fontSize: getFontSize(16),
      fontFamily: getFontFamily('medium'),
      fontWeight: Platform.OS === 'ios' ? '500' : '500',
      textAlign: 'center',
    },
  });