import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../../firebase/config'
import { StyleSheet, Dimensions, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState, useEffect, Component } from 'react'
import { SafeAreaView, Platform, Image, TextInput, TouchableOpacity, View, Alert, ToastAndroid } from 'react-native'
import styles from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import * as Drawer2 from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Text,
    TouchableRipple,
    Switch,
    ActivityIndicator
} from 'react-native-paper';
import { Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

const googleAPIKey = 'AIzaSyC7kwR1SH6Gr9hZJd0Mg-Z7QWNuTWwByyQ'
// const initLat = 25.724301;
// const initLon = -100.313123;
let radius = 4 * 1000;

const styles2 = StyleSheet.create({
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

const stylesDrawer = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 13,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 2
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 2
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

function DrawerContent(props, route) {
    let language = props.routes.language
    let user = props.routes.user
    const [image, setImage] = useState((Image.resolveAssetSource(require('../../../assets/soccer-player.png')).uri))

    useEffect(() => {
        const fire = firebase.database().ref("users/" + user.uid + "/" + "profile_image").on('value', (snapshot) => {
            let image_database = snapshot.val()
            let image_locationInitial = image_database.profile_image
            setImage(image_locationInitial)
        });
        // Clean-up function
        return () => fire
    }, []);


    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={stylesDrawer.drawerContent}>
                    <View style={stylesDrawer.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={{ uri: image }}
                                size={50}
                            />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Title style={stylesDrawer.title}>{user.displayName}</Title>
                                <Caption style={stylesDrawer.caption}>{user.email}</Caption>
                            </View>
                        </View>

                        {/* <View style={stylesDrawer.row}>
                            <View style={stylesDrawer.section}>
                                <Paragraph style={[stylesDrawer.paragraph, stylesDrawer.caption]}>80</Paragraph>
                                <Caption style={stylesDrawer.caption}>Following</Caption>
                            </View>
                            <View style={stylesDrawer.section}>
                                <Paragraph style={[stylesDrawer.paragraph, stylesDrawer.caption]}>100</Paragraph>
                                <Caption style={stylesDrawer.caption}>Followers</Caption>
                            </View>
                        </View> */}
                    </View>

                    <Drawer2.Drawer.Section title={language.drawerLABELRetas} style={stylesDrawer.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="plus-box-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={language.drawerTABanadir}
                            onPress={() => { props.navigation.navigate('Añadir reta') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="soccer-field"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={language.drawerTABpartidos}
                            onPress={() => { props.navigation.navigate('Partidos') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="soccer"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={language.drawerTABtuspartidos}
                            onPress={() => { props.navigation.navigate('TusPartidos') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="map-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={language.drawerTABMapa}
                            onPress={() => { props.navigation.navigate('MapaMain') }}
                        />
                    </Drawer2.Drawer.Section>
                    <Drawer2.Drawer.Section title={language.drawerLABELUsuario}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="face-profile"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={language.drawerTABPerfil}
                            onPress={() => { props.navigation.navigate('Perfil') }}
                        />
                    </Drawer2.Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer2.Drawer.Section style={stylesDrawer.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label={language.drawerTABCerrarS}
                    onPress={() => firebase.auth().signOut().then(function () {
                        props.navigation.toggleDrawer()
                        props.navigation.navigate('Login')
                        ToastAndroid.show(language.drawerTOASTCerrar, ToastAndroid.LONG)
                    }).catch(function (error) {
                        Alert.alert(error)
                    })}
                />
            </Drawer2.Drawer.Section>
        </View>
    );
}

function MapaScreen({ route, navigation }) {
    let language = route.params.language
    const location = route.params.location

    const [region, setRegion] = useState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.01421,
    });

    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + region.latitude + ',' + region.longitude + '&radius=' + radius + '&keyword=soccerfield' + '&key=' + googleAPIKey
    console.log(url)
    const [ViewsCanchas, setViewsCanchas] = useState([]);

    function actualizarCanchas() {
        let postsArray = [];

        let places = []
        fetch(url)
            .then(res => {
                return res.json();
                
            })
            .then(res => {
                for (let googlePlace of res.results) {
                    var place = {};
                    var myLat = googlePlace.geometry.location.lat;
                    var myLong = googlePlace.geometry.location.lng;
                    var coordinate = {
                        latitude: myLat,
                        longitude: myLong,
                    };
                    place['placeTypes'] = googlePlace.types;
                    place['coordinate'] = coordinate;
                    place['placeId'] = googlePlace.place_id;
                    place['placeName'] = googlePlace.name;
                    places.push(place);
                }
                // Show all the places around 4 km from San Francisco.
                // console.log(
                //     'Canchas de futbol:' +
                //     places.map(nearbyPlaces => nearbyPlaces.placeName + nearbyPlaces.coordinate.latitude + nearbyPlaces.coordinate.longitude)
                // );
                let i;
                for (i = 0; i < places.length; i++) {
                    postsArray.push(
                        <Marker key={i}
                            coordinate={{
                                latitude: places[i].coordinate.latitude,
                                longitude: places[i].coordinate.longitude,
                            }}
                            onCalloutPress={(e) => navigation.navigate('Añadir reta', { markerLocation: e.nativeEvent.coordinate })}
                            title={places[i].placeName}
                            description={language.canchadefutbol}
                        />
                    )
                }
                setViewsCanchas(postsArray)

            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        actualizarCanchas()
    }, []);


    return (
        <View>
            <MapView initialRegion={region} onRegionChangeComplete={region => setRegion(region)} style={styles2.mapStyle}>
                {ViewsCanchas}</MapView >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => navigation.toggleDrawer()}>
                    <Text style={styles.buttonTitle}>   Menu   </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actualizarButton}
                    onPress={() => actualizarCanchas()}>
                    <Text style={styles.buttonTitle}>   {language.actualizar}  </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662

    let uuid = uuidv4()

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebase
        .storage()
        .ref()
        .child(uuid);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
}

function PerfilScreen({ route, navigation }) {
    let language = route.params.language
    let user = route.params.user
    const [image, setImage] = useState((Image.resolveAssetSource(require('../../../assets/soccer-player.png')).uri))
    let [uploading, setUploading] = useState(false);
    const [image_url, setimage_url] = useState(null)

    async function restartAndChangeLanguage() {
        if (language == 'es') {
            await AsyncStorage.setItem('@languageSet', 'en')
            Alert.alert("App is going to restart")
            Updates.reloadAsync()
            return
        }
        if (language == 'en') {
            await AsyncStorage.setItem('@languageSet', 'es')
            Alert.alert("La aplicacion se va a reiniciar")
            Updates.reloadAsync()
        }
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert(language.perfil_permisoscamara);
                }
            }
        })();

        const fire = firebase.database().ref("users/" + user.uid + "/" + "profile_image").on('value', (snapshot) => {
            let image_database = snapshot.val()
            let image_locationInitial = image_database.profile_image
            setImage(image_locationInitial)
        });
        // Clean-up function
        return () => fire
    }, []);

    _handleImagePicked = async pickerResult => {
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                console.log(uploadUrl)
                setimage_url(uploadUrl)
                var profile_image = firebase.database().ref("users/" + user.uid + "/" + "profile_image")

                profile_image.set({
                    profile_image: uploadUrl,
                })
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            setUploading(false)
            return
        }
    };

    const _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 0.4,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }

        _handleImagePicked(result);
    };


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {image && <Image source={{ uri: image }} style={styles.logo} />}
                <Text onPress={_pickImage} style={styles.footerLink}> {<Feather name="edit" size={24} color="black" />}{language.perfil_changepicture}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center' }}><AntDesign name="profile" size={30} color="black" /></Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                </View>

                <Text style={styles.text}> <FontAwesome name="user" size={18} color="black" /> {user.displayName}</Text>
                <Text style={styles.text}> <MaterialIcons name="email" size={18} color="black" /> {user.email}</Text>
                {/* <Text style={styles.text}> <FontAwesome name="phone" size={24} color="black" /> 899 - 233 - 3942</Text> */}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => firebase.auth().signOut().then(function () {
                        navigation.navigate('Login')
                        ToastAndroid.show(language.drawerTOASTCerrar, ToastAndroid.LONG)
                    }).catch(function (error) {
                        Alert.alert(error)
                    })}>
                    <Text style={styles.buttonTitle}>{language.drawerTABCerrarS}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    );
}

function AddPartidaScreen({ route, navigation }) {
    let language = route.params.language
    let user = route.params.user
    let useruid = route.params.user.uid
    const [titulo, setTitulo] = useState(null)
    const [descripcion, setDescripcion] = useState(null)
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dia, setdia] = useState(null);
    const [mes, setmes] = useState(null);
    const [anio, setanio] = useState(null);
    const [hora, sethora] = useState(null);
    const [minutos, setminutos] = useState(null);
    const [location, setLocation] = useState(null);

    (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Se necesita acceder a los permisos de ubicacion.');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    })();

    // https://www.w3schools.com/jsref/jsref_obj_date.asp

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setdia(date.getDate())
        setmes(date.getMonth())
        setanio(date.getFullYear())
        sethora(date.getHours())
        setminutos(date.getMinutes())
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    
    function storePartido(useruid, titulo, descripcion) {
        // if(titulo || descripcion == null){
        //     alert("Eliga un titulo o descripcion")
        //     return
        // }

        if (route.params.markerLocation == undefined) {
            Alert.alert(language.addlocationplease);
            return
        }

        markerLocation = route.params.markerLocation

        const latitude = markerLocation.latitude
        const longitude = markerLocation.longitude

        var postsRef = firebase.database().ref("partidos");

        var newPostRef = postsRef.push();

        var postId = newPostRef.key;

        newPostRef.set({
            postId: postId,
            usuarioDisplayName: user.displayName,
            usuario: useruid,
            titulo: titulo,
            descripcion: descripcion,
            location: {
                latitude: latitude,
                longitude: longitude
            },
            dia: dia,
            mes: mes,
            anio: anio,
            hora: hora,
            minutos: minutos,
            usuarios: [useruid],
            usuariosDisplayName: [user.displayName]
        });

        var usersRef = firebase.database().ref("users/" + useruid + "/" + "partidos/" + postId)

        usersRef.set({
            postId: postId,
            usuarioDisplayName: user.displayName,
            usuario: useruid,
            titulo: titulo,
            descripcion: descripcion,
            location: {
                latitude: latitude,
                longitude: longitude
            },
            dia: dia,
            mes: mes,
            anio: anio,
            hora: hora,
            minutos: minutos,
            usuarios: [useruid],
            usuariosDisplayName: [user.displayName]
        });

        ToastAndroid.show(language.partidoadded, ToastAndroid.LONG)
        navigation.navigate("Partidos")
    }
    
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logoAdd}
                    source={require('../../../assets/soccer-field.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder={language.addtitulo}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setTitulo(text)}
                    value={titulo}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder={language.adddescription}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setDescripcion(text)}
                    value={descripcion}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <View>
                    <TouchableOpacity
                        style={styles.buttonFecha}
                        onPress={showDatepicker}>
                        <Text style={styles.buttonTitle}>{language.selectFecha}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.buttonHora}
                        onPress={showTimepicker}>
                        <Text style={styles.buttonTitle}>{language.selectHora}</Text>
                    </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        display="default"
                        onChange={onChange}
                        minimumDate={new Date()}
                    />
                )}
                <TouchableOpacity
                    style={styles.buttonUbicacion}
                    onPress={() => navigation.navigate('Mapa')}
                >
                    <Text style={styles.buttonTitle}>{language.selectUbicacion}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button3}
                    onPress={() => storePartido(useruid, titulo, descripcion, dia, mes, anio, hora, minutos)}>
                    <Text style={styles.buttonTitle}>{language.addPartido}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}



