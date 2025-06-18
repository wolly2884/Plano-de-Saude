import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import logointro from '../../../../../components/logointro';

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const adjustedWidth = width ;
  const adjustedHeight = height;

  // Critério comum: se maior lado em pixels for maior que 900, é tablet
  return Math.max(adjustedWidth, adjustedHeight) >= 1000;
};

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
    width: '90%',
    height: '90%',
    borderWidth: 2,
    borderRadius: 30,
    alignSelf: 'center',
  },
  CVsafeArea: {
    flex: 1,
  },
  CVtitle: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    transform: [{ rotate: '90deg' }],
    bottom: 0,
    left: hp('11%'),
    top: hp('7%'),
    padding: hp('1%'),
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
  },
  imagebotton:  {
    width: (isTablet() ? hp('32%') : hp('5%')), // Ajuste para tablets 
    height: (isTablet() ? hp('32%') : hp('5%')), // Ajuste para tablets 
  },
  logointro: {
    width: hp('10%'),
    height: hp('10%'),
    position: 'absolute',
    bottom: hp('14%'), 
    right: wp('3%'),
    transform: [{ rotate: '90deg' }],
  },
  containerCard: {
    flex: 1, 
    alignItems: 'top', 
    justifyContent: 'top', 
    top: 320, 
    position: 'absolute'
  },
  tipcard: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    left:  (isTablet() ? hp('32%') : hp('15%')), // Ajuste para tablets
    bottom:  (isTablet() ? hp('0%') : hp('0%')), // Ajuste para tablets 
    top: (isTablet() ? hp('-4%') : hp('-18%')), // Ajuste para tablets
  },
  acomodation: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    top:  (isTablet() ? hp('-10%') : hp('-21.5%')), // Ajuste para tablets
    left: (isTablet() ? hp('22%') : hp('9%')), // Ajuste para tablets
               
  },
  healthPlan: {
    fontSize: hp('2%'),
    color: 'white',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('19%') : hp('6%')), // Ajuste para tablets
    top: (isTablet() ? hp('-13%') : hp('-24%')), // Ajuste para tablets                   
  },
  empresa: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('10%') : hp('0.5%')), // Ajuste para tablets  
    top: (isTablet() ? hp('-18%') : hp('-28.5%')), // Ajuste para tablets                     
  },
  username: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('7.8%') : hp('-2%')), // Ajuste para tablets  
    top: (isTablet() ? hp('-22.6%') : hp('-33%')), // Ajuste para tablets                      
  },
  validcard: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('21.9%') : hp('8%')), // Ajuste para tablets  
    top: (isTablet() ? hp('22.6%') : hp('18%')), // Ajuste para tablets                      
  },
  validinfo: {
    fontSize: hp('2.5%'),
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('19.4%') : hp('5.5%')), // Ajuste para tablets 
    top: (isTablet() ? hp('23.5%') : hp('19%')), // Ajuste para tablets                    
  },
  cardcns: {  
    fontSize: hp('1.5%'),
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('-13%') : hp('-10%')), // Ajuste para tablets 
    top: (isTablet() ? hp('29%') : hp('22%')), // Ajuste para tablets                   
  },
  cnsinfo: {
    fontSize: (isTablet() ? hp('5%') : hp('6%')), // Ajuste para tablets 
    color: 'white',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('-21%') : hp('-15%')), // Ajuste para tablets 
    top: (isTablet() ? hp('22%') : hp('17%')), // Ajuste para tablets                    
  },

  //Verso
  containerVerso: {
    width: (isTablet() ? hp('8%') : hp('7%')), // Ajuste para tablets  
    height: '100%', 
    backgroundColor: '#000', 
    left: (isTablet() ? hp('40%') : hp('28%')), // Ajuste para tablets  
  },
  faixaverso: {
    width: (isTablet() ? hp('8%') : hp('6%')), // Ajuste para tablets 
    height: '97%',
    backgroundColor: '#fff',
    left:(isTablet() ? hp('25%') : hp('18%')), // Ajuste para tablets  
    position: 'absolute',
    top: (isTablet() ? hp('2%') : hp('1%')) // Ajuste para tablets   
  },
  versoText: {
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('-8%') : hp('-14.5%')), // Ajuste para tablets  
    bottom: (isTablet() ? hp('1%') : hp('-0%')), // Ajuste para tablets  
    color: '#fff',
    position: 'absolute',
    top: 0,
    fontSize: (isTablet() ? hp('2%') : hp('1.5%')), // Ajuste para tablets  
  },
  versoText2: {
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('-23.5%') : hp('-30%')), // Ajuste para tablets 
    position: 'absolute',
    top: 0,
    bottom: (isTablet() ? hp('0%') : hp('-4%')), // Ajuste para tablets  
    color: '#fff',
    fontSize: (isTablet() ? hp('1.3%') : hp('1.5%')), // Ajuste para tablets  
  },
  versoText3: {
    transform: [{ rotate: '90deg' }],
    left: (isTablet() ? hp('-18%') : hp('-11.5%')), // Ajuste para tablets  
    bottom: (isTablet() ? hp('64%') : hp('62%')), // Ajuste para tablets  
    color: '#fff',
    fontSize: (isTablet() ? hp('2%') : hp('1.5%')), // Ajuste para tablets  
  },
  versoText4: {
    transform: [{ rotate: '90deg' }],
    left:(isTablet() ? hp('-21%') : hp('-14.4%')), // Ajuste para tablets  
    bottom: (isTablet() ? hp('43%') : hp('35%')), // Ajuste para tablets  
    color: '#fff',
    fontSize: (isTablet() ? hp('2%') : hp('1.5%')), // Ajuste para tablets  
  },
  bottonverso:{
    marginLeft: (isTablet() ? hp('2%') : hp('4%')), // Ajuste para tablets   
    top: (isTablet() ? hp('2%') : hp('1%')), // Ajuste para tablets   
    flexDirection: 'row'
  },
  logointroverso: {
    width: 50, 
    bottom: 120, 
    right: 40, 
    transform: [{ rotate: '90deg' }], 
    position: 'absolute' 
  }
  });