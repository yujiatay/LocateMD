import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {NavigationActions} from "react-navigation";
// TODO: move database logic to parent
import { database } from "../../firebase";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Button = ({icon, text, onPress, active}) => (
  <TouchableOpacity onPress={onPress}
    style={
      {flexDirection: 'row', alignItems: 'center', borderRadius: 20,
        borderWidth: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 3,
        paddingBottom: 3, marginLeft: 2, marginRight: 2,
        backgroundColor: active ? '#db1168' : '#fff',
        borderColor: active ? '#db1168' : '#afb4bc'
    }}
  >
    {icon}
    <Text style={{fontFamily: 'Roboto_light', fontSize: 14,
      color: active ? '#fff' : '#525a66', marginLeft: 5}}>{text}</Text>
  </TouchableOpacity>
);

const ClinicInfo = ({clinic, navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        <View style={{flex: 1}}>
          <Text style={{fontFamily: 'Roboto_light', fontSize: 20, color: '#000'}}>{clinic.clinicName}</Text>
        </View>

        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="md-walk" size={30} color="#6f737a"/>
            <Text style={[styles.text, {marginLeft: 5}]}>{clinic.walkTime} min</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="md-car" size={30} color="#6f737a"/>
            <Text style={[styles.text, {marginLeft: 5}]}>{clinic.driveTime} min</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="md-bus" size={30} color="#6f737a"/>
            <Text style={[styles.text, {marginLeft: 5}]}>{clinic.ptTime} min</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="md-subway" size={30} color="#6f737a"/>
            <Text style={[styles.text, {marginLeft: 5}]}>{clinic.ptTime} min</Text>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10}}>
          <Button icon={<MaterialCommunityIcons name="calendar-check" size={20} color='#fff'/>}
                  text="Book" active={true}
                  onPress={() => {
                    navigation.dispatch(NavigationActions.navigate({
                      routeName: 'BookScreen',
                      params: { clinic: clinic }
                    }))}}/>
          <Button icon={<Ionicons name="ios-time-outline" size={20} color='#525a66'/>}
                  text={clinic.estimatedWaitTime} active={false}
                  onPress={() => database.updateClinicEstimate(clinic.clinicID)}
          />
        </View>
      </View>
    </View>
  );
};

export default ClinicInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
    padding: 10
  },
  slide: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    paddingLeft: 20,
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
    fontSize: 14,
    color: '#6f737a'
  }
});
