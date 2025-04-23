// contacts.tsx
import React, { useState, useEffect, } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import icons from '@/constants/icons';

// Define Friend type
interface Friend {
  id: string;
  name: string;
  phone: string;
}

// Simulated API URL (not actually used for requests)
const API_URL = 'https://api.example.com/contacts';

export default function Contacts() {

    const [fontsLoaded] = useFonts({
      "Montserrat-Thin": require("../../../../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
      "Montserrat-Regular": require("../../../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
      "Montserrat-SemiBold": require("../../../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("../../../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    });

  const [friends, setFriends] = useState<Friend[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentFriendId, setCurrentFriendId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load friends from storage when component mounts
  useEffect(() => {
    console.log('Contacts component mounted');
    loadFriends();
  }, []);

  // Load friends from AsyncStorage with simulated API call
  const loadFriends = async () => {
    console.log('Loading friends...');
    setIsLoading(true);
    try {
      // Simulate API call
      console.log('Fetching contacts from API:', API_URL);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful API response
      console.log('API response status: 200 OK');
      
      // Actually load from AsyncStorage
      const storedFriends = await AsyncStorage.getItem('friends');
      if (storedFriends !== null) {
        const parsedFriends = JSON.parse(storedFriends);
        console.log('Contacts loaded from storage:', parsedFriends.length, 'contacts');
        setFriends(parsedFriends);
      } else {
        console.log('No contacts found in storage, initializing empty array');
        setFriends([]);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  // Save friends to AsyncStorage
  const saveFriends = async (updatedFriends: Friend[]) => {
    console.log('Saving friends to local storage:', updatedFriends.length, 'contacts');
    try {
      await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
      console.log('Friends saved to local storage successfully');
      setFriends(updatedFriends);
    } catch (error) {
      console.error('Error saving friends to local storage:', error);
      Alert.alert('Error', 'Failed to save contacts locally');
    }
  };

  // Simulate adding a friend to API
  const addFriendToAPI = async (friend: Friend) => {
    console.log('Adding friend to API:', friend);
    setIsLoading(true);
    
    try {
      // Simulate API request
      console.log('POST request to:', API_URL);
      console.log('Request body:', JSON.stringify(friend));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful API response
      console.log('API response status for add: 201 Created');
      
      // Simulate server-generated ID (in a real API, the server might assign an ID)
      const addedFriend = { ...friend, id: `api-${Date.now()}` };
      console.log('Friend added to API successfully:', addedFriend);
      
      return addedFriend;
    } catch (error) {
      console.error('Error adding friend to API:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate updating a friend in API
  const updateFriendInAPI = async (friend: Friend) => {
    console.log('Updating friend in API:', friend);
    setIsLoading(true);
    
    try {
      // Simulate API request
      const url = `${API_URL}/${friend.id}`;
      console.log('PUT request to:', url);
      console.log('Request body:', JSON.stringify(friend));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful API response
      console.log('API response status for update: 200 OK');
      
      // Return the updated friend
      console.log('Friend updated in API successfully:', friend);
      return friend;
    } catch (error) {
      console.error('Error updating friend in API:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate deleting a friend from API
  const deleteFriendFromAPI = async (id: string) => {
    console.log('Deleting friend from API, id:', id);
    setIsLoading(true);
    
    try {
      // Simulate API request
      const url = `${API_URL}/${id}`;
      console.log('DELETE request to:', url);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful API response
      console.log('API response status for delete: 204 No Content');
      console.log('Friend deleted from API successfully');
      
      return true;
    } catch (error) {
      console.error('Error deleting friend from API:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal to add a new friend
  const openAddModal = () => {
    console.log('Opening add modal');
    setName('');
    setPhone('');
    setCurrentFriendId(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  // Open modal to edit an existing friend
  const openEditModal = (friend: Friend) => {
    console.log('Opening edit modal for friend:', friend);
    setName(friend.name);
    setPhone(friend.phone);
    setCurrentFriendId(friend.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  // Save or update a friend
  const saveFriend = async () => {
    // Validate inputs
    if (name.trim() === '' || phone.trim() === '') {
      console.log('Validation failed: empty name or phone');
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    console.log('Saving friend, isEditing:', isEditing);
    setIsLoading(true);
    
    try {
      if (isEditing && currentFriendId) {
        // Update existing friend
        const friendToUpdate: Friend = {
          id: currentFriendId,
          name,
          phone
        };
        
        console.log('Updating existing friend:', friendToUpdate);
        
        // Simulate API update
        try {
          console.log('Attempting to update friend in API');
          await updateFriendInAPI(friendToUpdate);
          
          // If API update succeeds, update local state
          console.log('API update successful, updating local state');
          const updatedFriends = friends.map(friend => 
            friend.id === currentFriendId 
              ? { ...friend, name, phone } 
              : friend
          );
          await saveFriends(updatedFriends);
          Alert.alert('Success', 'Contact updated successfully');
        } catch (error) {
          console.error('API update failed:', error);
          // If API fails, ask user if they want to update locally only
          Alert.alert(
            'API Error',
            'Failed to update contact on the server. Update locally only?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Update Locally', 
                onPress: async () => {
                  console.log('User chose to update locally only');
                  const updatedFriends = friends.map(friend => 
                    friend.id === currentFriendId 
                      ? { ...friend, name, phone } 
                      : friend
                  );
                  await saveFriends(updatedFriends);
                }
              }
            ]
          );
          return;
        }
      } else {
        // Add new friend
        const newFriend: Friend = {
          id: Date.now().toString(),
          name,
          phone
        };
        
        console.log('Adding new friend:', newFriend);
        
        // Simulate API add
        try {
          console.log('Attempting to add friend to API');
          const addedFriend = await addFriendToAPI(newFriend);
          
          // If API succeeds, use the returned friend (which might have a server-generated ID)
          console.log('API add successful, updating local state with:', addedFriend);
          const updatedFriends = [...friends, addedFriend];
          await saveFriends(updatedFriends);
          Alert.alert('Success', 'Contact added successfully');
        } catch (error) {
          console.error('API add failed:', error);
          // If API fails, ask user if they want to add locally only
          Alert.alert(
            'API Error',
            'Failed to add contact to the server. Add locally only?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Add Locally', 
                onPress: async () => {
                  console.log('User chose to add locally only');
                  const updatedFriends = [...friends, newFriend];
                  await saveFriends(updatedFriends);
                }
              }
            ]
          );
          return;
        }
      }
      
      // Close modal
      console.log('Operation completed, closing modal');
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving friend:', error);
      Alert.alert('Error', 'Failed to save contact');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a friend
  const deleteFriend = (id: string) => {
    console.log('Delete requested for friend id:', id);
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            console.log('User confirmed delete for id:', id);
            setIsLoading(true);
            try {
              // Simulate API delete
              try {
                console.log('Attempting to delete friend from API');
                await deleteFriendFromAPI(id);
                
                // If API delete succeeds, update local state
                console.log('API delete successful, updating local state');
                const updatedFriends = friends.filter(friend => friend.id !== id);
                await saveFriends(updatedFriends);
                Alert.alert('Success', 'Contact deleted successfully');
              } catch (error) {
                console.error('API delete failed:', error);
                // If API fails, ask user if they want to delete locally only
                Alert.alert(
                  'API Error',
                  'Failed to delete contact from the server. Delete locally only?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete Locally', 
                      onPress: async () => {
                        console.log('User chose to delete locally only');
                        const updatedFriends = friends.filter(friend => friend.id !== id);
                        await saveFriends(updatedFriends);
                      }
                    }
                  ]
                );
              }
            } catch (error) {
              console.error('Error deleting friend:', error);
              Alert.alert('Error', 'Failed to delete contact');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.phone.includes(searchQuery)
  );

  console.log('Rendering contacts list, filtered count:', filteredFriends.length);

  // Render each friend item
  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendPhone}>{item.phone}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => openEditModal(item)}
          disabled={isLoading}
        >
          <Ionicons name="pencil" size={22} color="#FE8D80" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteFriend(item.id)}
          disabled={isLoading}
        >
          <Ionicons name="trash" size={22} color="#F05050" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <View style={styles.headerL}>
            <Image source={icons.avatar} style={{width: 45, height: 45}}/>
            <Text style={{
              color:"black", 
              fontSize:20, 
              textAlign:"left", 
              marginLeft:5,
              alignSelf:"center",
              fontFamily: "Montserrat-SemiBold",
              }}>User Name</Text>
          </View>
          <View style={styles.headerR}>
             <Ionicons name="notifications" size={25} color="#F05050" style={styles.notificationIcon} />
            </View>
      </View>
      <Text style={styles.title}>Your Friends</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#F05050" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a friend..."
          value={searchQuery}
          placeholderTextColor={"gray"}
          onChangeText={(text) => {
            console.log('Search query changed:', text);
            setSearchQuery(text);
          }}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F05050" />
        </View>
      )}

      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={renderFriendItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matching contacts found' : 'No contacts added yet'}
          </Text>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={openAddModal}
        disabled={isLoading}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for adding/editing friends */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal closed via back button/gesture');
          setModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Contact' : 'Add New Contact'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log('Modal close button pressed');
                  setModalVisible(false);
                }}
                disabled={isLoading}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  console.log('Name input changed:', text);
                  setName(text);
                }}
                placeholder="Enter contact name"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                maxLength={10}
                onChangeText={(text) => {
                  console.log('Phone input changed:', text);
                  setPhone(text);
                }}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  console.log('Cancel button pressed');
                  setModalVisible(false);
                }}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  console.log('Save/Update button pressed');
                  saveFriend();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {isEditing ? 'Update' : 'Add'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection:"column", 
    backgroundColor:"white", 
  },
  header:{
    height: "5%",
    marginHorizontal:"5%",
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom:"5%",
  },
  headerL:{
    flexDirection: 'row',
  },
  headerR:{
    justifyContent:"center",
  },
  title: {
    alignSelf:"center",
    fontFamily:"Montserrat-SemiBold",
    fontSize:30,
    color:"#F05050",
    textShadowColor: 'rgba(0, 0, 0,0.25)',
    textShadowOffset: { width: 0, height: 1 }, 
    textShadowRadius: 5,
    marginBottom:"5%"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal:"5%",
    marginBottom:"7%",
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F05050",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily:"Montserrat-Medium"
  },
  friendItem: {
    backgroundColor: 'white',
    padding: 16,
    paddingHorizontal:"5%",
    marginVertical: 8,
    marginHorizontal: "5%",
    borderRadius: 25,
    borderWidth:0.8,
    borderColor:"#FE8D80",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontFamily:"Montserrat-SemiBold"
  },
  friendPhone: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontFamily:"Montserrat-Medium"
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 5,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    marginBottom:"22%",
    marginLeft:"80%",
    backgroundColor: '#F05050',
    width: "15%",
    height: "7%",
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
    fontFamily:"Montserrat-Medium"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  notificationIcon: {
    alignSelf: "flex-end",
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    borderWidth:1,
    borderColor:"#9C9C9C",
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily:"Montserrat-SemiBold"
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:"Montserrat-SemiBold",
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    fontFamily:"Montserrat-Medium",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#F05050',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    fontFamily:"Montserrat-Medium",
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily:"Montserrat-Medium",
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
});