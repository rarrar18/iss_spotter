/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 * documentation
 * https://web.archive.org/web/20201224141953/http://open-notify.org/Open-Notify-API/ISS-Pass-Times/
 * example call
 * http://api.open-notify.org/iss/v1/?lat=40.027435&lon=-105.251945&alt=1650
 * 
 */
const request = require('request');
const url = "https://api.ipify.org?format=json"; //for fetchMyIP

const fetchMyIP = (callback) => {
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

module.exports = { fetchMyIP, fetchCoordsByIP };