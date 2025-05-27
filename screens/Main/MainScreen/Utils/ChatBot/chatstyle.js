// styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor || '#FFFFFF', // Default to white for light theme
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Ensure content isn't hidden by Rodape
  },
  section: {
    marginBottom: 16,
  },
  dropdown: {
    borderColor: theme.borderColor || '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.inputBackground || '#F5F5F5',
  },
  dropdownError: {
    borderColor: theme.errorColor || '#FF0000',
    borderWidth: 2,
  },
  dropdownText: {
    color: theme.textColor || '#333333',
    fontSize: 16,
  },
  dropdownPlaceholder: {
    color: theme.placeholderColor || '#999999',
    fontSize: 16,
  },
  dropdownStyles: {
    backgroundColor: theme.inputBackground || '#F5F5F5',
    borderColor: theme.borderColor || '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputContainer: {
    borderColor: theme.borderColor || '#CCCCCC',
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: theme.inputBackground || '#F5F5F5',
    
  },
  errorMessage: {
    color: theme.errorColor || '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: theme.buttonBackground || '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.buttonTextColor || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileButton: {
    backgroundColor: theme.buttonBackground || '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fileButtonText: {
    color: theme.buttonTextColor || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    color: theme.textColor || '#333333',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
  },
});