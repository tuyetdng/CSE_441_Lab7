import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get('https://kami-backend-5rs0.onrender.com/services', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                await AsyncStorage.removeItem('userToken');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            } else {
                Alert.alert('Error', 'Failed to fetch services');
            }
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
        >
            <View style={styles.serviceCardContent}>
                <View style={styles.serviceIconContainer}>
                    <Icon name="spa" size={24} color="#1a73e8" />
                </View>
                <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.servicePrice}>{item.price.toLocaleString('vi-VN')}₫</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#5f6368" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>Services</Text>
                <Text style={styles.screenSubtitle}>Manage your service offerings</Text>
            </View>

            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Icon name="spa" size={48} color="#dadce0" />
                        <Text style={styles.emptyText}>No services yet</Text>
                        <Text style={styles.emptySubText}>Add services to get started</Text>
                    </View>
                )}
            />

            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('AddService')}
            >
                <Icon name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;