function MapaMain({ route, navigation }) {
    let language = route.params.language
    let location = route.params.location.coords
    const [postsMarkers, setpostsMarkers] = useState([]);

    useEffect(() => {
        const fire = firebase.database().ref('partidos').on('value', (snapshot) => {
            let posts = snapshot.val()
            let postsArray = [];
            let date = new Date().getDate()//Current Date
            var month = new Date().getMonth(); //Current Month
            var year = new Date().getFullYear(); //Current Year

            for (const uid in posts) {
                if (year <= posts[uid].anio && month <= posts[uid].mes && date <= posts[uid].dia) {
                    currentPost = posts[uid]
                    postsArray.push(
                        <Marker key={uid}
                            coordinate={{
                                latitude: posts[uid].location.latitude,
                                longitude: posts[uid].location.longitude,
                            }}
                            description={language.canchadefutbol}
                            onCalloutPress={() => { navigation.navigate('ParqueView', [posts[uid]]) }}
                            title={posts[uid].titulo}
                        ></Marker>
                    )
                }
            }

            setpostsMarkers(postsArray)
        });
        // Clean-up function
        return () => fire
    }, []);

    return (
        <View>
            <MapView initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.01421,
            }} style={styles2.mapStyle}>{postsMarkers}
            </MapView >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.menuButton2}
                    onPress={() => navigation.toggleDrawer()}>
                    <Text style={styles.buttonTitle}>   Menu   </Text>
                </TouchableOpacity>
            </View></View>
    );
}

