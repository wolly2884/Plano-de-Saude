import { View, Text, SafeAreaView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { getStyles } from './SelectStyles';
import { useTheme } from '../context/ThemeContext';

const SelectLista = ({ data, selectedItem, setSelected, onSelect, isEmpty, placeholder }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <SafeAreaView>
        <SelectList
          placeholder={'Escolha ' + placeholder}
          data={data}
          save="label"
          search={true}
          boxStyles={[styles.dropdown, isEmpty ? styles.dropdownError : {}]}
          inputStyles={styles.dropdownText}
          dropdownTextStyles={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
          dropdownStyles={styles.dropdown}
          setSelected={(val) => {
            setSelected(val); // Atualiza no componente pai
            if (onSelect) onSelect(val); // Dispara o callback
          }}
        />
        {isEmpty && (
          <Text style={[styles.errorMessage, { marginTop: 5 }]}>
            Selecione uma opção
          </Text>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SelectLista;
