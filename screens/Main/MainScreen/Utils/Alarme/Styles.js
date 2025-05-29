import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../../context/ThemeContext';

export const getStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isNightMode ? '#121212' : '#757575',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.isNightMode ? '#121212' : '#ffffff',
    },
    emptyDate: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.backgroundColor,
    },
    emptyText: {
      fontSize: 18,
      color: theme.errorMessage,
      textAlign: 'center',
    },
    timelineContainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 10,
      marginTop: 10,
    },
    calendarBackground: {
      backgroundColor: theme.backgroundColor,
    },
    calendarText: {
      color: theme.isNightMode ?  '#ffffff' : '#121212',
    },
    calendarSelectedColor: {
      backgroundColor: theme.tabBarActiveTextColor,
    },
    calendarDotColor: {
      backgroundColor: theme.tabBarActiveTextColor,
    },
    timelineTimeStyle: {
      textAlign: 'center',
      backgroundColor: theme.buttonBackground,
      color: theme.buttonTextColor,
      padding: 5,
      borderRadius: 13,
    },
    timelineLineColor: {
      backgroundColor: theme.tabBarActiveTextColor,
    },
    timelineCircleColor: {
      backgroundColor: theme.tabBarActiveTextColor,
    },
    ActivityIndicator : { textAlign: 'center', 
      color: theme.isNightMode ?  '#ffffff' : '#121212', 
    },
  });
};