function ParqueView({ route, navigation }) {
    let language = route.params.language
    const [fposts, setFposts] = useState([]);
    const post = route.params[0].location
    const latitude = post.latitude
    const longitude = post.longitude

    let date = new Date().getDate()//Current Date
    var month = new Date().getMonth(); //Current Month
    var year = new Date().getFullYear(); //Current Year

    useEffect(() => {
        const fire = firebase.database().ref('partidos').on('value', (snapshot) => {
            let posts = snapshot.val()
            let postsArray = [];

            for (const uid in posts) {
                console.log(posts[uid].anio, posts[uid].month, posts[uid].dia)
                if (year <= posts[uid].anio && month <= posts[uid].mes && date <= posts[uid].dia) {
                    currentPost = posts[uid]
                    postsArray.push(
                        <Card containerStyle={{ width: Dimensions.get('window').width - 35 }}>
                            <Card.Title>{posts[uid].titulo}</Card.Title>
                            <Card.Divider />
                            <Card.Title>{language.descripcion}</Card.Title>
                            <Text style={{ alignItems: 'center', marginBottom: 10 }}>
                                {posts[uid].descripcion}
                            </Text>

                            <Card.Divider />
                            <Text style={styles.footerText2}>{language.retade} <FontAwesome5 style={styles.footerText2} name="user-circle" size={15} color="black" /> {posts[uid].usuarioDisplayName} </Text>
                            <Card.Divider />
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={() => { navigation.navigate('Reta', [posts[uid]]) }}>
                                <Text style={styles.buttonTitle}>{language.reta}</Text>
                            </TouchableOpacity>
                        </Card>
                    )
                }
            }

            setFposts(postsArray)
        });
        // Clean-up function
        return () => fire
    }, [post]);

    return (
        <SafeAreaView style={styles.containerCard}>
            <View style={styles.container2}>
                <Text style={styles.cardTitle2}>{language.parque}</Text>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">{fposts}
                </KeyboardAwareScrollView>

            </View>
        </SafeAreaView>
    );
}


