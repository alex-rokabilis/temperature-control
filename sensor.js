var sensor = require('node-dht-sensor');

module.exports = {
    read: function () {
        return new Promise((resolve, reject) => {
            sensor.read(11, 4, (err, temperature, humidity) => err ? reject(err) : resolve({
                temperature,
                humidity
            }))
        })
    }
}
