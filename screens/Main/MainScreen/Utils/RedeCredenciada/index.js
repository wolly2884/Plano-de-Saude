// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import SelectLista from '../../../../../components/SelectList';
import * as Location from 'expo-location';
import api from '../../../../../api/api';
import MapaEmbed from '../../../../../components/WebMaps'; // ajuste o caminho se necessário
import { getStyles } from './styles';
import { useTheme } from '../../../../../context/ThemeContext';

export default function App() {
  const [endereco, setEndereco] = useState('');
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
  const [marcadores, setMarcadores] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const estados = [
    { id: 'AC', value: 'Acre'                , label: 'Acre'                },
    { id: 'AL', value: 'Alagoas'             , label: 'Alagoas'             },
    { id: 'AP', value: 'Amapá'               , label: 'Amapá'               },
    { id: 'AM', value: 'Amazonas'            , label: 'Amazonas'            },
    { id: 'BA', value: 'Bahia'               , label: 'Bahia'               },
    { id: 'CE', value: 'Ceará'               , label: 'Ceará'               },
    { id: 'DF', value: 'Distrito Federal'    , label: 'Distrito Federal'    },
    { id: 'ES', value: 'Espírito Santo'      , label: 'Espírito Santo'      },
    { id: 'GO', value: 'Goiás'               , label: 'Goiás'               },
    { id: 'MA', value: 'Maranhão'            , label: 'Maranhão'            },
    { id: 'MT', value: 'Mato Grosso'         , label: 'Mato Grosso'         },
    { id: 'MS', value: 'Mato Grosso do Sul'  , label: 'Mato Grosso do Sul'  },
    { id: 'MG', value: 'Minas Gerais'        , label: 'Minas Gerais'        },
    { id: 'PA', value: 'Pará'                , label: 'Pará'                },
    { id: 'PB', value: 'Paraíba'             , label: 'Paraíba'             },
    { id: 'PR', value: 'Paraná'              , label: 'Paraná'              },
    { id: 'PE', value: 'Pernambuco'          , label: 'Pernambuco'          },
    { id: 'PI', value: 'Piauí'               , label: 'Piauí'               },
    { id: 'RJ', value: 'Rio de Janeiro'      , label: 'Rio de Janeiro'      },
    { id: 'RN', value: 'Rio Grande do Norte' , label: 'Rio Grande do Norte' },
    { id: 'RS', value: 'Rio Grande do Sul'   , label: 'Rio Grande do Sul'   },
    { id: 'RO', value: 'Rondônia'            , label: 'Rondônia'            },
    { id: 'RR', value: 'Roraima'             , label: 'Roraima'             },
    { id: 'SC', value: 'Santa Catarina'      , label: 'Santa Catarina'      },
    { id: 'SP', value: 'São Paulo'           , label: 'São Paulo'           },
    { id: 'SE', value: 'Sergipe'             , label: 'Sergipe'             },
    { id: 'TO', value: 'Tocantins'           , label: 'Tocantins'           },
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

  const searchNeighborhood = async (props) => {
    const idEstado = estados.find((e) => e.label === props)?.id;
    setSelectEstado(idEstado);

    setNeighborhood('');
    setEstablishmentType('');
    setSelectedSpecialties([]);
    setResults([]);
    setFilteredResults([]);
    setSpecialtiesByType({ diagnostic: [], hospital: [], clinic: [] });
    setNeighborhoods([]);
    setEndereco('');
    setError(null);
    setMarcadores([]);

    try {
      const res = await api.get(`/Medico/estado/${idEstado}`);
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

      // Geolocalização dos médicos
      if (newResults.length > 0) {
        const geoMarcadores = await Promise.all(
          newResults.map(async (res) => {
            try {
              const geo = await api.post('/geolocalizar', { endereco: res.address });
              return {
                lat: geo.data.latitude,
                lng: geo.data.longitude,
                label: res.name,
              };
            } catch {
              return null;
            }
          })
        );

        setMarcadores(geoMarcadores.filter(Boolean));
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar médicos');
    }
  };

  const buscarEndereco = async (address, nome = '') => {
    try {
      const res = await api.post('/geolocalizar', { endereco: address });
      setEndereco(address);
      setMarcadores([
        {
          lat: res.data.lat,
          lng: res.data.lng,
          label: nome || address,
        },
      ]);
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

      setEndereco('Localização atual');
      setMarcadores([
        {
          lat: latitude,
          lng: longitude,
          label: 'Você está aqui',
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao obter localização atual: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.filterContainer}>
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
              onPress={() => buscarEndereco(res.address, res.name)}
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
        {marcadores.length > 0 ? (
          <MapaEmbed locais={marcadores} />
        ) : (
          <Text style={styles.noMapText}>Nenhum local selecionado</Text>
        )}
      </View>
    </View>
  );
}
