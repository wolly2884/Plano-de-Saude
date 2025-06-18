import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const getStyles = (theme) => {
  return {
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor:  theme.backgroundColor,
  },
  sidebar: {
    flex: 2,
    flexDirection: 'column',
    padding: 5,
    height: '100%',
    width: '20%',
    left: 5
  },
  filterContainer: {
    backgroundColor: theme.modalBackground,
    padding: 1,
    borderRadius: 8,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    top: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.textColor,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.buttonText,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: theme.errorMessagem,
    fontSize: 14,
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 16,
    backgroundColor: theme.cardbackground,
    borderRadius: 8,
    padding: 16,
  },
  resultItem: {
    backgroundColor: theme.modalBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textColor,
  },
  resultAddress: {
    fontSize: 14,
    color: '#2563EB',
  },
  resultPhone: {
    fontSize: 14,
    color: '#4B5563',
  },
  resultSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  mapContainer: {
    flex: 2,
    padding: 8,
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  noMapText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 20,
  },
  };
};
