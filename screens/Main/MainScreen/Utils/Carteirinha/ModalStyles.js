import { StyleSheet, Dimensions } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  theme.cardbackground,
    justifyContent: 'center',
  },
  
  content: {
    flex: 1,
  },
  CVgradient: {
    width: '80%',
    height: '70%',
    borderWidth: 2,
    borderRadius: 30,
    alignSelf: 'center',
  },
  CVsafeArea: {
    flex: 1,
  },
  CVtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    transform: [{ rotate: '90deg' }],
    bottom: 0,
    left: 100,
    top: 70,
    padding: 10,
  },
  CVimage: {
    width: 120,
    height: 30,
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    bottom: 70,
    left: 200,
    top: 400
  },
  Textstyle:{
    top: 15, 
    left: 10, 
    color: theme.textColor
  }

  });