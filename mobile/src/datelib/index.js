
// Default booking slots for now, to allow clinics to specify in future
const hourMinuteSlots = [ [15, 0], [15, 45], [16, 0], [16, 15], [16, 30]];

export const genDaySlots = () =>  {
  let today = new Date(Date.now());
  return hourMinuteSlots.map((hourMinutePair) => {
    return today.setHours(hourMinutePair[0], hourMinutePair[1], 0, 0)
  });
};

export const filterDaySlots = (daySlots, clinicBookingsObj) => {
  let startOfToday = new Date(Date.now()).setHours(0, 0, 0, 0);
  let endOfToday = new Date(Date.now()).setHours(23, 59, 59, 999);
  if (clinicBookingsObj === undefined || clinicBookingsObj === null) {
    clinicBookingsObj = {};
  }
  let dayBookings = Object.keys(clinicBookingsObj).filter(bookingStart => bookingStart > startOfToday &&
                                                          bookingStart < endOfToday);

  // Filters by comparing +- 2 minute (inaccuracies dropped)

  return daySlots.filter(slotTimestamp => {
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

export const parseForDisplay = (slotStamps) => {
  let ret = ["Real-time Queue"];
  let formattedSlots = slotStamps.map((slotStamp) => {
    let slotDate = new Date(slotStamp);
    return '' + format24Hour(slotDate.getHours()) + ':' +
           pad(slotDate.getMinutes()) + get24HourSuffix(slotDate.getHours());
  });
  return ret.concat(formattedSlots);
};

