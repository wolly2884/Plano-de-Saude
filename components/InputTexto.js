import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

const InputTexto = ({
  text = "Default Text",
  value = "",
  funcao = () => {},
  istrue = false,
  max = 255,
  teclado = "default",
  editar = true,
  icon = "pencil",
  onlong = () => {},
  redicon = false,
  style = {},
  multiline = false,
  numberOfLines = 5,
}) => {
    const { theme, isThemeLoaded } = useTheme();

  return (
    <View style={{ marginBottom: 15 }}>
      <TextInput
        placeholder={`Entre com ${text}`}
        value={value}
        onChangeText={funcao}
        secureTextEntry={istrue}
        maxLength={max}
        keyboardType={teclado}
        editable={editar}
        autoCorrect={true}
        mode="outlined"
        label={text}
        textColor={theme.textColor}
        underlineColor="transparent"
        activeOutlineColor={theme.textColor}
        activeUnderlineColor={theme.textColor}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        outlineColor={theme.textColor}
        style={[{ backgroundColor: 'black' }, style]}
        theme={{
          colors: {
            text: theme.textColor,
            placeholder: theme.textColor,
            primary: theme.textColor,
          },
        }}
        left={
          <TextInput.Icon
            icon={() => (
              <TouchableOpacity onPress={onlong}>
                <MaterialCommunityIcons
                  name={icon}
                  size={24}
                  color={redicon ? 'red' : theme.textColor}
                />
              </TouchableOpacity>
            )}
          />
        }
      />
    </View>
  );
};

export default InputTexto;
