import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import api from '../../../../../api/api';
import { AntDesign } from '@expo/vector-icons';

import SelectLista from '../../../../../components/SelectList';
import SelectBeneficiario from '../../../../../components/SelectBeneficiario';
import Rodape from '../../../../../components/Rodape';

import { useFocusEffect } from '@react-navigation/native';

import { getStyles } from './Styles';
import { useTheme } from '../../../../../context/ThemeContext';

const Agenda = ({ navigation }) => {
  const [Medico, SetMedico] = useState([]);
  const [Especialidade, SetEspecialidade] = useState([]);
  const [Atendimento, SetAtendimento] = useState([]);

  const [selectedItem, setSelectedItem] = useState('');
  const [selMedItem, setSelMedItem] = useState('');
  const [selEspItem, setSelEspItem] = useState('');
  const [selAteItem, setSelAteItem] = useState('');

  const [selbenef, setbenef] = useState('');
  const [selmedic, setmedic] = useState('');
  const [selespec, setespec] = useState('');
  const [selatend, setatend] = useState('');

  const [isEmptyerror, setisEmptyerror] = useState(false);
  const [isEmptyNMedica, setIsEmptyMedica] = useState(true);
  const [isEmptyEspecialidade, setIsEmptyEspecialidade] = useState(true);
  const [isEmptyDropDownPicker, setIsEmptyDropDownPicker] = useState(true);
  const [isEmptyAtendimento, setIsEmptyAtendimento] = useState(true);

  const { theme } = useTheme();
  const styles = getStyles(theme);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await especialidade();
          await medico();
          await atendimento();
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };
      fetchData();
    }, [])
  );

  const especialidade = async () => {
    try {
      const { data } = await api.get('/Especialidade');
      if (data.rowCount > 0) {
        const newData = data.rows.map(row => ({
          label: row.ds_especialidade,
          value: row.ds_especialidade,
          Nome: row.ds_especialidade,
          id: row.id,
          esp: row.cd_especialidade
        }));
        SetEspecialidade(newData);
      }
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
    }
  };

  const medico = async () => {
    try {
      const { data } = await api.get('/Medico');
      if (data.rowCount > 0) {
        const newData = data.rows.map(row => ({
          label: row.nm_medico,
          value: row.nm_medico,
          Nome: row.nm_medico,
          id: row.id,
          crm: row.cd_crm,
          sexo: row.sexo_medico
        }));
        SetMedico(newData);
      }
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
    }
  };

  const atendimento = async () => {
    try {
      const { data } = await api.get('/Atendimento');
      if (data.rowCount > 0) {
        const newData = data.rows
          .filter(row => row.ds_atendimento !== 'Medicamentos' && row.ds_atendimento !== 'Materias')
          .map(row => ({
            label: row.ds_atendimento,
            value: row.ds_atendimento,
            id: row.id,
            Nome: row.ds_atendimento
          }));
        SetAtendimento(newData);
      }
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
    }
  };

  const Valida = () => {

    if (isEmptyNMedica || isEmptyEspecialidade || isEmptyDropDownPicker) {
      setisEmptyerror(true);
    } else {
      setisEmptyerror(false);
      navigation.navigate('Agenda', {
        ben: selbenef,
        med: selmedic,
        esp: selespec,
        ate: selatend,
      });
    }
  };

  const SelBenef = (selectedValue) => {
    setIsEmptyDropDownPicker(false);
  
    setbenef(selectedValue);
    
  };

  const SelEsp = (selectedValue) => {
    setIsEmptyEspecialidade(false);
    const selectedEspecialidade = Especialidade.find(item => item.value === selectedValue);
    if (selectedEspecialidade) {
    setespec(selectedEspecialidade);
    }
  };

  const SelMed = (selectedValue) => {
    setIsEmptyMedica(false);
    const selectedMedico = Medico.find(item => item.value === selectedValue);
    if (selectedMedico) {
    setmedic(selectedMedico);
    }
  };

  const Selate = (selectedValue) => {
    setIsEmptyAtendimento(false);
    const selectedAtendimento = Atendimento.find(item => item.value === selectedValue);
    if (selectedAtendimento) {
        setatend(selectedAtendimento);

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bem Vindo ao Agendamento</Text>
      <Image source={require('../../../../../assets/src/doctor.png')} style={styles.Image} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.beneficiario}>
          <SelectBeneficiario
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            onSelect={SelBenef}
            isEmpty={isEmptyDropDownPicker && isEmptyerror}
          />
        </View>

        <View style={styles.SelectList}>
          <SelectLista
            data={Medico}
            selectedItem={selMedItem}
            setSelected={setSelMedItem}
            onSelect={SelMed}
            isEmpty={isEmptyNMedica && isEmptyerror}
            placeholder='Médico'
          />

          <SelectLista
            data={Especialidade}
            selectedItem={selEspItem}
            setSelected={setSelEspItem}
            onSelect={SelEsp}
            isEmpty={isEmptyEspecialidade && isEmptyerror}
            placeholder='Especialidade'
          />

          <SelectLista
            data={Atendimento}
            selectedItem={selAteItem}
            setSelected={setSelAteItem}
            onSelect={Selate}
            isEmpty={isEmptyAtendimento && isEmptyerror}
            placeholder='Tipo de Atendimento'
          />
        </View>
      </ScrollView>

      <View style={styles.buttonavancar}>
        <TouchableOpacity onPress={Valida} style={styles.button}>
            <Text style={styles.buttonText}>Avançar</Text>
            <AntDesign name="right" size={24} color="white" />           
            <AntDesign name="right" size={24} color="white" />           
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
        <Rodape />
      </View>
    </View>
  );
};

export default Agenda;
