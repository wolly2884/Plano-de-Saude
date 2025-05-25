import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  CVcontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  CVgradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  CVsafeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CVtitle: {
    fontSize: wp('6%'),
    color: 'white',
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  CVimage: {
    width: wp('40%'),
    height: hp('10%'),
    marginBottom: hp('2%'),
  },
  textContainer: {
    position: 'absolute',
    right: wp('5%'),
    height: '100%',
    justifyContent: 'center',
  },
  rotatedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('4%'),
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    right: 0,
  },
  versoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('10%'),
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  versoIcon: {
    width: wp('8%'),
    height: wp('8%'),
  },
  versoText: {
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
    color: '#000',
  },
});