const request = require('request');
// Makes a single API request to retrieve the user's IP address
const fetchMyIP = (callback) => {
  const url = "https://api.ipify.org?format=json";
  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // parse and extract the IP address
    callback(null, JSON.parse(body).ip);
  });
};

// Makes a single API request to retrieve geo coordinates for the given IP address.
const fetchCoordsByIP = (ip, callback) => {
  const geoUrl = `https://freegeoip.app/json/${ip}`;
  request(geoUrl, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // find the values of these properties in HTML body
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });
};

// Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
const fetchISSFlyOverTimes = function(coords, callback) {
  const flyOverUrl = `http://api.open-notify.org/iss/v1?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(flyOverUrl, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times:${body}`;
      callback(Error(msg), null);
      return;
    }
    // find the array of objects inside the response property
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };