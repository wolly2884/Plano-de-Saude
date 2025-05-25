import { StyleSheet, Dimensions } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  theme.cardbackground,
  },
  header: {
    paddingLeft: 5,
    flexDirection: 'row',
    width: '98%',
    height: '25%',
    marginLeft: 20,
    marginRight: 20,
  },
  image: {
    width: 75,
    height: 70,
    borderRadius: 200,
    alignSelf: 'center',
    left: 10,
    top: 15
  },
  userInfo: {
    marginLeft: 20,
    top: 15,
    justifyContent: 'space-around',
  },
  buttonsContainer: {
    borderRadius: 1,
    flexDirection: 'row',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 35,
    position: 'relative',
    
  },
  button1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderBottomLeftRadius: 10,
    marginLeft: -10,
    width: '50.4%',
    height: 45,
    top: 30, 
    left: 9,
    backgroundColor: '#D3D3D3',

  },
  button2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomRightRadius: 10,
    marginRight: 20,
    width: '50.4%',
    height: 45,
    top: 30, 
    left: 9,
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    width: 135
  },
  centro: {
    width: '100%',
    height: '56%',
    left: 0 ,
    bottom: -10,
    right:0,
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
  TextoCard:{ 
    fontSize: 20, 
    fontStyle: 'italic', 
    fontWeight: 'bold', 
    color: 'black' 
  },
  TextoBenef:{
    fontSize: 15, 
    fontStyle: 'italic', 
    color: 'black', 
    padding: 5
  },

  scrollView: {
    flexDirection: "row",
  },
  scrollPage: {
    flex: 1,     
  },
  screen: {
    height: '45%',
    width: '97%',
    borderRadius: 10,
    right: 10,
    backgroundColor: 'white'

  },

});