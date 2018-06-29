import React from 'react';
import { StyleSheet, View } from "react-native";
import { Card, CardItem, Text, Left, Right, Body, Button, Icon } from 'native-base';
import {NavigationActions} from "react-navigation";

// TODO: move database logic to parent
import { database } from "../../firebase";
const ClinicInfo = ({ clinic, navigation }) => {
  return (
    <View style={styles.container}>
        <Card style={styles.slide}>
          <CardItem style={styles.card}>
              <Body>
                <Text style={[styles.text, { fontSize: 24 }]}>{clinic.clinicName}</Text>
              </Body>
          </CardItem>
          <CardItem style={[styles.card, {flexDirection: 'row'}]}>
            <Left>
              <Icon name="md-walk"/>
              <Text style={styles.text}>22 min</Text>
            </Left>
            <Left>
              <Icon name="md-car"/>
              <Text style={styles.text}>10 min</Text>
            </Left>
            <Left>
              <Icon name="md-bus"/>
              <Text style={styles.text}>16 min</Text>
            </Left>
            <Left>
              <Icon name="md-subway"/>
              <Text style={styles.text}>15 min</Text>
            </Left>
          </CardItem>
          <CardItem style={styles.cardBottom}>
            <Left>
            <Button transparent onPress={() => database.updateClinicEstimate(clinic.clinicID)}>
              <Icon active name="ios-time-outline" />
              <Text style={styles.text}>{clinic.estimatedWaitTime}</Text>
            </Button>
            </Left>
            <Right>
              <Button transparent
                      onPress={() => {
                        navigation.dispatch(NavigationActions.navigate({
                          routeName: 'BookScreen',
                          params: { clinic: clinic }
                      }))}}>
                <Text style={styles.text}>Book</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
    </View>
  )
};

export default ClinicInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  slide: {
    flex: 1,
    width: '90%',
    bottom: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // ios box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // android box-shadow
    elevation: 1,
  },
  card: {
    // quick-fix for protruding corners
    backgroundColor: 'transparent'
  },
  cardBottom: {
    borderTopColor: '#cdcdcd',
    borderTopWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // quick-fix for protruding corners
    backgroundColor: 'transparent'
  },
  text: {
    fontFamily: 'Roboto_light',
    fontSize: 14
  }
});
