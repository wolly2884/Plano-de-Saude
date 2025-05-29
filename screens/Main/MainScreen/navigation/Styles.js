import { StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    height: '24%',
    marginLeft: 20,
    marginRight: 20,
  },
  image: {
    width: hp('9%'), // 15% of screen height
    height: hp('9%'), // 15% of screen height
    borderRadius: 200,
    alignSelf: 'center',
    left: hp('1%'),
    top: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: hp('2%'),
    alignItems: 'flex-start',
    top: hp('2%'),
    width: '50%',
    justifyContent: 'space-around',
  },
  buttonsContainer: {
    borderRadius: 1,
    flexDirection: 'row',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: hp('10%'),
    position: 'relative',
  },
  cartaoinfo: { 
    borderTopStartRadius: 10, 
    borderTopEndRadius: 10, 
    width: '100%', 
    height: hp('21%'), 
    borderWidth: 0 
  },
  button1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderBottomLeftRadius: 10,
    marginLeft: hp('-1%'),
    width: '50.4%',
    height: '58%',
    top: hp('4.5%'), 
    left: hp('1%'),
    backgroundColor: '#D3D3D3',

  },
  button2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomRightRadius: 10,
    marginRight: hp('4%'),
    width: '50.4%',
    height: '58%',
    top: hp('4.5%'), 
    left: hp('0.6%'),
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    width: 135
  },
  centro: {
    width: '100%',
    height: '55%',
    left: 0 ,
    bottom: -20,
    right:0,
    position: 'absolute',
    backgroundColor: 'black' //theme.cardbackground,
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
    fontSize: hp('2.2%'), 
    fontStyle: 'italic', 
    fontWeight: 'bold', 
    color: 'black' 
  },
  TextoBenef:{
    fontSize: hp('1.5%'), 
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
    height: '24%',
    width: '97%',
    borderRadius: 10,
    right: 10,
    backgroundColor: 'white'
  },

});