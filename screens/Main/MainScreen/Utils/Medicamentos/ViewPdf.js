import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import WebView from 'react-native-webview';
import axios from 'axios';

const App = ({ route }) => {
  const webViewRef = useRef(null);
  const [productUrl, setProductUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safely access med.value with fallback
  const med = route?.params?.med?.value;
  const medicamento = med ? med.trim().split(' ')[0] : '';

  // Fetch product data using axios
  useEffect(() => {
    if (!medicamento) {
      Alert.alert('Error', 'No valid medication name provided.');
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://www.sara.com.br/api/products/search`,
          {
            params: {
              q: medicamento,
              limit: 3,
            },
          }
        );

        const data = response.data;
       
        // Validate response data
        if (data?.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0]?.url) {
          const url = `https://www.sara.com.br/produto/${data.data[0].url}`;
          setProductUrl(url);
        } else {
          Alert.alert('Error', 'No product URL found for the provided medication.');
        }
      } catch (error) {
        console.error('Axios error:', error.message, error.response?.data);
        Alert.alert('Error', 'Failed to fetch product data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [medicamento]);

  // Handle WebView back navigation
  const goBack = () => {
    if (webViewRef.current) {
      webViewRef.current.canGoBack
        ? webViewRef.current.goBack()
        : Alert.alert('Info', 'No previous page to go back to.');
    }
  };

  // Render loading state or error if no medicamento
  if (!medicamento) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
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