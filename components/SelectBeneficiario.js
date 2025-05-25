import React from 'react';
import { View, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const SelectBeneficiario = ({ data, selectedItem, setSelectedItem, onSelect, isEmpty }) => {
  return (
    <View>
      <SelectList  
        placeholder="Selecione o Beneficiário"
        setSelected={setSelectedItem}
        data={data}
        search={true}
        searchPlaceholder="Pesquisar"
        
        inputStyles={{
          fontSize: 20,
          width: '97%',
          textAlign: 'left',
          color: isEmpty ? 'red' : 'black'
        }}

        dropdownStyles={{
          top: 12,
          width: '97%',
          borderTopRightRadius: 20,
          backgroundColor: '#ceeaf2',
          left: 5,
          zIndex: 1,
          elevation: 1
        }}

        dropdownTextStyles={{ fontSize: 20, color: 'black' }}
        dropdownItemStyles={{ height: 40, width: '97%', fontSize: 30, color: 'black' }}

        boxStyles={{ left: 5, borderTopRightRadius: 10, backgroundColor: '#ceeaf2' }}
        itemStyles={{ fontSize: 50, color: 'black' }}

        onSelect={() => onSelect(data.find(item => item.key === selectedItem))}
      />

      {isEmpty && <Text style={{ color: 'red', marginTop: 10 }}>Selecione um Beneficiário</Text>}
    </View>
  );
};

export default SelectBeneficiario;