function retaScreen({ route, navigation }) {
    let language = route.params.language
    const user = route.params.user
    const post = route.params[0]

    function unirse() {
        firebase.database().ref('partidos/' + post.postId).on('value', (snapshot) => {
            let postInfo = snapshot.val()
            let usuariosUID = postInfo.usuarios
            let usuariosDisplay = postInfo.usuariosDisplayName
            let isUser = false
            function checarUID(item, index) {
                if (item == user.uid) {
                    isUser = true
                    return
                }
            }
            usuariosUID.forEach(checarUID)
            usuariosUID.forEach(checarUID)

            if (isUser == true) {
                ToastAndroid.show(language.yaestaunido, ToastAndroid.LONG)
                return
            }

            usuariosUID.push(user.uid)
            usuariosDisplay.push(user.displayName)
            var postsRef = firebase.database().ref("partidos/" + post.postId);

            postsRef.set({
                postId: post.postId,
                usuarioDisplayName: post.usuarioDisplayName,
                usuario: post.usuario,
                titulo: post.titulo,
                descripcion: post.descripcion,
                location: {
                    latitude: post.location.latitude,
                    longitude: post.location.longitude
                },
                dia: post.dia,
                mes: post.mes,
                anio: post.anio,
                hora: post.hora,
                minutos: post.minutos,
                usuarios: usuariosUID,
                usuariosDisplayName: usuariosDisplay
            });
            postsRef = firebase.database().ref("users/" + post.usuario + "/partidos/" + post.postId)
            postsRef.set({
                postId: post.postId,
                usuarioDisplayName: post.usuarioDisplayName,
                usuario: post.usuario,
                titulo: post.titulo,
                descripcion: post.descripcion,
                location: {
                    latitude: post.location.latitude,
                    longitude: post.location.longitude
                },
                dia: post.dia,
                mes: post.mes,
                anio: post.anio,
                hora: post.hora,
                minutos: post.minutos,
                usuarios: usuariosUID,
                usuariosDisplayName: usuariosDisplay
            });
            postsRef = firebase.database().ref("users/" + user.uid + "/unidos/" + post.postId)

            postsRef.set({
                postId: post.postId,
                usuarioDisplayName: post.usuarioDisplayName,
                usuario: post.usuario,
                titulo: post.titulo,
                descripcion: post.descripcion,
                location: {
                    latitude: post.location.latitude,
                    longitude: post.location.longitude
                },
                dia: post.dia,
                mes: post.mes,
                anio: post.anio,
                hora: post.hora,
                minutos: post.minutos,
                usuarios: usuariosUID,
                usuariosDisplayName: usuariosDisplay
            });


        })
    }

    function isUser() {
        if (user.uid == post.usuario) {
            return
        } else {
            return (
                <TouchableOpacity
                    style={styles.button3}
                    onPress={unirse}>
                    <Text style={styles.buttonTitle}>Unirse</Text>
                </TouchableOpacity>
            )
        }
    }

    function usuariosDisplayAll() {
        viewDisplayNames = []
        for (name in post.usuariosDisplayName) {
            viewDisplayNames.push(
                <Text>{post.usuariosDisplayName[name]}</Text>
            )
        }
        return viewDisplayNames
    }

    return (
        <View style={styles.containerCard2}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Text style={styles.cardTitle}>{post.titulo}</Text>
                {/* <Image source={{ uri: post.image_location }} style={styles.logoAnimal} /> */}
                <Text style={styles.textImage2}><MaterialIcons name="date-range" size={24} color="black" /> {language.date} {post.dia + "/" + (parseInt(post.mes, 10) + 1) + "/" + post.anio}</Text>
                <Text style={styles.textImage2}><Ionicons name="md-time" size={24} color="black" /> {language.time} {post.hora + ":" + post.minutos}</Text>
                <Text style={styles.textImage2}><FontAwesome5 style={styles.footerText2} name="user-circle" size={24} color="black" /> {language.retade} {post.usuarioDisplayName}</Text>
                {/* <Text style={styles.textImage2}><MaterialIcons name="location-on" size={20} color="black" /> Monterrey, Nuevo Leon </Text> */}
                <Text style={styles.cardTitleDescripcion}>{language.descripcion}:</Text>
                <Card >
                    <Text>{post.descripcion}</Text>
                </Card>
                <Text style={styles.cardTitleDescripcion}>{language.usuarios}</Text>
                <Card >
                    {usuariosDisplayAll()}
                </Card>
                {isUser()}
            </KeyboardAwareScrollView>
        </View>
    )
}

function PartidosScreen({ route, navigation }) {
    let language = route.params.language
    const [fposts, setFposts] = useState([]);
    let date = new Date().getDate()//Current Date
    var month = new Date().getMonth(); //Current Month
    var year = new Date().getFullYear(); //Current Year


    useEffect(() => {
        const fire = firebase.database().ref('partidos').on('value', (snapshot) => {
            let posts = snapshot.val()
            let postsArray = [];

            for (const uid in posts) {
                console.log(posts[uid].anio, posts[uid].month, posts[uid].dia)
                if (year <= posts[uid].anio && month <= posts[uid].mes && date <= posts[uid].dia) {
                    currentPost = posts[uid]
                    postsArray.push(
                        <Card containerStyle={{ width: Dimensions.get('window').width - 35 }}>
                            <Card.Title>{posts[uid].titulo}</Card.Title>
                            <Card.Divider />
                            <Card.Title>{language.descripcion}</Card.Title>
                            <Text style={{ alignItems: 'center', marginBottom: 10 }}>
                                {posts[uid].descripcion}
                            </Text>

                            <Card.Divider />
                            <Text style={styles.footerText2}>{language.retade} <FontAwesome5 style={styles.footerText2} name="user-circle" size={15} color="black" /> {posts[uid].usuarioDisplayName} </Text>
                            <Card.Divider />
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={() => { navigation.navigate('Reta', [posts[uid]]) }}>
                                <Text style={styles.buttonTitle}>{language.reta}</Text>
                            </TouchableOpacity>
                        </Card>
                    )
                }
            }

            setFposts(postsArray)
        });
        // Clean-up function
        return () => fire
    }, []);

    return (
        <SafeAreaView style={styles.containerCard}>
            <View style={styles.container2}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">{fposts}
                </KeyboardAwareScrollView>

            </View>
        </SafeAreaView>
    );
}

