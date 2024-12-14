import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { styles } from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert.alert('Error', 'Please enter both phone and password');
            return;
        }

        try {
            const response = await axios.post('https://kami-backend-5rs0.onrender.com/auth', {
                phone,
                password
            });

            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Login failed. Please check your credentials.');
        }
    };

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.logo}>KAMI</Text>
            <Text style={styles.subtitle}>Welcome back! Please login to continue</Text>
            
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="phone" size={24} color="#1a73e8" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#5f6368"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={24} color="#1a73e8" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 0 }]}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#5f6368"
                    />
                    <TouchableOpacity 
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon 
                            name={showPassword ? "visibility-off" : "visibility"} 
                            size={24} 
                            color="#1a73e8" 
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[styles.button, !phone || !password ? styles.buttonDisabled : null]}
                    onPress={handleLogin}
                    disabled={!phone || !password}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;