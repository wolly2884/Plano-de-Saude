import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      fontStyle: 'italic',
      marginVertical: 10,
      color: theme.textColor,
    },
    dateSection: {
      width: '100%',
      paddingHorizontal: 0,
    },
  });
