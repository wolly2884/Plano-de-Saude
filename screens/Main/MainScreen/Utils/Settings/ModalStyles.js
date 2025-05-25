export const getStyles = (theme = {}) => ({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor || '#fff',
    },
    section_text: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.inputTextColor,
      marginBottom: 10,
    },
    textPrice: {
      fontSize: 16,
      color: theme.inputTextColor,
      marginVertical: 8,
    },
    Scrollcontainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor || '#fff',
      padding: 16,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
  });
  