import React, { useState, useEffect } from 'react'
import { Platform, Image, Text, TextInput, TouchableOpacity, View, Alert, ToastAndroid } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function RegistrationScreen({route, navigation }) {
    const language = route.params.language
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [LANGpasswordfield, setLANGpasswordfield] = useState('Contraseña');
    const [LANGNombreField, setLANGNombreField] = useState('Nombre');
    const [LANGConfirmarC, setLANGConfirmarC] = useState('Confirmar contraseña');
    const [LANGCrearCuenta, setLANGCrearCuenta] = useState('Crear una cuenta');
    const [LANGYatienesunaC, setLANGYatienesunaC] = useState('¿Ya tienes una cuenta?');
    const [LANGiniciarses, setLANGiniciarses] = useState('Iniciar sesion');
    const [LANGContranocoinciden, setLANGContranocoinciden] = useState('Las contraseñas no coinciden.');
    const [LANGCorreoVerif, setLANGCorreoVerif] = useState('Se ha enviado un correo de verificación a tu dirección de correo electrónico. Por favor, revisa to correo para terminar de crear tu cuenta');

    function changeToSpanishLogin() {
        setLANGpasswordfield("Contraseña")
        setLANGNombreField("Nombre")
        setLANGConfirmarC("Confirmar contraseña")
        setLANGCrearCuenta("Crear una cuenta")
        setLANGYatienesunaC("¿Ya tienes una cuenta?")
        setLANGiniciarses("Iniciar sesion")
        setLANGContranocoinciden('Las contraseñas no coinciden.')
        setLANGCorreoVerif("Se ha enviado un correo de verificación a tu dirección de correo electrónico. Por favor, revisa to correo para terminar de crear tu cuenta")
    }

    function changeToEnglishLogin() {
        setLANGpasswordfield("Password")
        setLANGNombreField("Name")
        setLANGConfirmarC("Confirm Password")
        setLANGCrearCuenta("Create an account")
        setLANGYatienesunaC("Already have an account?")
        setLANGiniciarses("Log in")
        setLANGContranocoinciden("Passwords don't match. Try again.")
        setLANGCorreoVerif("An E-mail has been sent. Please check to access your account.")
    }


    function changeLanguagePreset(){
        if (language == 'es') {
            changeToSpanishLogin()
            return
        }
        if (language == 'en') {
            changeToEnglishLogin()
        }
    }

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const VerificacionToast = () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(LANGCorreoVerif, ToastAndroid.LONG);
        }
        var user = firebase.auth().currentUser;

        user.sendEmailVerification().then(function () {
            // Email sent.
        }).catch(function (error) {
            // An error happened.
        });
    };

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert(LANGContranocoinciden)
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: fullName
                }).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error happened.
                });
                var profile_image = firebase.database().ref("users/" + user.uid + "/" + "profile_image")

                profile_image.set({
                    profile_image: "https://firebasestorage.googleapis.com/v0/b/retasclub-d5adc.appspot.com/o/soccer-player.png?alt=media&token=4cf53cc3-cc8c-44c3-83dc-c2278a2d472e",
                })
                firebase.auth().signOut()
                navigation.navigate('Login')
                VerificacionToast()
            })
            .catch((error) => {
                alert(error)
            });
    }

    useEffect(() => {
        changeLanguagePreset()
    }, []);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/soccerball.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder={LANGNombreField}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
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
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder={LANGConfirmarC}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>{LANGCrearCuenta}</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
    <Text style={styles.footerText}>{LANGYatienesunaC} <Text onPress={onFooterLinkPress} style={styles.footerLink}>{LANGiniciarses}</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}