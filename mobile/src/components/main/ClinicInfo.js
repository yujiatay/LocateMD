import React from 'react';
import { StyleSheet, View } from "react-native";
import { Card, CardItem, Text, Left, Right, Thumbnail, Body, Button, Icon } from 'native-base';
import clinicIconPlaceholder from '../../assets/favicon_64x64.png';

const ClinicInfo = ({ clinic }) => {
  return (
    <View style={styles.container}>
        <Card style={styles.slide}>
          <CardItem>
            <Left>
              <Thumbnail source={clinicIconPlaceholder}/>
              <Body>
                <Text>{clinic.name}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Body>
              <Text>Address: {clinic.addr}</Text>
              <Text>Opening hours: {clinic.openingHours}</Text>
              <Text>Phone: {clinic.phone}</Text>
            </Body>
          </CardItem>
          <CardItem style={styles.cardBottom}>
            <Left>
              <Icon active name="ios-time-outline" />
              <Text>{clinic.waitTime}</Text>
            </Left>
            <Right>
              <Button transparent>
                <Text>Book</Text>
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
    marginBottom: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardBottom: {
    borderTopColor: '#cdcdcd',
    borderTopWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  text: {
    color: '#9DD6EB',
    fontSize: 30,
    fontWeight: 'bold'
  }
});