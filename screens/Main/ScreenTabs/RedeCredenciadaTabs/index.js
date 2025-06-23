import React, { use, useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import MapaEmbed from '../../../../components/WebMaps'; // Importe corretamente

export default function App() {
  const [location, setLocation] = useState(null);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);

  const montarConsultaOverpass = (latitude, longitude, radius = 3000) => {
    return `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["amenity"="unimed"](around:${radius},${latitude},${longitude});
        node["amenity"="hospitalar"](around:${radius},${latitude},${longitude});
        node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        node["amenity"="doctors"](around:${radius},${latitude},${longitude});
        node["amenity"="healthcare"](around:${radius},${latitude},${longitude});
      );
      out center;
    `;
  };

  const buscarLocais = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada');
        setLoading(false);
        return;
      }

      const local = await Location.getCurrentPositionAsync({});
      setLocation(local.coords);

      const query = montarConsultaOverpass(local.coords.latitude, local.coords.longitude, 13000);

      const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const locaisEncontrados = response.data.elements.map((el) => ({
        lat: el.lat,
        lng: el.lon,
        label: el.tags?.name || 'Local de saúde',
      }));

      // Adiciona também a localização do usuário como marcador azul
      locaisEncontrados.unshift({
        lat: local.coords.latitude,
        lng: local.coords.longitude,
        label: 'Você está aqui',
      });

      setLocais(locaisEncontrados);
    } catch (e) {
      Alert.alert('Erro ao buscar locais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarLocais();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />}

      {locais.length > 0 ? (
        <MapaEmbed locais={locais} />
      ) : (
        <Text style={styles.infoText}>Busque sua localização para exibir o mapa.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoText: { textAlign: 'center', marginTop: 20 },
  botaoBusca: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});
