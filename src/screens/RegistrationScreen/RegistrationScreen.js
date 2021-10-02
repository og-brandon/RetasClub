import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Alert, ToastAndroid } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function RegistrationScreen({ navigation }) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const VerificacionToast = () => {
        if(Platform.OS === 'android'){
            ToastAndroid.show("Se ha enviado un correo de verificación a tu dirección de correo electrónico. Por favor, revisa to correo para terminar de crear tu cuenta", ToastAndroid.LONG);
        }
        else {
            Alert.alert(
                'Verificacion',
                'Se ha enviado un correo de verificación a tu dirección de correo electrónico. Por favor, revisa to correo para terminar de crear tu cuenta.',
                [
                       {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]
            )
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
            alert("Las contraseñas no coinciden.")
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                navigation.navigate('Login')
                VerificacionToast()
            })
            .catch((error) => {
                alert(error)
            });
    }

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
                    placeholder='Nombre'
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
                    placeholder='Contraseña'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirmar contraseña'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Crear una cuenta</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>¿Ya tienes una cuenta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Iniciar Sesion</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}