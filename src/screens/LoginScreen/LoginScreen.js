import React, { useState, useEffect } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config'
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

export default function LoginScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [language, setlanguage] = useState('es');

    async function getData(){
        try {
            const value = await AsyncStorage.getItem('@languageSet')
            if (value == null) {
                console.log("no language set, setting one")
                await AsyncStorage.setItem('@languageSet', 'es')
                const value = await AsyncStorage.getItem('@languageSet')
                setlanguage(value)
                changeLanguagePreset()
                return
            } else {
                setlanguage(value)
                changeLanguagePreset(value)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Se necesita acceder a los permisos de ubicacion.');
        }

        let locationGet = await Location.getCurrentPositionAsync({});
        setLocation(locationGet);
    })();

    const [LANGcambiaridiomatexto, setLANGcambiaridiomatexto] = useState('Cambiar idioma a Ingles');
    const [LANGpasswordfield, setLANGpasswordfield] = useState('Contraseña');
    const [LANGIniciarses, setLANGIniciarses] = useState('Iniciar sesión');
    const [LANGNotienesunacuenta, setLANGNotienesunacuenta] = useState('¿No tienes una cuenta?');
    const [LANGregistrate, setLANGregistrate] = useState('Registrate');
    const [LANGUbicacion, setLANGUbicacion] = useState("Necesita tener ubicacion encendida para esta aplicacion.");
    const [LANGErrorVerif, setLANGErrorVerif] = useState("Error de verificacion");
    const [LANGVerifyEmail, setLANGVerifyEmail] = useState("Favor de verificar su cuenta por medio de su correo electronico.");



    function changeToSpanishLogin() {
        setLANGcambiaridiomatexto("Cambiar idioma a Ingles")
        setLANGpasswordfield("Contraseña")
        setLANGIniciarses("Iniciar sesión")
        setLANGNotienesunacuenta('¿No tienes una cuenta?')
        setLANGregistrate('Registrate')
        setLANGUbicacion("Necesita tener ubicacion encendida para esta aplicacion.")
        setLANGErrorVerif("Error de verificacion")
        setLANGVerifyEmail("Favor de verificar su cuenta por medio de su correo electronico.")
    }

    function changeToEnglishLogin() {
        setLANGcambiaridiomatexto("Change language to spanish")
        setLANGpasswordfield("Password")
        setLANGIniciarses("Log In")
        setLANGNotienesunacuenta("Don't have an account yet?")
        setLANGregistrate('Sign Up')
        setLANGUbicacion("Please turn on location services before logging in")
        setLANGErrorVerif("Verification Error")
        setLANGVerifyEmail("Please verify E-mail")
    }

    const onFooterLinkPress = () => {
        navigation.navigate('Registro', { language: language })
    }

    const onLoginPress = () => {
        if (location == null) {
            Alert.alert(LANGUbicacion)
            return
        }
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                // Listen for authentication state to change.
                firebase.auth().onAuthStateChanged((user) => {
                    if (user != null) {
                        console.log("We are authenticated now!");
                        let emailVerified = user.emailVerified;
                        if (emailVerified === true) {
                            navigation.navigate('Home', { user: user, location: location, language: language })
                        }
                        else {
                            Alert.alert(
                                LANGErrorVerif,
                                LANGVerifyEmail,
                                [
                                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                                ]
                            )
                            return
                        }
                    }

                    // Do other things
                });


            })
            .catch(error => {
                alert(error)
            })
    }

    function changeLanguagePreset(presetlanguage) {
        if (presetlanguage == 'es') {
            changeToSpanishLogin()
            return
        }
        if (presetlanguage == 'en') {
            changeToEnglishLogin()
        }
    }

    async function changeLanguage() {
        if (language == 'es') {
            setlanguage('en');
            changeToEnglishLogin()
            await AsyncStorage.setItem('@languageSet', 'en')
            Updates.reloadAsync()
            return
        }
        if (language == 'en') {
            setlanguage('es');
            changeToSpanishLogin()
            await AsyncStorage.setItem('@languageSet', 'es')
            Updates.reloadAsync()
        }
    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/soccer-free.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder={LANGpasswordfield}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>{LANGIniciarses}</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>{LANGNotienesunacuenta}<Text onPress={onFooterLinkPress} style={styles.footerLink}> {LANGregistrate}</Text></Text>
                </View>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}><Text onPress={() => changeLanguage()} style={styles.footerLink}>{LANGcambiaridiomatexto}</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}