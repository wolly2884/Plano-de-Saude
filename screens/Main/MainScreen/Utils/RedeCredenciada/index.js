import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import { styles } from './styles';
import { searchPlacesAPI } from '../../../../../api/api_rede_credenciada'; // Importando a função da API
import Rodape  from '../../../../../components/Rodape'

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Não foi permitido o acesso ao GPS');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
    })();
  }, []);

  const searchPlaces = async () => {
    try {
      if (!location) {
        console.error('Localização não encontrada');
        return;
      }

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const parsedPlaces = await searchPlacesAPI(latitude, longitude, searchQuery);
      setPlaces(parsedPlaces);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
    }
  };

  let latitude = null;
  let longitude = null;

  if (location) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.RCsearchContainer, { top: 1 }]}>
        <TextInput
          style={{ borderWidth: 1, width: '80%', height: '100%', borderColor: '#666', color: 'white' }}
          placeholder="  Digite aqui o local..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Pesquisa" onPress={searchPlaces} />
      </View>

      {latitude && longitude && (
        <MapView
          style={styles.RCmapf}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {places.map(place => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              onPress={() => {
                console.log(`Lugar selecionado ${place.name}`);
              }}
            >
              <Callout>
                <Text>{place.name}</Text>
                <Text>Endereço : {place.vicinity}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {!location && <Text style={styles.RCbusca}>{errorMsg ? errorMsg : 'Buscando...'}</Text>}
      <Rodape />
    </View>
  );
}
