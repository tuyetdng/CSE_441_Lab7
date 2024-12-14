import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({ navigation }) => {
    const handleLogout = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout',
                    onPress: async () => {
                        await AsyncStorage.removeItem('userToken');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <View style={styles.formScreen}>
            <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>Settings</Text>
                <Text style={styles.screenSubtitle}>Manage your preferences</Text>
            </View>

            <View style={styles.settingsContainer}>
                <TouchableOpacity 
                    style={styles.settingsButton}
                    onPress={handleLogout}
                >
                    <View style={styles.settingsButtonContent}>
                        <Icon name="logout" size={24} color="#dc3545" />
                        <Text style={styles.settingsButtonText}>Logout</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#5f6368" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SettingsScreen;