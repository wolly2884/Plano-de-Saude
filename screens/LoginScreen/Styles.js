import { StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const getStyles = (theme) => StyleSheet.create({
    // Login
  loginsearchBar: {
    backgroundColor: theme.backgroundColor,
    padding: 10,
  },
  logininput: {
    backgroundColor: '#ceeaf2',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginnavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0d729c',
    paddingVertical: 10,
    marginTop: 20,
  },
  loginnavItem: {
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  loginTexto:{
    textAlign: 'center',
    color: theme.textColor,
  },
   container: {
    flex: 1,
    backgroundColor: '#666',
  },
  footerPortal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
  },
});