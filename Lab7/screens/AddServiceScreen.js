import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddServiceScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleAddService = async () => {
        if (!name.trim() || !price.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.post(
                'https://kami-backend-5rs0.onrender.com/services',
                { name, price: Number(price) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Service added successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add service');
        }
    };

    return (
        <ScrollView style={styles.formScreen}>
            <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Add New Service</Text>
                <Text style={styles.formSubtitle}>Create a new service offering</Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Service Name</Text>
                <View style={styles.inputContainer}>
                    <Icon name="spa" size={20} color="#5f6368" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter service name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#80868b"
                    />
                </View>
                <Text style={styles.inputHelper}>Enter a descriptive name for your service</Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Price (VND)</Text>
                <View style={styles.inputContainer}>
                    <Icon name="attach-money" size={20} color="#5f6368" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter price"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholderTextColor="#80868b"
                    />
                </View>
                <Text style={styles.inputHelper}>Enter the price in Vietnamese Dong (VND)</Text>
            </View>

            <TouchableOpacity 
                style={[styles.button, !name.trim() || !price.trim() ? styles.buttonDisabled : null]}
                onPress={handleAddService}
                disabled={!name.trim() || !price.trim()}
            >
                <Text style={styles.buttonText}>Create Service</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddServiceScreen;