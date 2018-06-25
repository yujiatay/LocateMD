import React from 'react';
import { StyleSheet, View } from "react-native";
import { Card, CardItem, Text, Left, Right, Thumbnail, Body, Button, Icon } from 'native-base';
import clinicIconPlaceholder from '../../assets/favicon_64x64.png';
import {NavigationActions} from "react-navigation";

const ClinicInfo = ({ clinic, navigation }) => {
  return (
    <View style={styles.container}>
        <Card style={styles.slide}>
          <CardItem style={styles.card}>
            <Left>
              <Thumbnail source={clinicIconPlaceholder}/>
              <Body>
                <Text style={styles.text}>{clinic.name}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem style={styles.card}>
            <Body>
              <Text style={styles.text}>Address: {clinic.address}</Text>
              <Text style={styles.text}>Opening hours: {clinic.openingHours}</Text>
              <Text style={styles.text}>Phone: {clinic.contactNumber}</Text>
            </Body>
          </CardItem>
          <CardItem style={styles.cardBottom}>
            <Left>
              <Icon active name="ios-time-outline" />
              <Text style={styles.text}>{clinic.estimatedWaitTime}</Text>
            </Left>
            <Right>
              <Button onPress={() => {navigation.dispatch(NavigationActions.navigate({ routeName: 'BookScreen' }))}}>
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
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    borderRadius: 15
  },
  cardBottom: {
    borderTopColor: '#cdcdcd',
    borderTopWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderRadius: 15
  },
  text: {
    fontFamily: 'Roboto_light'
  }
});
