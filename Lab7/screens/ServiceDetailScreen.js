import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';

const ServiceDetailScreen = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `https://kami-backend-5rs0.onrender.com/Services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setService(response.data);
    } catch (error) {
      console.error('Failed to fetch service details:', error);
      Alert.alert('Error', 'Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(
        `https://kami-backend-5rs0.onrender.com/Services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete service:', error);
      Alert.alert('Error', 'Failed to delete service');
    }
  };

  const renderThreeDotMenu = () => (
    <Menu>
      <MenuTrigger>
        <Icon name="more-vert" size={24} color="#fff" style={styles.menuIcon} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => navigation.navigate('EditService', { serviceId })}>
          <View style={styles.menuOption}>
            <Icon name="edit" size={20} color="#666" />
            <Text style={styles.menuText}>Edit</Text>
          </View>
        </MenuOption>
        <MenuOption onSelect={handleDelete}>
          <View style={styles.menuOption}>
            <Icon name="delete" size={20} color="#666" />
            <Text style={styles.menuText}>Delete</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Service Details"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <CustomHeader 
          title="Service Details"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <Text>Service not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Service Details"
        onBack={() => navigation.goBack()}
        rightComponent={renderThreeDotMenu()}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Service Name</Text>
          <Text style={styles.value}>{service.name}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>{service.price} đ</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{service.description || 'No description'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  menuIcon: {
    padding: 8,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default ServiceDetailScreen;