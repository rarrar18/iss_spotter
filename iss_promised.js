const request = require('request-promise-native');
// fetch IP address from API, return promise returned by request
const fetchMyIP = function() {
  return request("https://api.ipify.org?format=json");
};
// takes input as string, parses it for ip, make request to fetch coords
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};
// Uses lat and long to find fly over times for that location
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};
// Run the three above functions using promises and return the ISS pass times
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };