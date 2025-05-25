import React from 'react';
import { View, TouchableOpacity, Text, Image,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import {getStyles} from './modalstyles'
import { useTheme } from '../context/ThemeContext' // 👈 Integração com ThemeContext

const App = ({  text = "Default Text", 
                nav = '=', 
                image = require('../assets/src/splash.png'), 
                navegar = () => {}}) => {
  const navigation = useNavigation(); 

  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);
  
  return (
    <View style={styles.menucontainer}>
      <TouchableOpacity style={styles.button} onPress={nav === '=' ? navegar : () => navigation.navigate(nav)}>
        <ImageBackground source={image} style={styles.image} />
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
