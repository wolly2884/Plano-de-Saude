import { StyleSheet } from 'react-native';

export const getStyles = (theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
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
      color: theme.errorMessagem,
      textAlign: 'center',
    },
    timelineContainer: {
      flex: 1,
      backgroundColor: theme.inputBackground,
      padding: 10,
      marginTop: 10,
    },
    calendarBackground: {
      backgroundColor: theme.inputBackground,
    },
    calendarText: {
      color: theme.textColor,
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
  };
};