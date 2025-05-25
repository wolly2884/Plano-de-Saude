import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import {  View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import {styles } from './styles'
import { searchPlacesAPI } from '../../../../api/api_rede_credenciada'; // Importando a função da API

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar negada');
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

      const parsedPlaces = await searchPlacesAPI(latitude, longitude, 'hospital');
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
    <View style={{width: '100%', height: '103%'}}>
      {latitude && longitude && (
        <MapView 
          style={styles.RCmap}
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
                console.log(`Lugar seleciondo ${place.name}`);
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
      
      <View style={[styles.RCsearchContainer,{top: 85, right: 90}]}>
        <TouchableOpacity onPress={searchPlaces}>
        <Text style={styles.RCTexto}>Buscar Hopitais</Text>
        </TouchableOpacity>
      </View>
      {!location && <Text>{errorMsg ? errorMsg : 'Buscando...'}</Text>}
    </View>
  );
}