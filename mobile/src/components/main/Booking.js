import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, CardItem, Text, Body, Container, Content} from 'native-base';

class Booking extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <View style={styles.container}>
        <Card style={styles.card}>
          <CardItem button style={styles.cardItem}>
            <Body style={styles.cardItem}>
              <Text style={styles.cardText}>Queue</Text>
            </Body>
          </CardItem>
        </Card>
        <Card style={styles.card}>
          <CardItem button style={styles.cardItem}>
            <Body style={styles.cardItem}>
            <Text style={styles.cardText}>Book in advance</Text>
            </Body>
          </CardItem>
        </Card>
        </View>
    );
  }
}
export default Booking;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  card: {
    height: 200,
    backgroundColor: 'linear-gradient(141deg, rgb(15, 184, 173) 0%, rgb(31, 200, 219) 51%, rgb(44, 181, 232) 75%)',
    borderRadius: 10
  },
  cardItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'linear-gradient(141deg, rgb(15, 184, 173) 0%, rgb(31, 200, 219) 51%, rgb(44, 181, 232) 75%)'
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24
  }
});