function TusPartidos({ route, navigation }) {
    let language = route.params.language
    const user = route.params.user
    const [fposts, setFposts] = useState([]);

    useEffect(() => {
        const fire = firebase.database().ref('users/' + user.uid + "/partidos").on('value', (snapshot) => {
            let posts = snapshot.val()
            let postsArray = [];
            let date = new Date().getDate()//Current Date
            var month = new Date().getMonth(); //Current Month
            var year = new Date().getFullYear(); //Current Year

            for (const uid in posts) {
                currentPost = posts[uid]
                if (year <= posts[uid].anio && month <= posts[uid].mes && date <= posts[uid].dia) {
                    postsArray.unshift(
                        <Card containerStyle={{ width: Dimensions.get('window').width - 35 }}>
                            <Card.Title>{posts[uid].titulo}</Card.Title>
                            <Card.Divider />
                            <Text style={{ alignItems: 'center', marginBottom: 10 }}>
                                {posts[uid].descripcion}

                            </Text>
                            <Card.Divider />
                            <Text style={styles.footerText2}>{language.retade} <FontAwesome5 style={styles.footerText2} name="user-circle" size={15} color="black" /> {posts[uid].usuarioDisplayName} </Text>
                            <Card.Divider />
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={() => { navigation.navigate('TusPartidosView', [posts[uid]]) }}>
                                <Text style={styles.buttonTitle}>{language.reta}</Text>
                            </TouchableOpacity>
                        </Card>
                    )
                    continue
                }

                // partidos que ya pasaron fecha.

                postsArray.push(
                    <Card containerStyle={{ backgroundColor: '#e8e8e8', width: Dimensions.get('window').width - 35 }}>
                        <Card.Title>{posts[uid].titulo}</Card.Title>
                        <Card.Divider />
                        <Text style={{ alignItems: 'center', marginBottom: 10 }}>
                            {posts[uid].descripcion}

                        </Text>
                        <Card.Divider />
                        <Text style={styles.footerText2}>{language.retade} <FontAwesome5 style={styles.footerText2} name="user-circle" size={15} color="black" /> {posts[uid].usuarioDisplayName} </Text>
                        <Card.Divider />
                        <TouchableOpacity
                            style={styles.buttonFade}
                            onPress={() => { navigation.navigate('RetaDone', [posts[uid]]) }}>
                            <Text style={styles.buttonTitle}>{language.reta}</Text>
                        </TouchableOpacity>
                    </Card>
                )

            }

            firebase.database().ref('users/' + user.uid + "/unidos").on('value', (snapshot2) => {
                let posts2 = snapshot2.val()
                for (const uid in posts2) {
                    if (year <= posts2[uid].anio && month <= posts2[uid].mes && date <= posts2[uid].dia) {
                        postsArray.unshift(
                            <Card containerStyle={{ width: Dimensions.get('window').width - 35 }}>
                                <Card.Title>{posts2[uid].titulo}</Card.Title>
                                <Card.Divider />
                                <Text style={{ alignItems: 'center', marginBottom: 10 }}>
                                    {posts2[uid].descripcion}

                                </Text>
                                <Card.Divider />
                                <Text style={styles.footerText2}>{language.retade} <FontAwesome5 style={styles.footerText2} name="user-circle" size={15} color="black" /> {posts2[uid].usuarioDisplayName} </Text>
                                <Card.Divider />
                                <TouchableOpacity
                                    style={styles.button2}
                                    onPress={() => { navigation.navigate('Reta', [posts2[uid]]) }}>
                                    <Text style={styles.buttonTitle}>{language.reta}</Text>
                                </TouchableOpacity>
                            </Card>
                        )
                        continue;
                    }

                    // partidos que ya pasaron fecha.

                    postsArray.push(
                        <Card containerStyle={{ backgroundColor: '#e8e8e8', width: Dimensions.get('window').width - 35 }}>
                            <Card.Title>{posts2[uid].titulo}</Card.Title>
                            <Card.Divider />
                            <Text style={{ alignItems: 'center', marginBottom: 10 }}>
                                {posts2[uid].descripcion}

                            </Text>
                            <Card.Divider />
                            <Text style={styles.footerText2}>{language.retade} <FontAwesome5 style={styles.footerText2} name="user-circle" size={15} color="black" /> {posts2[uid].usuarioDisplayName} </Text>
                            <Card.Divider />
                            <TouchableOpacity
                                style={styles.buttonFade}
                                onPress={() => { navigation.navigate('RetaDone', [posts2[uid]]) }}>
                                <Text style={styles.buttonTitle}>{language.reta}</Text>
                            </TouchableOpacity>
                        </Card>
                    )

                }



                setFposts(postsArray)
            })
        });


        // Clean-up function
        return () => fire
    }, []);

    return (
        <SafeAreaView style={styles.containerCard}>
            <View style={styles.container2}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">{fposts}
                </KeyboardAwareScrollView>

            </View>
        </SafeAreaView>
    );
}

