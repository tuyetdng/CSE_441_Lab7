import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditServiceScreen = ({ route, navigation }) => {
    const { service } = route.params;
    const [name, setName] = useState(service.name);
    const [price, setPrice] = useState(service.price.toString());

    const handleUpdate = async () => {
        if (!name.trim() || !price.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.put(
                `https://kami-backend-5rs0.onrender.com/services/${service._id}`,
                { name, price: Number(price) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Service updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update service');
        }
    };

    const formatPrice = (text) => {
        // Remove all non-numeric characters
        const numericValue = text.replace(/[^0-9]/g, '');
        setPrice(numericValue);
    };

    return (
        <ScrollView style={styles.formScreen}>
            <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Edit Service</Text>
                <Text style={styles.formSubtitle}>Update service details</Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Service Name</Text>
                <View style={styles.inputContainer}>
                    <Icon name="business" size={24} color="#1a73e8" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter service name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#5f6368"
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Price (VND)</Text>
                <View style={styles.inputContainer}>
                    <Icon name="attach-money" size={24} color="#1a73e8" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter price in VND"
                        value={price ? Number(price).toLocaleString('vi-VN') : ''}
                        onChangeText={formatPrice}
                        keyboardType="numeric"
                        placeholderTextColor="#5f6368"
                    />
                </View>
                <Text style={styles.inputHelper}>Current price: {Number(service.price).toLocaleString('vi-VN')}₫</Text>
            </View>

            <TouchableOpacity 
                style={[styles.formButton, !name || !price ? styles.buttonDisabled : null]}
                onPress={handleUpdate}
                disabled={!name || !price}
            >
                <Text style={styles.formButtonText}>Update Service</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditServiceScreen;