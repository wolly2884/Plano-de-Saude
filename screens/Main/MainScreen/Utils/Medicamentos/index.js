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
  const [Medico_old     , SetMedico_old]        = useState([]);
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
                SetMedico_old(prevState => {
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

    const atendimento =  () => {
       
        // Montando os dados com forEach
        SetAtendimento(prevState => {
            const newData = ['Medicamentos', 'Materiais', 'Taxas e Gases'];
            return newData;
        });

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
        const selectedItem = Beneficiario.find(benef => benef.value === selectedValue.value);
    
        if (selectedItem) {
            setbenef(selectedItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.error('Item não encontrado para o valor:', selectedValue);
        }
    };

    const SelEsp = (selectedValue) => {
        setIsEmptyEspecialidade(false);
    
        // Encontra o objeto completo no array Beneficiario com base no valor selecionado
        const selespecItem = Especialidade.find(espec => espec.value === selectedValue);
    
        if (selespecItem) {
            setespec(selespecItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.error('Item não encontrado para o valor:', selectedValue);
        }
    };
    
    const SelMed = (selectedValue) => {
        setIsEmptyMedica(false);
    
        // Encontra o objeto completo no array Beneficiario com base no valor selecionado
        const selmedcItem = Medico.find(medic => medic.value === selectedValue);
    
        if (selmedcItem) {
            setmedic(selmedcItem); // Atualiza o estado com o objeto selecionado
        } else {
            console.error('Item não encontrado para o valor:', selmedcItem);
        }
    };

    const Selate = (selectedValue) => {
        setIsEmptyAtendimento(false);

        // Find the selected atendimento item
        const selectedAtendimento = Atendimento.find(ate => ate.value === selectedValue.value);

        if (selectedAtendimento) {
            setatend(selectedAtendimento); // Update selected atendimento
        } else {
            console.error('Atendimento item not found for value:', selectedValue.value);
            return;
        }

        // Restaura lista original de médicos antes de filtrar
        SetMedico(Medico_old);

        const newMedico = Medico_old.filter(med => med.Nome === selectedValue);
        
        if (newMedico.length > 0) {
            SetMedico(newMedico);
        } else {
            console.error('Nenhum medicamento encontrado para o tipo:', selectedValue);
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
                    data={Atendimento}
                    selectedItem={selAteItem}
                    setSelected={setSelAteItem}
                    onSelect={Selate}
                    isEmpty={isEmptyAtendimento && isEmptyerror}
                    placeholder='Tipo de Atendimento'
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
                    data={Medico}
                    selectedItem={selMedItem}
                    setSelected={setSelMedItem}
                    onSelect={SelMed}
                    isEmpty={isEmptyNMedica && isEmptyerror}
                    placeholder='Materiais ou Medicamentos'
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