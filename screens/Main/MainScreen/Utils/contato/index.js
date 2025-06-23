import React, { useState } from 'react';
import {TouchableOpacity, Text, Linking, ScrollView, SafeAreaView, Image} from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import {styles} from './Styles'
import { SelectList } from 'react-native-dropdown-select-list'
import InputTexto from '../../../../../components/InputTexto1';
import Rodape  from '../../../../../components/Rodape'

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './Styles';

const App = ({navigation}) => {
  const [message, setMessage]         = useState('');
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [titular, setTitular]         = useState('');
  const [carteirinha, setCarteirinha] = useState('');
  const [selected, setSelected]       = useState('');
  const [isEmptyDropDownPicker, setIsEmptyDropDownPicker] = useState(false);
  
  const { theme } = useTheme();
  const styles = getStyles(theme);

useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const storedCardNumber    = await AsyncStorage.getItem('cardNumber');
          const storedEmail         = await AsyncStorage.getItem('Email');
          const storedUsername      = await AsyncStorage.getItem('username');

          setName(storedUsername)
          setEmail(storedEmail) 
          setTitular(storedUsername)
          setCarteirinha(storedCardNumber)

        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };

      checkLoginStatus();
    }, [navigation])
  );
  const data = [
      {key:'1', value:'Reclamação'},
      {key:'2', value:'Sugestão'},
      {key:'3', value:'Elogio'},
      {key:'4', value:'Outros'},
  ]

  const openWhatsApp = () => {
    let url  = 'whatsapp://send?';
    let text = 'text=Olá!' + name  +"\nTitular : " + titular + "\nCarteirinha : " + carteirinha + "\nFeedBack : " + selected + "\nMensagem : " + message; 
    let fone = '&phone=+5513981375296';

    Linking.openURL(url+text+fone)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Por favor, instale o WhatsApp para entrar em contato.');
      });
  };

  const sendEmail = async () => {
    let emailContent = {
      recipients: ['Anderson.tome@fatec.sp.gov.br'], 
      body: `
        Nome:           ${name}
        Email:          ${email}
        Titular:        ${titular}
        Carteirinha:    ${carteirinha}
        Tipo_FeedBack:  ${selected}
        Mensagem:       ${message}
      `,
      isHtml: false,
    };

    await MailComposer.composeAsync(emailContent);
  };

    const getInputStyle = (isValid) => ({
    ...styles.container,
    ...(isValid ? styles.dropdownError : {}),
  });

  return (
  <SafeAreaView style={{flex: 1}}>
    <SafeAreaView style={styles.Contatocontainer}>
      <ScrollView contentContainerStyle={styles.ContatocontentContainer} >
        <SafeAreaView >
          <SelectList   
              dropdownStyles={{fontsize: 10, marginTop: 10, marginBottom: 20}}
              placeholder={'Selecione o tipo de feedback'} 
              setSelected={(val) => setSelected(val)} 
              data={data} 
              save="value" 
              search={true}
              boxStyles={[styles.dropdown, isEmptyDropDownPicker ? styles.dropdownError : {}]}
              inputStyles={styles.dropdownText}
              dropdownTextStyles={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
            />
              {isEmptyDropDownPicker && (
                <Text style={styles.errorMessage}>Selecione o Beneficiário</Text>
              )}
        </SafeAreaView>

        <SafeAreaView>
              <InputTexto
                text="Nome"
                value={name}
                funcao={setName}
                editar={true}
                icon={ 'card-account-mail'} 
                placeholderTextColor={theme.placeholderColor}
                istrue={false}
                max={50}
                teclado="default"
                style={getInputStyle(false)}
              />

            <InputTexto
              text="Email"
              value={email}
              funcao={setEmail}
              editar={true}
              icon={ 'card-account-mail'} 
              placeholderTextColor={theme.placeholderColor}
              istrue={false}x
              max={50}
              teclado="email-address"
              style={getInputStyle(false)}
            />

            <InputTexto
              text="Titular"
              value={titular}
              funcao={setTitular}
              editar={true}
              icon={ 'card-account-mail'} 
              placeholderTextColor={theme.placeholderColor}
              istrue={false}
              max={50}
              teclado="email-address"
              style={getInputStyle(false)}
            />
            
            <InputTexto
              text="Número da Carteirinha"
              value={carteirinha}
              funcao={setCarteirinha}
              editar={true}
              icon={ 'card-account-mail'} 
              placeholderTextColor={theme.placeholderColor}
              istrue={false}
              max={50}
              teclado="numeric"
              style={getInputStyle(false)}
            />

            <InputTexto
              text="Menssagem"
              value={message}
              funcao={setMessage}
              editar={true}
              icon={ 'card-account-mail'} 
              placeholderTextColor={theme.placeholderColor}
              istrue={false}
              max={50}
              teclado="default"
              multiline={true}
              style={getInputStyle(false)}
            />
        </SafeAreaView>

        <TouchableOpacity style={[styles.Contatobutton,{flexDirection: 'row'}]} onPress={sendEmail}>
          <Text style={styles.ContatobuttonText}>Enviar Email</Text>
          <Image source={require('../../../../../assets/enioemail.png')} style={{width: 30, height: 30, left: 10,}}/>
        </TouchableOpacity>

        <Text style={styles.Contatotext}> Ou Entre em contato conosco via WhatsApp:</Text>
        
        <TouchableOpacity style={[styles.Contatobutton,{flexDirection: 'row'}]} onPress={openWhatsApp}>
          <Text style={styles.ContatobuttonText}>Abrir WhatsApp</Text>
          <Image source={require('../../../../../assets/whatsapp.png')} style={{width: 30, height: 30, left: 10,}}/>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

    <Rodape />
  </SafeAreaView>
  );
}

export default App;

