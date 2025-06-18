import { StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
  },
  lottie: {
    width: 400,
    height: 400,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.textColor,
  },
  countdown: {
    fontSize: 16,
    marginBottom: 15,
    color: theme.textColor,
  },
});
