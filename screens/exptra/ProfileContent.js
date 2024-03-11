import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { firebase } from "../../firebase";

const ProfileContent = (props) => {
  const { navigation } = props;
  const auth = firebase.getAuth();

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.title}>Exptra</Text>
        <Text>Email: {auth.currentUser?.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <Button title="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileContent;
