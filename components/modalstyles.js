// src/screens/Cadastro/Styles.js
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    top: hp('1%'), // 2% of screen height
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: hp('1.2%'), // 3% of screen height
    color: theme.textColor
  },
  button: {
    borderWidth: 2,
    width: hp('14%'), // 15% of screen height
    height: hp('12.5%'), // 15% of screen height
    justifyContent: 'center',
    margin: -1,
    borderRadius: 10,
    alignItems: 'center',
    bottom: hp('1%'), // 2% of screen height
    borderColor: theme.textColor //"white",
    //backgroundColor: '#ceeaf2'
  },  
  image: {
    width: hp('12%'), // 15% of screen height
    height: hp('9%'), // 15% of screen height
    top: 8,
  },
});
