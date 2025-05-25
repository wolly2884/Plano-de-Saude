import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import dateUtils from '../../../../../api/functions';

// Simulando a importação do JSON
const faturaData = require('./fatura.json');

const App = () => {
  // Get month names and current month
  const monthNames = dateUtils.getMonthNamesShort(); // e.g., ["Jan", "Feb", ...]
  const currentMonthName = monthNames[new Date().getMonth()]; // e.g., "May" for May 2025

  // State management
  const [faturas, setFaturas] = useState([]);
  const [meses, setMeses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedFatura, setSelectedFatura] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Set months and invoices from JSON
        setMeses(monthNames);
        setFaturas(faturaData.faturas);
        // Set initial invoice for current month
        const initialFatura = faturaData.faturas.find(f => f.mes === currentMonthName);
        setSelectedFatura(initialFatura || null);
      } catch (error) {
        console.error('Erro ao carregar faturas:', error);
        setFaturas([]);
        setMeses([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle month selection
  const handleMonthPress = (mes) => {
    setSelectedMonth(mes);
    const fatura = faturas.find(f => f.mes === mes);
    setSelectedFatura(fatura || null);
  };

  // Render month item for FlatList
  const renderMonth = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMonthPress(item)}
      accessibilityLabel={`Selecionar mês ${item}`}
      accessibilityRole="button"
    >
      <Text style={item === selectedMonth ? styles.selectedMonth : styles.month}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.status}>Carregando...</Text>
      </View>
    );
  }

  // Empty state for no months or invoices
  if (!meses.length || !faturas.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.status}>Nenhuma fatura disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with card information */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          FINAL {selectedFatura ? selectedFatura.cartao.final : '----'}
        </Text>
        <Text style={styles.headerText}>
          {selectedFatura ? selectedFatura.cartao.bandeira : '----'}
        </Text>
      </View>

      {/* Horizontal list of months */}
      <FlatList
        data={meses}
        renderItem={renderMonth}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        style={styles.months}
      />

      {/* Invoice details */}
      {selectedFatura ? (
        <View style={styles.faturaContainer}>
          <Text style={styles.status}>{selectedFatura.status}</Text>
          <Text style={styles.valor}>R$ {selectedFatura.valor_total.toFixed(2)}</Text>
          <Text style={styles.vencimento}>Vence em {selectedFatura.vencimento}</Text>
          <Text style={styles.valorMinimo}>
            Pagamento mínimo: R$ {selectedFatura.valor_minimo.toFixed(2)}
          </Text>
        </View>
      ) : (
        <View style={styles.faturaContainer}>
          <Text style={styles.status}>Nenhuma fatura encontrada para {selectedMonth}</Text>
        </View>
      )}

      {/* Pay button (only shown if invoice exists) */}
      {selectedFatura && (
        <TouchableOpacity
          style={styles.button}
          accessibilityLabel="Pagar fatura"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Pagar fatura</Text>
        </TouchableOpacity>
      )}

      {/* Additional invoice details */}
      {selectedFatura && (
        <>
          <Text style={styles.detalhes}>{selectedFatura.detalhes}</Text>
          <Text style={styles.titular}>• {selectedFatura.titular}</Text>
          <Text style={styles.titular}>
            Nº Final do cartão: {selectedFatura.cartao.final}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  months: {
    marginBottom: 20,
  },
  month: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
  },
  selectedMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
  },
  faturaContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
  valor: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  vencimento: {
    fontSize: 16,
    color: '#666',
  },
  valorMinimo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detalhes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  titular: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
});

export default App;