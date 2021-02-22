import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"


Notifications.setNotificationHandler({
    // What to do before the notification is being displayed
    handleNotification: async () => {
        return {
            shouldShowAlert: true // this indicates the operating system
        }
    }
})

export default function App() {
    const [pushToken, setPushToken] = useState()

    useEffect(() => {
        // For iOS
        Permissions.getAsync(Permissions.NOTIFICATIONS)
            .then((response) => {
                if (response.status !== "granted") {
                    return Permissions.askAsync(Permissions.NOTIFICATIONS)
                }

                return response
            }).then((response) => {
            if (response.status !== "granted") {
                throw new Error("Permission not granted")
            }
        }).then(() => {
            // Sign up to Expo's push server
            return Notifications.getExpoPushTokenAsync()
        }).then((response) => {
            const token = response.data
            setPushToken(token)
        }).catch((_) => {
                return null
            })
    }, [])

    useEffect(() => {
        // Trigger notification while the app is in the background
        const backgroundSubscription = Notifications.addNotificationReceivedListener((response) => {
            console.log(response)
        })

        // Trigger notification while the app is in the foreground
        const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
            console.log(notification)
        })

        return () => {
            foregroundSubscription.remove()
            backgroundSubscription.remove()
        }
    }, [])

    const triggerLocalNotification = () => {
        // Trigger local notification
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: "My first local notification",
        //         body: "This is the body of the notification",
        //         data: {
        //             object: "Some data"
        //         }
        //     },
        //     trigger: {
        //         seconds: 1
        //     }
        // })
        fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: pushToken,
                data: {
                    extraData: "Some data"
                },
                title: "Send via the app",
                body: "This push notification was sent via the app"
            })
        })
    }

    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Button
                title="Trigger notification"
                onPress={triggerLocalNotification}/>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
