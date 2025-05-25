import React, { useState, useRef } from 'react';
import { View, FlatList, Animated } from 'react-native';
import Screen from './Cartao';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const App = ({items, navigation}) => {
  const [xOffset] = useState(new Animated.Value(0));
  const flatListRef = useRef(null);

  const renderItem = ({ item, index }) => (
    <Screen 
      items={item} 
      index={index} 
      xOffset={xOffset} 
      navigation={navigation} 
      tamarray={items.length} 
    />
  );

  const keyExtractor = (item, index) => index.toString();

  return (
    <AnimatedFlatList
      ref={flatListRef}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      pagingEnabled
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: xOffset } } }],
        { useNativeDriver: true } 
      )}
      style={{ flex: 1, top: 100 }}
    />
  );
};

export default App;