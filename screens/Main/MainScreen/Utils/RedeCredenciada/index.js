import React, { useState, useEffect } from 'react';
import { View, Text,  ScrollView, TouchableOpacity, Alert } from 'react-native';
import SelectLista from '../../../../../components/SelectList';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import api from '../../../../../api/api';
import { getStyles } from './styles';
import { useTheme } from '../../../../../context/ThemeContext';

export default function App() {
  const [endereco, setEndereco] = useState('');
  const [coordenadas, setCoordenadas] = useState(null);
  const [error, setError] = useState(null);
  const [selectEstado, setSelectEstado] = useState('');
  const [selectEspecialidade, setSelectEspecialidade] = useState([]);
  const [establishmentType, setEstablishmentType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [specialtiesByType, setSpecialtiesByType] = useState({
    diagnostic: [],
    hospital: [],
    clinic: [],
  });
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [neighborhood, setNeighborhood] = useState('');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const estados = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

  const establishmentTypes = [
    { value: 'diagnostic', label: 'Serviço de Diagnóstico/Exames' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinic', label: 'Clínica' },
  ];

  useEffect(() => {
    carregarEspecialidades();
    useCurrentLocation();
  }, []);

  const carregarEspecialidades = async () => {
    try {
      const userData = await api.get('/Especialidade');
      const rowCount = userData.data.rowCount;
      if (rowCount > 0) {
        setSelectEspecialidade(
          userData.data.rows.map((item) => ({
            label: item.ds_especialidade,
            ds_especialidade: item.ds_especialidade,
            id: item.id,
            cd_especialidade: item.cd_especialidade,
          }))
        );
      } else {
        setSelectEspecialidade([]);
      }
    } catch (error) {
      console.error('Error fetching especialidade:', error);
      setError('Erro ao carregar especialidades');
    }
  };

  const filtrarMedicos = () => {
    let filtrados = results;

    if (selectEstado) {
      filtrados = filtrados.filter((res) => res.address.includes(`/${selectEstado}`));
    }

    if (neighborhood) {
      filtrados = filtrados.filter((res) => res.address.includes(`, ${neighborhood}/`));
    }

    if (selectedSpecialties.length > 0) {
      filtrados = filtrados.filter((res) =>
        res.specialties.some((esp) => selectedSpecialties.includes(esp))
      );
    }

    setFilteredResults(filtrados);
  };

  useEffect(() => {
    filtrarMedicos();
  }, [selectEstado, neighborhood, selectedSpecialties, results]);

  const searchNeighborhood = async (value) => {
    setSelectEstado(value);
    // Reset all relevant fields when changing state
    setNeighborhood('');
    setEstablishmentType('');
    setSelectedSpecialties([]);
    setResults([]);
    setFilteredResults([]);
    setSpecialtiesByType({
      diagnostic: [],
      hospital: [],
      clinic: [],
    });
    setNeighborhoods([]);
    setCoordenadas(null);
    setEndereco('');
    setError(null);

    try {
      const res = await api.get(`/Medico/estado/${value}`);
      const data = res.data.rows || res.data.data || [];

      const newResults = data.map((b) => {
        const espec = selectEspecialidade.find(
          (c) => c.cd_especialidade === b.cd_especialidade
        );
        return {
          name: b.nm_medico,
          address: `${b.nm_logradouro}, ${b.cd_numero} - ${b.nm_complemento}, ${b.nm_cidade}/${b.sg_estado}`,
          phone: b.phone || '(54) 32214204 / (54) 32214571',
          specialties: [espec?.ds_especialidade || ''],
        };
      });

      setResults(newResults);
      setNeighborhoods(
        [...new Set(data.map((b) => b.nm_cidade))].filter(Boolean)
      );

      const newSpecialties = { diagnostic: [], hospital: [], clinic: [] };

      data.forEach((item) => {
        if (item.ds_establishmenttypes && item.cd_especialidade) {
          if (!newSpecialties[item.ds_establishmenttypes]) {
            newSpecialties[item.ds_establishmenttypes] = [];
          }

          const espec = selectEspecialidade.find(
            (c) => c.cd_especialidade === item.cd_especialidade
          );

          const nomeEspecialidade = espec?.ds_especialidade || '';

          if (!newSpecialties[item.ds_establishmenttypes].includes(nomeEspecialidade)) {
            newSpecialties[item.ds_establishmenttypes].push(nomeEspecialidade);
          }
        }
      });

      setSpecialtiesByType(newSpecialties);
      if (newResults.length > 0) {
        const resGeo = await api.post('/geolocalizar', {
          endereco: newResults[0].address,
        });
        setCoordenadas(resGeo.data);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar médicos');
    }
  };

  const buscarEndereco = async (address) => {
    try {
      const res = await api.post('/geolocalizar', { endereco: address });

      setCoordenadas(res.data);
      setEndereco(address);
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar localização do endereço');
    }
  };

  const useCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão para acessar localização foi negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoordenadas({ latitude, longitude });
      setEndereco('Localização atual');
    } catch (err) {
      Alert.alert('Erro', 'Erro ao obter localização atual: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.filterContainer}>
          <Text style={styles.title}></Text>
          <SelectLista
            data={estados}
            selectedItem={selectEstado}
            setSelected={setSelectEstado}
            onSelect={searchNeighborhood}
            isEmpty={estados.length === 0}
            placeholder="Selecione o Estado"
          />

          <SelectLista
            data={neighborhoods.map((nb) => ({ label: nb, value: nb }))}
            selectedItem={neighborhood}
            setSelected={setNeighborhood}
            onSelect={setNeighborhood}
            isEmpty={neighborhoods.length === 0 && error}
            placeholder="Cidades disponíveis"
          />

          <SelectLista
            data={establishmentTypes}
            selectedItem={establishmentType}
            setSelected={setEstablishmentType}
            onSelect={(value) => {
              setSelectedSpecialties([]);
              setEstablishmentType(value);
            }}
            isEmpty={establishmentTypes.length === 0}
            placeholder="o Estabelecimento"
          />

          {establishmentType && (
            <SelectLista
              data={specialtiesByType[establishmentType]
                .filter(Boolean)
                .map((specialty) => ({ label: specialty, value: specialty }))}
              selectedItem={selectedSpecialties[0] || ''}
              setSelected={(value) => setSelectedSpecialties([value])}
              onSelect={(value) => setSelectedSpecialties([value])}
              isEmpty={specialtiesByType[establishmentType].length === 0}
              placeholder="a Especialidade"
            />
          )}
          <Text style={styles.subtitle}>{filteredResults.length} resultado(s)</Text>
        </View>

        <ScrollView style={styles.resultsContainer}>
          {filteredResults.map((res, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.resultItem}
              onPress={() => buscarEndereco(res.address)}
            >
              <Text style={styles.resultName}>{res.name}</Text>
              <Text style={styles.resultAddress}>{res.address}</Text>
              <Text style={styles.resultPhone}>{res.phone}</Text>
              {res.specialties?.map((esp, i) => (
                <Text key={i} style={styles.resultSpecialty}>{esp}</Text>
              ))}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        {coordenadas ? (
          <MapView
            style={styles.map}
            region={{
              latitude: coordenadas.latitude || coordenadas.lat || 0,
              longitude: coordenadas.longitude || coordenadas.lng || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: coordenadas.latitude || coordenadas.lat || 0,
                longitude: coordenadas.longitude || coordenadas.lng || 0,
              }}
              title={endereco}
            />
          </MapView>
        ) : (
          <Text style={styles.noMapText}>Nenhum local selecionado</Text>
        )}
      </View>
    </View>
  );
}
