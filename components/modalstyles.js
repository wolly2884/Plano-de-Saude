// src/screens/Cadastro/Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
    },
  buttonText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    bottom: 0,
    top: 10,
    textAlign: 'center',
    fontSize: 11,
    color: theme.textColor
  },
  button: {
    borderWidth: 2,
    width: 125,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: theme.textColor //"white",
    //backgroundColor: '#ceeaf2'
  },  
  image: {
    width: 75,
    height: 65,
    top: 8,
  },
});
