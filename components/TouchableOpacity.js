import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import {styles} from './Styles'

const App = ({ text, nav, image }) => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.menucontainer}>
      <TouchableOpacity style={styles.menubutton} onPress={() => navigation.navigate(nav)}>
        <View style={styles.menuview}>
          <Image source={image} style={styles.menuimg} />
          <Text style={styles.menubuttonText}>{text}</Text>
        </View>
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default App;
