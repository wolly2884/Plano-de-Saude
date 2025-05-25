import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './Styles';
import api from '../../../../../api/api';

import { SelectList } from 'react-native-dropdown-select-list';

import Rodape  from '../../../../../components/Rodape';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Agenda = ({ navigation }) => {
  const [Medico         , SetMedico]        = useState([]);
  const [Beneficiario   , SetBeneficiario]  = useState([]);
  const [Especialidade  , SetEspecialidade] = useState([]);
  const [Atendimento    , SetAtendimento]   = useState([]);

  const [selectedItem   , setSelectedItem]  = useState(' ');
  const [selMedItem     , setSelMedItem]    = useState(' ');
  const [selEspItem     , setSelEspItem]    = useState(' ');
  const [selAteItem     , setSelAteItem]    = useState(' ');

  const [selbenef, setbenef] = useState(' ');
  const [selmedic, setmedic] = useState(' ');
  const [selespec, setespec] = useState(' ');
  const [selatend, setatend] = useState(' ');

  const [isEmptyerror           , setisEmptyerror]          = useState(false);
  const [isEmptyNMedica         , setIsEmptyMedica]         = useState(true);
  const [isEmptyEspecialidade   , setIsEmptyEspecialidade]  = useState(true);
  const [isEmptyDropDownPicker  , setIsEmptyDropDownPicker] = useState(true);
  const [isEmptyAtendimento     , setIsEmptyAtendimento]    = useState(true);

    useFocusEffect(
        React.useCallback(() => {
        const checkLoginStatus = async () => {
            try {

                await beneficiario();
                await especialidade();
                await medico();
                await atendimento();

            } catch (error) {
            console.error('Erro ao recuperar os dados:', error);
            }
        };

        checkLoginStatus();
        }, [navigation])
    );

    const beneficiario = async () => {
        try {
            const storedID = await AsyncStorage.getItem('ID');
            const userData = await api.get('/Beneficiario/get/' + storedID);  
            const rowCount = userData.data.rowCount;
                    
            if (rowCount > 0) {
                
                // Montando os dados com forEach
                SetBeneficiario(prevState => {
                    const newData = [];
                    
                    for (var i = 0; i < rowCount; i++) {

                      newData.push({label: userData.data.rows[i].id,
                                    value: userData.data.rows[i].nm_beneficiario, 
                                    Nome:  userData.data.rows[i].nm_beneficiario,
                                    cpf:   userData.data.rows[i].cd_cpf,
                                    email: userData.data.rows[i].ds_emails
                                    });
                    }
                    return newData;
                });
            } else {
                // Handle user not found
            }
        } catch (error) {
            console.error('Error fetching beneficiario:', error);
            // Handle error
        }
    };

    const especialidade = async () => {
        try {
            const userData = await api.get('/Especialidade');  
            const rowCount = userData.data.rowCount;
            
            if (rowCount > 0) {
                // Montando os dados com forEach
                SetEspecialidade(prevState => {
                    const newData = [];
                    
                    for (var i = 0; i < rowCount; i++) {
                        newData.push({  label: userData.data.rows[i].ds_especialidade,
                                        value: userData.data.rows[i].ds_especialidade, 
                                        Nome:  userData.data.rows[i].id,
                                        esp:   userData.data.rows[i].cd_especialidade,
                                        });
                    }
                    return newData;
                });
            } else {
                // Handle user not found
            }
        } catch (error) {
            console.error('Error fetching especialidade:', error);
            // Handle error
        }
    };

    const medico = async () => {
        try {
            const userData = await api.get('/Medico');  
            const rowCount = userData.data.rowCount;
            
            if (rowCount > 0) {
                // Montando os dados com forEach
                SetMedico(prevState => {
                    const newData = [];
                    
                    for (var i = 0; i < rowCount; i++) {
                      newData.push({label: userData.data.rows[i].id,
                                    Nome:  userData.data.rows[i].nm_medico,
                                    crm:   userData.data.rows[i].cd_crm,
                                    sexo:  userData.data.rows[i].sexo_medico,
                                    value: userData.data.rows[i].nm_medico, 

                                    });
                    }
                    return newData;
                });
            } else {
                // Handle user not found
            }
        } catch (error) {
            console.error('Error fetching medico:', error);
            // Handle error
        }
    };

    const atendimento = async () => {
        try {
            const userData = await api.get('/Atendimento');  
            const rowCount = userData.data.rowCount;
            
            if (rowCount > 0) {
                // Montando os dados com forEach
                SetAtendimento(prevState => {
                    const newData = [];
                    
                    for (var i = 0; i < rowCount; i++) {
                        if ('Medicamentos' !==     userData.data.rows[i].ds_atendimento && 'Materias' !== userData.data.rows[i].ds_atendimento ){
                            newData.push({  label: userData.data.rows[i].id,
                                            value: userData.data.rows[i].ds_atendimento, 
                                            Nome:  userData.data.rows[i].ds_atendimento,
                                            id:    userData.data.rows[i].id,
                                });
                        }
                    }
                    return newData;
                });
            } else {
                // Handle user not found
            }
        } catch (error) {
            console.error('Error fetching medico:', error);
            // Handle error
        }
    };
    const Valida=()=>{
        if (isEmptyNMedica || isEmptyEspecialidade || isEmptyDropDownPicker){
            setisEmptyerror(true);
        } else {
            setisEmptyerror(false);
            navigation.navigate('Agenda', { ben: selbenef, 
                                            med: selmedic, 
                                            esp: selespec,
                                            ate: selatend
                                        });
        }

    }
    
    const SelBenef = (selectedValue) => {
        setIsEmptyDropDownPicker(false);
    
        // Encontra o objeto completo no array Beneficiario com base no valor selecionado
        const selectedItem = Beneficiario.find(benef => benef.value === selectedValue);
    
        if (selectedItem) {
            console.log('Item encontrado:', selectedItem); // Aqui você terá o objeto completo
            setbenef(selectedItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.log('Item não encontrado para o valor:', selectedValue);
        }
    };

    const SelEsp = (selectedValue) => {
        setIsEmptyEspecialidade(false);
    
        // Encontra o objeto completo no array Beneficiario com base no valor selecionado
        const selespecItem = Especialidade.find(espec => espec.value === selectedValue);
    
        if (selespecItem) {
            console.log('Item encontrado:', selespecItem); // Aqui você terá o objeto completo
            setespec(selespecItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.log('Item não encontrado para o valor:', selectedValue);
        }
    };
    
    const SelMed = (selectedValue) => {
        setIsEmptyMedica(false);
    
        // Encontra o objeto completo no array Beneficiario com base no valor selecionado
        const selmedcItem = Medico.find(medic => medic.value === selectedValue);
    
        if (selmedcItem) {
            console.log('Item encontrado:', selmedcItem); // Aqui você terá o objeto completo
            setmedic(selmedcItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.log('Item não encontrado para o valor:', selmedcItem);
        }
    };

    const Selate = (selectedValue) => {
        setIsEmptyAtendimento(false);
    
        // Encontra o objeto completo no array Beneficiario com base no valor selecionado
        const selateItem = Atendimento.find(ate => ate.value === selectedValue);
    
        if (selateItem) {
            console.log('Item encontrado:', selateItem); // Aqui você terá o objeto completo
            setatend(selateItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.log('Item não encontrado para o valor:', selateItem);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ position: 'absolute',  fontSize: 28, color: 'black', top: 0 }}> Bem Vindo ao Agendamento </Text>
            <Image source={require('../../../../../assets/src/doctor.png')} style={{width: 240, height: 300, position: 'absolute', top: 40}}/>

            <ScrollView style={{ top: 110, height: 480}}>

                <View style={{ marginTop: 220, width: '100%' }}>
                    <SelectList
                        placeholder='Selecione o Beneficiario'
                        setSelected={setSelectedItem}
                        data={Beneficiario}
                        search={true} // Você pode ativar a busca se quiser
                        boxStyles={[styles.View2, { borderWidth: 1, top: 10, zIndex: 2 }]}
                        dropdownStyles={{ borderWidth: 1,  width: '97%', top: 5  }}
                        onSelect={() => {SelBenef(selectedItem) }}/>
                    {isEmptyDropDownPicker && isEmptyerror && <Text style={[styles.errorMessage, { top: 7, left: 0 }]}>Selecione o Beneficiario</Text>}
                </View>

                <View style={{ marginTop: 10, width: '100%' }}>
                    <SelectList
                    placeholder='Selecione o Medico'
                    setSelected={setSelMedItem}
                    data={Medico}
                    search={true}
                    boxStyles={[styles.View2, { borderWidth: 1, top: 10, zIndex: 1 }]}
                    dropdownStyles={{ borderWidth: 1,  width: '97%', top: 5 }}
                    onSelect={() => SelMed(selMedItem)}
                    />
                    {isEmptyNMedica && isEmptyerror && <Text style={[styles.errorMessage, { top: 7, left: 0 }]}>Selecione o Medico</Text>}
                </View>


                <View style={{ marginTop: 10, width: '100%' }}>
                    <SelectList
                    placeholder='Selecione a Especialidade'
                    setSelected={setSelEspItem}
                    data={Especialidade}
                    search={true}
                    boxStyles={[styles.View2, { borderWidth: 1, top: 10, zIndex: 1 }]}
                    dropdownStyles={{ borderWidth: 1,  width: '97%', top: 5 }}
                    onSelect={() => SelEsp( selEspItem)}
                    />
                    {isEmptyEspecialidade && isEmptyerror && <Text style={[styles.errorMessage, { top: 7, left: 0 }]}>Selecione a Especialidade</Text>}
                </View>

                <View style={{ marginTop: 10, width: '100%' }}>
                    <SelectList
                    placeholder='Selecione o tipo de Atendimento'
                    setSelected={setSelAteItem} 
                    data={Atendimento}
                    search={true}
                    boxStyles={[styles.View2, { borderWidth: 1, top: 10, zIndex: 1 ,  width: '97%'}]}
                    dropdownStyles={{ borderWidth: 1,  width: '97%', top: 5, height: '40%' }}
                    onSelect={() => Selate(selAteItem)}
                    />
                    {isEmptyAtendimento && isEmptyerror && <Text style={[styles.errorMessage, { top: 7, left: 0 }]}>Selecione o Atendimento</Text>}
                </View>
                <View style={{ marginTop: 10, width: '100%' }}>
                </View>
            </ScrollView>

        <View style={{width: '30%', borderWidth: 1, height: 40, position: 'absolute', bottom: 50, right: 10, marginEnd: 0, borderRadius: 30 }}>
            <TouchableOpacity onPress={() => Valida() }>
                <View style={{ borderWidth: 0, height: 40 }}>
                    <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 25 }}>Avançar</Text>
                </View>
            </TouchableOpacity>
        </View>

    <View style={{width: '105%', position: 'absolute', bottom: 0, right: 0, marginEnd: 0, borderRadius: 30 }}>
        <Rodape />
    </View>
</View>
    );
};

export default Agenda;