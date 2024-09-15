import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

const App = ({
  text = "Default Text", // Parâmetro padrão
  value = "", // Parâmetro padrão
  funcao = () => {}, // Parâmetro padrão
  istrue = false, // Parâmetro padrão
  max = 255, // Parâmetro padrão
  teclado = "default", // Parâmetro padrão
  editar = true, // Parâmetro padrão
  icon = "pencil", // Parâmetro padrão
  onlong = () => {} // Parâmetro padrão
}) => {
  return (
    <View style={{ flex: 1, top: 10, paddingBottom: 11 }}>
      <TextInput
        placeholder={`Entre com ${text}`}
        underlineColor="white"
        secureTextEntry={istrue}
        value={value}
        onChangeText={funcao}
        maxLength={max}
        keyboardType={teclado}
        autoCorrect={true}
        editable={editar}
        mode='outlined'
        label={text}
        left={<TextInput.Icon icon={icon} onPress={onlong} />}
      />
    </View>
  );
};

export default App;
