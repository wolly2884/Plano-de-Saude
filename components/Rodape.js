import React from 'react';
import { View, Text } from 'react-native';
import {styles} from './Styles'

const App = ({ text, nav, image }) => {

  return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Portal do Beneficiário</Text>
      </View>
  );
};

export default App;