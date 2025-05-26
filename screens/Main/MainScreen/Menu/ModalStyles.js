// styles.js
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext'; // 👈 Integração com ThemeContext
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Aqui você pode definir suas cores
export const cores = {
  roxo: '#6a5acd',
  claro: '#ffffff',
  laranja: '#ffa500',
};

export const getTabStyle = () => {
  const { theme, isThemeLoaded } = useTheme();

  return {
    inicontainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
    },
    tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#000',
    tabBarActiveBackgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };
};

export const getStyles = (theme) =>
  StyleSheet.create({
  tabBarOptions: {
    activeTintColor: cores.roxo,
    inactiveTintColor: cores.claro,
    activeBackgroundColor: cores.roxo,
    inactiveBackgroundColor: cores.laranja,
    labelStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlignVertical: 'center',
    height: '95%',
    width: '100%',
    backgroundColor: cores.laranja,
    },
    style: {
      width: '100%',
      height: 70,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    keyboardHidesTabBar: true,
    tabStyle: {
      display: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 25,
    padding: 10,
    left: 10,
    top: 20
  },
  image: {
    width: 75,
    height: 65,
    top: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    bottom: 0,
    top: 10,
    textAlign: 'center',
    fontSize: 11
  },
    container: {
    flex: 1,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: theme.menubackground, //'white'
  },
  rowContainerchat: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
    rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: hp('2%'), // Use hp for responsive height
  },
   rowContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: hp('6%'), // Use hp for responsive height
  },
  button: {
    borderWidth: 2,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: "white",
    backgroundColor: '#ceeaf2'
  },
  content: {
    padding: 20,
  },
  section_text: {
    fontSize: 20,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  inicontainer: {
    flex: 1, 
    backgroundColor: theme.cardbackground, 
  },
  textPrice: {
    fontSize: 16,
    marginVertical: 5,
  },
    // Add tab bar styles
    tabBarActiveTintColor: {
      color: theme.cardbackground,  // Example: white for dark theme, black for light theme
    },
    tabBarActiveBackgroundColor: {
      backgroundColor: theme.cardbackground,  // Example: white for dark theme, black for light theme
    },
    tabBarStyle: {
            height: wp('25%'), // Use wp for responsive width
            top: hp('-4%'), // Use hp for responsive height
            backgroundColor: theme.menubackground, //'white'
          },
  tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            fontStyle: 'italic',
            bottom: 1,
          },
});
