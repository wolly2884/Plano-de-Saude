import React from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdown = ({ placeholder, open, value, items, setOpen, setValue, setItems, emptyError, onSelectItem }) => {
    return (
        <View>
            <Text>{placeholder}</Text>
            <DropDownPicker
                 placeholder={placeholder}
                 open={open}
                 value={value}
                 items={items}
                 setOpen={setOpen}
                 setValue={setValue}
                 setItems={setItems}
                 disabledStyle={{ opacity: 0.5 }}
                 style={{ borderWidth: 0, top: 10 }}
                onSelectItem={onSelectItem}
            />
            {emptyError && <Text>Please select an option</Text>}
        </View>
    );
};

export default Dropdown;
