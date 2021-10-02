import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registro')
    }

    const onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                let user = firebase.auth().currentUser;
                let emailVerified = user.emailVerified;
                if (emailVerified === true){
                    navigation.navigate('Home', {user})
                }
                else {
                    Alert.alert(
                        'Error de verificacion',
                        'Favor de verificar su cuenta por medio de su correo electronico.',
                        [
                               {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ]
                    )
                    return
                }
            })
            .catch(error => {
                alert(error)
            })
    }

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
                    placeholder='Contraseña'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>¿No tienes una cuenta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Registrate</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}