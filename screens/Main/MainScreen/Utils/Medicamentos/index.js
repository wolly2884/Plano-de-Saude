import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import SelectLista from '../../../../../components/SelectList';
import SelectBeneficiario from '../../../../../components/SelectBeneficiario';
import api from '../../../../../api/api';
import { AntDesign } from '@expo/vector-icons';

import Rodape  from '../../../../../components/Rodape';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getStyles } from './Styles';
import { useTheme } from '../../../../../context/ThemeContext';

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
  const { theme } = useTheme();
  const styles = getStyles(theme);

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
            const userData = await api.get('/Medicamento');  
            const rowCount = userData.data.rowCount;
            
            if (rowCount > 0) {
                // Montando os dados com forEach
                SetMedico(prevState => {
                    const newData = [];
                    
                    for (var i = 0; i < rowCount; i++) {
                      newData.push({label: userData.data.rows[i].id,
                                    Nome:  userData.data.rows[i].tp_matmedtax,
                                    crm:   userData.data.rows[i].cd_medicamento,
                                    value: userData.data.rows[i].ds_medicamento, 

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
            navigation.navigate('Receita', { ben: selbenef, 
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
        <View style={styles.container}>
            <Text style={styles.header}> Bem Vindo ao Receituario </Text>
            <Image source={require('../../../../../assets/src/medicamento.png')} style={styles.Image} />

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