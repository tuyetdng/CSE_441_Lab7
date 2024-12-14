import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles';

const DeleteServiceScreen = ({ route, navigation }) => {
    const { service } = route.params;

    const handleDeleteService = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(
                `https://kami-backend-5rs0.onrender.com/services/${service.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete service');
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete ${service.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: handleDeleteService, style: 'destructive' }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delete Service</Text>
            <Text style={styles.message}>
                Are you sure you want to delete this service?
            </Text>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                <Text style={styles.deleteButtonText}>Delete Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DeleteServiceScreen;