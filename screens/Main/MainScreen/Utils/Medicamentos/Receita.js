import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Image, TouchableOpacity, Alert, Linking, TextInput, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import Calendar from '../../../../../components/Calendar';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';
import Modal from "react-native-modal";
import { getStyles } from './Styles';
import { useTheme } from '../../../../../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { Camera, Send } from 'lucide-react-native';

const Horarios = ({ selected, onSelect, hora }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
  const handlePress = () => {
    onSelect();
  };

  const image = selected ? require('../../../../../assets/src/relogiol.png') : require('../../../../../assets/src/relogio.png');
  return (
    <TouchableOpacity style={{ marginLeft: 10, marginRight: 10 }} onPress={handlePress}>
      <View style={{ top: 10, width: 90, height: 30, borderWidth: selected ? 3 : 1, borderRadius: 20, alignItems: 'center', alignContent: 'center', flexDirection: 'row', backgroundColor: selected ? '#6542a1' : 'white', justifyContent: 'space-around', padding: 5 }}>
        <Image source={image} style={{ width: 20, height: 20 }} />
        <Text style={{ fontSize: 13, fontWeight: 'bold', top: selected ? -3 : -1, fontStyle: 'italic', color: selected ? 'white' : 'black' }}>{hora}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function App({ route, navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedHorarios, setSelectedHorarios] = useState([]);
  const { ben, med, esp, ate } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [selitem, setselitem] = useState(false);
  const [color, setColor] = useState('white');
  const [disabled, setDisabled] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const handleHorarioSelect = (horario) => {
    const index = selectedHorarios.indexOf(horario);
    const updatedHorarios = [...selectedHorarios];
    if (index === -1) {
      updatedHorarios.push(horario);
    } else {
      updatedHorarios.splice(index, 1);
    }
    setSelectedHorarios(updatedHorarios);
  };

  const Gravar = async () => {
    try {
      await Promise.all(selectedHorarios.map(async (horario) => {
        await api.post('/Agenda',[{
          'nm_medico':            med.Nome,
          'cd_crm':               med.crm,
          'cd_especialidade':     esp.esp,
          'ds_tipo_agendamento':  ate.Nome,
          'dt_agendamento':       selectedDate,
          'hr_agendamento':       horario,
          'cd_cpf_beneficiaro':   ben.cpf,
          'ds_observacao':        observacao,
        }]);
      }));

      Alert.alert('Sucesso', 'Cadastro(s) realizado(s) com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Medicamentos') },
      ]);
    } catch (error) {
      console.error('Erro ao armazenar os dados:', error);
      Alert.alert('Erro', 'Não foi possível realizar o(s) cadastro(s). Tente novamente.', [
        { text: 'OK' },
      ]);
    }
  };

  const openWhatsApp = () => {
    let url = 'whatsapp://send?';
    let text = 'text=Olá!' + med.Nome + "\nTitular : " + ben.Nome + "\nDigite aqui sua mensagem : ";
    let fone = '&phone=+5513981375296';

    Linking.openURL(url + text + fone)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Por favor, instale o WhatsApp para entrar em contato.');
      });
  };

  const sendEmail = async () => {
    await navigation.navigate('Bulario', { med: med });
  };

  const callPhoneNumber = (phoneNumber) => {
    let phoneURL = `tel:${phoneNumber}`;
    Linking.openURL(phoneURL)
      .then(() => {
        console.log('Discador aberto');
      })
      .catch((err) => console.error('Erro ao tentar abrir o discador:', err));
  };

  const closeModal = (text) => {
    setObservacao(text);
    setColor(text.trim() === '' ? 'white' : 'green');
    setDisabled(text.trim() === '');
  };

  const saveModal = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const SelDate = (item) =>{
    setSelectedDate(item);
    setselitem(true);
  }

  const isDisabled = !(selitem && selectedHorarios.length > 0);

  return (
    <SafeAreaView style={styles.container}>
          <View style={styles.headerContainer}>
        <Image source={require('../../../../../assets/src/Receita.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Olá, {ben.value}, </Text>
        <Text style={styles.headerText}>Tudo bem!</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{med.value} </Text>
          <Text style={styles.headerText}>Dúvidas sobre o Uso:</Text>
        </View> 
        <View style={styles.buttonHeader}>
          <TouchableOpacity style={styles.buttonContainer}  onPress={() => callPhoneNumber('+5513981375296')}>
            <FontAwesome name="phone" size={30} color={theme.inputTextColor} style={styles.contato} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}  onPress={openWhatsApp}>
            <FontAwesome name="whatsapp" size={30} color={theme.inputTextColor} style={styles.contato} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}  onPress={sendEmail}>
            <FontAwesome name="stethoscope" size={30} color={theme.inputTextColor} style={styles.contato} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ borderWidth: 0, width: "100%", height: '60%', borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white' }}>
        <View style={{ top: -33 }}>
          <View>
            <Calendar onSelectDate={(item) => SelDate(item)} selected={selectedDate} />
            <StatusBar style="auto" />
          </View>
          <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: -70, left: 40 }}>Horários</Text>
          <View style={{ top: -70, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Horarios selected={selectedHorarios.includes('07:00')} onSelect={() => handleHorarioSelect('07:00')} hora={'07:00'} />
            <Horarios selected={selectedHorarios.includes('08:00')} onSelect={() => handleHorarioSelect('08:00')} hora={'08:00'} />
            <Horarios selected={selectedHorarios.includes('09:00')} onSelect={() => handleHorarioSelect('09:00')} hora={'09:00'} />
            <Horarios selected={selectedHorarios.includes('10:00')} onSelect={() => handleHorarioSelect('10:00')} hora={'10:00'} />
          </View>
          <View style={{ top: -60, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Horarios selected={selectedHorarios.includes('11:00')} onSelect={() => handleHorarioSelect('11:00')} hora={'11:00'} />
            <Horarios selected={selectedHorarios.includes('12:00')} onSelect={() => handleHorarioSelect('12:00')} hora={'12:00'} />
            <Horarios selected={selectedHorarios.includes('13:00')} onSelect={() => handleHorarioSelect('13:00')} hora={'13:00'} />
            <Horarios selected={selectedHorarios.includes('14:00')} onSelect={() => handleHorarioSelect('14:00')} hora={'14:00'} />
          </View>
          <View style={{ top: -50, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Horarios selected={selectedHorarios.includes('15:00')} onSelect={() => handleHorarioSelect('15:00')} hora={'15:00'} />
            <Horarios selected={selectedHorarios.includes('16:00')} onSelect={() => handleHorarioSelect('16:00')} hora={'16:00'} />
            <Horarios selected={selectedHorarios.includes('17:00')} onSelect={() => handleHorarioSelect('17:00')} hora={'17:00'} />
            <Horarios selected={selectedHorarios.includes('18:00')} onSelect={() => handleHorarioSelect('18:00')} hora={'18:00'} />
          </View>
          <View style={{ top: -40, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Horarios selected={selectedHorarios.includes('19:00')} onSelect={() => handleHorarioSelect('19:00')} hora={'19:00'} />
            <Horarios selected={selectedHorarios.includes('20:00')} onSelect={() => handleHorarioSelect('20:00')} hora={'20:00'} />
            <Horarios selected={selectedHorarios.includes('21:00')} onSelect={() => handleHorarioSelect('21:00')} hora={'21:00'} />
            <Horarios selected={selectedHorarios.includes('22:00')} onSelect={() => handleHorarioSelect('22:00')} hora={'22:00'} />
          </View>
        </View>
        <TouchableOpacity style={{ borderRadius: 20, borderWidth: isDisabled ? 1 : 3, position: 'absolute', bottom: 42, left: 10, alignSelf: 'center', padding: 10, backgroundColor: isDisabled ? 'white' : '#6542a1', borderColor: isDisabled ? 'black' : 'orange' }}
          onPress={Gravar} disabled={isDisabled}>
          <Text style={{ textAlign: 'center', fontSize: 20, color: isDisabled ? 'black' : 'white', fontWeight: 'bold', fontStyle: 'italic' }}>Agende Agora sua Consulta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 20, borderWidth: isDisabled ? 1 : 3, position: 'absolute', bottom: 42, right: 10, alignSelf: 'center', padding: 10, backgroundColor: isDisabled ? 'white' : '#6542a1', borderColor: isDisabled ? 'black' : 'orange' }}
          onPress={() => setModalVisible(true)} disabled={isDisabled}>
          <Text style={{ textAlign: 'center', fontSize: 15, color: isDisabled ? 'black' : 'white', fontWeight: 'bold', fontStyle: 'italic' }}>Observação</Text>
        </TouchableOpacity>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={toggleModal}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Observação"
                value={observacao}
                multiline={true}
                onChangeText={closeModal}
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.iconButton} onPress={saveModal} disabled={disabled || isSending}>
                <Send size={24} color="#1E90FF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ bottom: -10 }}>
            <Rodape />
          </View>
        </Modal>
      </View>
      <View style={{ width: '105%', position: 'absolute', bottom: 0, right: 0, marginEnd: 0, borderRadius: 30 }}>
        <Rodape />
      </View>
    </SafeAreaView>
  );
}