import { circle } from '@turf/circle';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

// TODO: explore different ways to get clinic object here
export const getClinicsAround = (lon, lat, radius, clinics) => {
  let roi = circle([lon,lat], radius, {units: 'kilometers'});
  let validClinics = [];
  Object.keys(clinics).forEach((key) => {
    let clinicPoint = point(clinics[key].coords.lon, clinics[key].coords.lat);
    if (booleanPointInPolygon(clinicPoint, roi)) {
      let validClinic = clinics[key];
      validClinic.key = key;
      validClinics.push(validClinic);
    }
  });
  return validClinics;
};

// TODO: explore different ways to get clinic object here
export const findByClinicName = (searchString, clinics) => {
  let validClinics = [];
  let regSearch = new RegExp(searchString, 'i' );
  Object.keys(clinics).forEach((key) => {
    if (clinics[key].clinicName.search(regSearch) !== -1) {
      let validClinic = clinics[key];
      validClinic.key = key;
      validClinics.push(validClinic);
    }
  });
  return validClinics;
};

// TODO: explore different ways to get clinic object here
export const findByPostalCode = (searchNumber, clinics) => {
  let validClinics = [];
  Object.keys(clinics).forEach((key) => {
    if (clinics[key].address.postalCode === searchNumber) {
      let validClinic = clinics[key];
      validClinic.key = key;
      validClinics.push(validClinic);
    }
  });
  return validClinics;
};
