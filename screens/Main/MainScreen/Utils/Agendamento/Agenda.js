import { Text, SafeAreaView, View, Image, TouchableOpacity, Alert, Linking, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useState } from 'react';
import Calendar from '../../../../../components/Calendar';
import Rodape from '../../../../../components/Rodape';
import * as MailComposer from 'expo-mail-composer';
import api from '../../../../../api/api';
import Modal from "react-native-modal";
import { styles } from './Styles';
import { Camera, Send } from 'lucide-react-native';
import '../../../../../components/calendarLocale'

moment.locale('pt-br');

const Horarios = ({ selected, onSelect, hora }) => {
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
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const { ben, med, esp, ate } = route.params;
  const [color, setColor] = useState('white');
  const [disabled, setDisabled] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleHorarioSelect = (horario) => {
    setSelectedHorario(horario);
  };

  const Gravar = async () => {
    try {
      await api.post('/Agenda', [{
        'nm_medico': med.Nome,
        'cd_crm': med.crm,
        'cd_especialidade': esp.esp,
        'ds_tipo_agendamento': ate.Nome,
        'dt_agendamento': selectedDate,
        'hr_agendamento': selectedHorario,
        'cd_cpf_beneficiaro': ben.cpf,
        'ds_observacao': observacao,
      }]);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Agendamento') },
      ]);
    } catch (error) {
      console.error('Erro ao armazenar os dados:', error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.', [
        { text: 'OK' },
      ]);
    }
  };

  const openWhatsApp = () => {
    const url = 'whatsapp://send?';
    const text = `text=Olá! ${med.Nome}\nTitular : ${ben.Nome}\nDigite aqui sua mensagem : `;
    const fone = '&phone=+5513981375296';
    Linking.openURL(url + text + fone)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Por favor, instale o WhatsApp para entrar em contato.');
      });
  };

  const sendEmail = async () => {
    const emailContent = {
      recipients: ['Anderson.tome@fatec.sp.gov.br'],
      body: `
        Nome Medico:    ${med.Nome}
        Titular:        ${ben.Nome}
        Mensagem:       ${'Digite aqui sua mensagem'}
      `,
      isHtml: false,
    };
    await MailComposer.composeAsync(emailContent);
  };

  const callPhoneNumber = (phoneNumber) => {
    const phoneURL = `tel:${phoneNumber}`;
    Linking.openURL(phoneURL)
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

  const isDisabled = !selectedDate || !selectedHorario;
  const image = med.sexo === 'M' ? require('../../../../../assets/src/medico.png') : require('../../../../../assets/src/medica.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ borderWidth: 1, width: "100%", height: '40%', }}>
        <Image source={image} style={{ width: '40%', height: '90%', position: 'absolute', bottom: 0, right: 10 }} />
        <Text style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 'bold', top: 10 }}> Olá, {ben.Nome}, </Text>
        <Text style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 'bold', top: 20, left: 5 }}>Tudo bem!</Text>
        <Text style={{ fontSize: 25, fontStyle: 'italic', fontWeight: 'bold', top: 100 }}> {med.Nome}</Text>
        <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 'bold', top: 90, left: 10 }}>{esp.label}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ width: '10%', height: '10%' }} onPress={() => callPhoneNumber('+5513981375296')}>
            <Image source={require('../../../../../assets/src/telef.png')} style={{ width: 30, height: 30, top: 100, left: 10, }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '10%', height: '10%' }} onPress={openWhatsApp}>
            <Image source={require('../../../../../assets/src/whatsapp.png')} style={{ width: 30, height: 30, top: 100, left: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '10%', height: '10%' }} onPress={sendEmail}>
            <Image source={require('../../../../../assets/src/smartphone.png')} style={{ width: 30, height: 30, top: 100, left: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image source={require("../../../../../assets/src/estrela.png")} style={{ top: 200, left: 30, width: 17, height: 17 }} />
          <Text style={{ top: 200, left: 35, fontWeight: 'bold', fontStyle: 'italic' }}>4.8</Text>
        </View>
      </View>
      <View style={{ borderWidth: 0, width: "100%", height: '60%', borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white' }}>
        <View style={{ top: -30 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: 30, left: 40 }}>Agenda</Text>
          <View>
            <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
            <StatusBar style="auto" />
          </View>
          <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: -70, left: 40 }}>Horarios</Text>
          <View style={{ top: -70, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['07:00', '08:00', '09:00', '10:00'].map(hora => (
              <Horarios key={hora} selected={selectedHorario === hora} onSelect={() => handleHorarioSelect(hora)} hora={hora} />
            ))}
          </View>
          <View style={{ top: -60, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['11:00', '12:00', '13:00', '14:00'].map(hora => (
              <Horarios key={hora} selected={selectedHorario === hora} onSelect={() => handleHorarioSelect(hora)} hora={hora} />
            ))}
          </View>
          <View style={{ top: -50, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['15:00', '16:00', '17:00', '18:00'].map(hora => (
              <Horarios key={hora} selected={selectedHorario === hora} onSelect={() => handleHorarioSelect(hora)} hora={hora} />
            ))}
          </View>
          <View style={{ top: -40, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['19:00', '20:00', '21:00', '22:00'].map(hora => (
              <Horarios key={hora} selected={selectedHorario === hora} onSelect={() => handleHorarioSelect(hora)} hora={hora} />
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={{ borderRadius: 20, borderWidth: isDisabled ? 1 : 3, position: 'absolute', bottom: 40, left: 10, alignSelf: 'center', padding: 8, backgroundColor: isDisabled ? 'white' : '#6542a1', borderColor: isDisabled ? 'black' : 'orange' }}
          onPress={Gravar} disabled={isDisabled}>
          <Text style={{ textAlign: 'center', fontSize: 20, color: isDisabled ? 'black' : 'white', fontWeight: 'bold', fontStyle: 'italic' }}> Agende Agora sua Consulta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ borderRadius: 20, borderWidth: isDisabled ? 1 : 3, position: 'absolute', bottom: 40, right: 10, alignSelf: 'center', padding: 11, backgroundColor: isDisabled ? 'white' : '#6542a1', borderColor: isDisabled ? 'black' : 'orange' }}
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
