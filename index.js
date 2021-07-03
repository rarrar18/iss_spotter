const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');
// manual non-assertion based test
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

const myIP = '24.80.134.201'; //IPv4 address
fetchCoordsByIP(myIP, (error, data) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned coordinates: ', data);
});