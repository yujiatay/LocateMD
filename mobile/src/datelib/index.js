
// Default booking slots for now, to allow clinics to specify in future
const hourMinuteSlots = [ [15, 0], [15, 45], [16, 0], [16, 15], [16, 30]];
// Default interval in milliseconds between bookings (for now)
const BOOKING_INTERVAL = 1200000;
// Default estimated appointment length in milliseconds (for now)
const ESTIMATED_APPT_TIME = 600000;
// Default booking threshold (time from now that bookings can be made) in milliseconds
const BOOKING_THRESHOLD = 10800000;

export const genDaySlots = () =>  {
  let today = new Date(Date.now());
  return hourMinuteSlots.map((hourMinutePair) => {
    return today.setHours(hourMinutePair[0], hourMinutePair[1], 0, 0)
  });
};

export const genBookingSlots = (openingHoursObj) => {
  let openingHours = selectOpeningHoursNow(openingHoursObj);
  let today = new Date(Date.now());
  let slots = [];
  let datetimeHours = openingHours.map((openingPeriod) => {
    let start = openingPeriod.start;
    let end = openingPeriod.end;
    return {
      start: today.setHours(start.substring(0, 2), start.substring(2), 0, 0),
      end: today.setHours(end.substring(0, 2), end.substring(2), 0, 0)
    };
  });
  datetimeHours.forEach((openingPeriod) => {
    let possibleSlot = openingPeriod.start;
    let possibleSlotEnd = openingPeriod.start + ESTIMATED_APPT_TIME;
    let periodCutoff = openingPeriod.end;
    while(possibleSlotEnd < periodCutoff) {
      slots.push(possibleSlot);
      possibleSlot += BOOKING_INTERVAL;
      possibleSlotEnd += BOOKING_INTERVAL;
    }
  });
  return slots;
};

export const filterDaySlots = (daySlots, clinicBookingsObj) => {
  let currentTime = new Date(Date.now());
  let endOfToday = new Date(Date.now()).setHours(23, 59, 59, 999);
  if (clinicBookingsObj === undefined || clinicBookingsObj === null) {
    clinicBookingsObj = {};
  }
  // Filter possible day slots by current time + booking threshold (3 hours for now)
  let remainingDaySlots = daySlots.filter((slotTimestamp) => {
    return slotTimestamp >= Date.now() + BOOKING_THRESHOLD;
  });
  let dayBookings = Object.keys(clinicBookingsObj).filter(bookingStart => bookingStart > currentTime &&
    bookingStart < endOfToday);

    // Filters by comparing +- 2 minute (inaccuracies dropped)

    return remainingDaySlots.filter(slotTimestamp => {
      return dayBookings.filter(bookedTimestamp => {
        return Math.abs(slotTimestamp / 60000 - parseInt(bookedTimestamp) / 60000) <= 2;
      }).length === 0;
    })
  };


  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  function format24Hour(hour) {
    if (hour === 0) {
      return 12;
    } else if (hour > 12) {
      return hour - 12;
    } else {
      return hour;
    }
  }

  function get24HourSuffix(hour) {
    return hour >= 12 ? 'PM' : 'AM'
  }

  function selectOpeningHoursNow(openingHoursObj) {
    let day = new Date(Date.now()).getDay();
    let schedule;
    switch(day) { // Sunday - Saturday : 0 - 6
      case 0:
      schedule = openingHoursObj.sun;
      break;
      case 1:
      schedule = openingHoursObj.mon;
      break;
      case 2:
      schedule = openingHoursObj.tue;
      break;
      case 3:
      schedule = openingHoursObj.wed;
      break;
      case 4:
      schedule = openingHoursObj.thu;
      break;
      case 5:
      schedule = openingHoursObj.fri;
      break;
      case 6:
      schedule = openingHoursObj.sat;
      break;
    }
    return schedule;
  }


  export const parseForDisplay = (slotStamps) => {
    let ret = ["Real-time Queue"];
    let formattedSlots = slotStamps.map((slotStamp) => {
      let slotDate = new Date(slotStamp);
      return '' + format24Hour(slotDate.getHours()) + ':' +
      pad(slotDate.getMinutes()) + get24HourSuffix(slotDate.getHours());
    });
    return ret.concat(formattedSlots);
  };


  export const getOpeningHoursForToday = (openingHours) => {
    let day = new Date(Date.now()).getDay();
    let schedule = selectOpeningHoursNow(openingHours);
    function formatTime(time) {
      let hour = time.substring(0, 2);
      if (hour < 12) { // if < 12, hour will be in format "0X"
      hour = hour.substring(1);
    }
    let minute = time.substring(2);
    return '' + format24Hour(hour) + ':' + minute + get24HourSuffix(hour);

  }
  let hours = '';
  for (let i = 0; i < schedule.length; i++) {
    hours += formatTime(schedule[i].start) + " - " + formatTime(schedule[i].end) + ", "
  }
  return hours.slice(0, -2); // remove the last ", "
};
