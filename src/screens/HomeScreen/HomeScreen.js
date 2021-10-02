import React from 'react'
import { Text, View, Button, Alert } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../../firebase/config'
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

function MapaScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <MapView initialRegion={{
                latitude: 25.724301,
                longitude: -100.313123,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.01421,
            }} style={styles.mapStyle} />
        </View>
    );
}

function ProfileScreen({ navigation }) {
    let user = firebase.auth().currentUser;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{user.email}</Text>
            <Button title="Cerrar sesión" onPress={() => firebase.auth().signOut().then(function () {
                navigation.navigate('Login')
            }).catch(function (error) {
                Alert.alert(error)
            })} />
        </View>
    );
}

const Tab = createBottomTabNavigator();


export default function HomeScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Mapa') {
                        iconName = focused
                            ? 'map'
                            : 'map-o';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'vcard' : 'vcard-o';
                    }

                    // You can return any component that you like here!
                    return <FontAwesome name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'black',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Mapa" component={MapaScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    )
}