function TusPartidosView({ route, navigation }) {
    let language = route.params.language
    const post = route.params[0]

    function removerPost() {
        for (const i in post.usuarios) {
            if (post.usuarios[i] != post.usuario) {
                firebase.database().ref("users/" + post.usuarios[i] + "/" + "unidos/" + post.postId).remove()
            }
        }
        firebase.database().ref("users/" + post.usuario + "/" + "partidos/" + post.postId).remove()
        firebase.database().ref("partidos/" + post.postId).remove()
        ToastAndroid.show(language.TOASTborrarpartido, ToastAndroid.LONG)
        navigation.navigate("TusPartidos")

    }

    function usuariosDisplayAll() {
        viewDisplayNames = []
        for (name in post.usuariosDisplayName) {
            viewDisplayNames.push(
                <Text>{post.usuariosDisplayName[name]}</Text>
            )
        }
        return viewDisplayNames
    }

    return (
        <View style={styles.containerCard2}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Text style={styles.cardTitle}>{post.titulo}</Text>
                {/* <Image source={{ uri: post.image_location }} style={styles.logoAnimal} /> */}
                <Text style={styles.textImage2}><MaterialIcons name="date-range" size={24} color="black" /> {language.date} {post.dia + "/" + (parseInt(post.mes, 10) + 1) + "/" + post.anio}</Text>
                <Text style={styles.textImage2}><Ionicons name="md-time" size={24} color="black" /> {language.time} {post.hora + ":" + post.minutos}</Text>
                <Text style={styles.textImage2}><FontAwesome5 style={styles.footerText2} name="user-circle" size={24} color="black" /> {language.retade} {post.usuarioDisplayName}</Text>
                {/* <Text style={styles.textImage2}><MaterialIcons name="location-on" size={20} color="black" /> Monterrey, Nuevo Leon </Text> */}
                <Text style={styles.cardTitleDescripcion}>{language.descripcion}:</Text>
                <Card >
                    <Text>{post.descripcion}</Text>
                </Card>
                <Text style={styles.cardTitleDescripcion}>{language.usuarios}</Text>
                <Card >
                    {usuariosDisplayAll()}
                </Card>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => removerPost()}>
                    <Text style={styles.buttonTitle}>{language.borrarpartido}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}

function retaScreenDone({ route, navigation }) {
    let language = route.params.language
    const post = route.params[0]

    function usuariosDisplayAll() {
        viewDisplayNames = []
        for (name in post.usuariosDisplayName) {
            viewDisplayNames.push(
                <Text>{post.usuariosDisplayName[name]}</Text>
            )
        }
        return viewDisplayNames
    }

    return (
        <View style={styles.containerCard2}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Text style={styles.cardTitle}>{post.titulo}</Text>
                {/* <Image source={{ uri: post.image_location }} style={styles.logoAnimal} /> */}
                <Text style={styles.textImage2}><MaterialIcons name="date-range" size={24} color="black" /> {language.date} {post.dia + "/" + (parseInt(post.mes, 10) + 1) + "/" + post.anio}</Text>
                <Text style={styles.textImage2}><Ionicons name="md-time" size={24} color="black" /> {language.time} {post.hora + ":" + post.minutos}</Text>
                <Text style={styles.textImage2}><FontAwesome5 style={styles.footerText2} name="user-circle" size={24} color="black" /> {language.retade}: {post.usuarioDisplayName}</Text>
                {/* <Text style={styles.textImage2}><MaterialIcons name="location-on" size={20} color="black" /> Monterrey, Nuevo Leon </Text> */}

                <Text style={styles.cardTitleDone}>{language.fueradefecha}</Text>
                <Text style={styles.cardTitleDescripcion}>{language.descripcion}:</Text>
                <Card >
                    <Text>{post.descripcion}</Text>
                </Card>
                <Text style={styles.cardTitleDescripcion}>{language.usuarios}</Text>
                <Card >
                    {usuariosDisplayAll()}
                </Card>
            </KeyboardAwareScrollView>
        </View>
    )
}

const Drawer = createDrawerNavigator();

