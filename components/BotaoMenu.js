import React from 'react';
import { View, TouchableOpacity, Text, Image,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import {styles} from '../screens/Main/MainScreen/Menu/styles'

const App = ({ text, nav, image, navegar}) => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.menucontainer}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(nav)}>
        <ImageBackground source={image} style={styles.image} />
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
