import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"

export default function App() {

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
                    // TODO make an alert message indicating to the user that the permission is needed
                }
        })
    })

  const triggerLocalNotification = () => {
    // Trigger local notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification"
      },
      trigger: {
        seconds: 10
      }
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