export default function HomeScreen(route, navigation) {
    const user = route.route.params.user
    const location = route.route.params.location
    let language = route.route.params.language
    let languageObject = {}

    let languageDictES = {
        parque: "Partidos en este parque:",
        descripcion: "Descripcion",
        reta: "Ver reta",
        retade: "Reta de:",
        drawerLABELRetas: "Retas",
        drawerTABanadir: "Añadir reta",
        drawerTABpartidos: "Partidos",
        drawerTABtuspartidos: "Tus Partidos",
        drawerTABMapa: "Mapa",
        drawerLABELUsuario: "Usuario",
        drawerTABPerfil: "Perfil",
        drawerTABCerrarS: "Cerrar Sesion",
        drawerTOASTCerrar: "Se ha cerrado la sesión",
        perfil_permisoscamara: 'Se necesitan permisos de camara!',
        perfil_changepicture: 'Editar imagen',
        date: 'Fecha:',
        time: "Hora:",
        usuarios: "Usuarios",
        borrarpartido: "Borrar partido",
        TOASTborrarpartido: "Se ha borrado el partido",
        fueradefecha: "Fuera de fecha",
        yaestaunido: "Ya esta unido a este partido!",
        addtitulo: "Añadir titulo",
        adddescription: "Añadir descripcion",
        selectFecha: "Elegir fecha",
        selectHora: "Elegir hora",
        selectUbicacion: "Elegir ubicacion",
        addPartido: "Añadir partido",
        partidoadded: "Se añadio el partido!",
        addlocationplease: "Porfavor, añade una ubicacion de cancha",
        actualizar: "Actualizar",
        canchadefutbol: "Cancha de futbol",
    }

    let languageDictEN = {
        parque: "Matches in this park:",
        descripcion: "Description",
        reta: "See match",
        retade: "Match by:",
        drawerLABELRetas: "Matches",
        drawerTABanadir: "Add match",
        drawerTABpartidos: "Matches",
        drawerTABtuspartidos: "Your matches",
        drawerTABMapa: "Map",
        drawerLABELUsuario: "User",
        drawerTABPerfil: "Profile",
        drawerTABCerrarS: "Log out",
        drawerTOASTCerrar: "You have logged out",
        perfil_permisoscamara: 'Please enable camera services',
        perfil_changepicture: 'Edit picture',
        date: 'Date:',
        time: "Time:",
        usuarios: "Users",
        borrarpartido: "Delete match",
        TOASTborrarpartido: "Match has been deleted",
        fueradefecha: "Match expired",
        yaestaunido: "Just joined the match!",
        addtitulo: "Add title",
        adddescription: "Add description",
        selectFecha: "Select date",
        selectHora: "Select time",
        selectUbicacion: "Select location",
        addPartido: "Add match",
        partidoadded: "Match added!",
        addlocationplease: "Please add a park location",
        actualizar: "Refresh",
        canchadefutbol: "Soccer park",
    }

    if (language == "es") {
        languageObject = languageDictES
    } else {
        languageObject = languageDictEN
    }

    const object = {
        user: user,
        language: languageObject
    }
    return (
        <Drawer.Navigator initialRouteName="Perfil" drawerType="slide" drawerContent={props => <DrawerContent {...props} routes={object} />}>
            <Drawer.Screen name="Añadir reta" component={AddPartidaScreen} initialParams={{ user, language: languageObject }} />
            <Drawer.Screen name="ParqueView" component={ParqueView} initialParams={{ user: user, location: location, language: languageObject }} />
            <Drawer.Screen name="Mapa" component={MapaScreen} initialParams={{ user: user, location: location, language: languageObject }} />
            <Drawer.Screen name="MapaMain" component={MapaMain} initialParams={{ user: user, location: location, language: languageObject }} />
            <Drawer.Screen name="Perfil" component={PerfilScreen} initialParams={{ user, language: languageObject }} />
            <Drawer.Screen name="Partidos" component={PartidosScreen} initialParams={{ user, language: languageObject }} />
            <Drawer.Screen name="TusPartidos" component={TusPartidos} initialParams={{ user, language: languageObject }} />
            <Drawer.Screen name="TusPartidosView" component={TusPartidosView} initialParams={{ language: languageObject }} />
            <Drawer.Screen name="Reta" component={retaScreen} initialParams={{ user, language: languageObject }} />
            <Drawer.Screen name="RetaDone" component={retaScreenDone} initialParams={{ user, language: languageObject }} />
        </Drawer.Navigator>
    );
}