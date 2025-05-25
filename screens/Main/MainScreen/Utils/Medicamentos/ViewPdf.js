import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import WebView from 'react-native-webview';

const App = ({ route }) => {
  const webViewRef = useRef(null);
  const [productUrl, setProductUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safely access med.value with fallback
  const med = route?.params?.med?.value;
  const medicamento = med ? med.trim().split(' ')[0] : '';

  // Fetch product data and set product URL
  useEffect(() => {
    if (!medicamento) {
      Alert.alert('Error', 'No valid medication name provided.');
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `http://www.sara.com.br/api/products/search?q=${encodeURIComponent(medicamento)}&limit=3`
        );
        const data = await response.json();

        if (data && data[0]?.url) {
          // Construct the product URL from the first item's URL
          const url = `https://www.sara.com.br/produto/${data[0].url}`;
          setProductUrl(url);
          // Show alert with the URL
          Alert.alert('Product URL', url);
        } else {
          // Show alert with the URL
          Alert.alert('Product URL', url);
        }
      } catch (error) {
        Alert.alert('Error', `https://www.sara.com.br/api/products/search?q=${encodeURIComponent(medicamento)}&limit=3`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [medicamento]);

  // Handle WebView back navigation
  const goBack = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  // Render loading state or error if no medicamento
  if (!medicamento) {
    return null; // Or render a fallback UI
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          <Button title="Go Back" onPress={goBack} />
          {productUrl ? (
            <WebView
              ref={webViewRef}
              source={{ uri: productUrl }}
              style={styles.webview}
              startInLoadingState={true}
              renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
              onError={() => Alert.alert('Error', 'Failed to load product page.')}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;