import { StyleSheet, Dimensions } from 'react-native';

const cardWidth = Dimensions.get('window').width * 0.85;

export const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.backgroundColor, padding: 20, alignItems: 'center' },
  filterRow: { flexDirection: 'column', width: '100%', marginBottom: 20, marginTop: 10 },
  beneficiaryRow: { flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: 20 },
  buttonContainer: { flex: 1, padding: 5 },
  searchButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 15, backgroundColor: '#fff', width: '100%' },
  searchButtonText: { color: '#333', fontSize: 14, fontWeight: 'bold', marginRight: 5  },
  balanceLabel: { color: theme.textColor, fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  balanceAmount: { color: theme.textColor, fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  cardContainer: { width: '100%', height: 150, overflow: 'hidden', alignItems: 'center' },
  card: { width: cardWidth / 1.02, height: 140, backgroundColor: '#6c5ce7', borderRadius: 15, padding: 15 },
  cardText: { color: '#fff', fontSize: 16 },
  cardAmount: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginVertical: 5 },
  cardInfo: { color: '#fff', fontSize: 12 },
  indicatorContainer: { flexDirection: 'row', marginTop: 10, alignSelf: 'center' },
  indicator: { width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'gray', marginHorizontal: 10, alignSelf: 'center' },
  activeIndicator: { backgroundColor: '#333' },
  actions: { flexDirection: 'row', marginTop: 20, marginBottom: 100, alignSelf: 'center' },
  actionButton: { alignItems: 'center', marginHorizontal: 20 },
  actionText: { color: '#333', marginTop: 5, fontSize: 14 },
  noCards: { color: '#333', textAlign: 'center', marginTop: 60 },
  errorMessage: { fontSize: 12, color: 'red', marginTop: 5 },
  inputContainer: { borderColor: theme.buttonTextColor, borderWidth: 0, borderRadius: 8, backgroundColor: theme.backgroundColor, paddingHorizontal: 1, marginBottom: 1, flexDirection: 'row', alignItems: 'center', width: '100%' },
});