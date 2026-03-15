const http2wrapper = require('http2-wrapper');
const axios = require ('axios');

const talker = axios.create({
    httpsAgent: new http2wrapper.Agent(),
    timeout: 15000,
    headers:  {
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Socket.Kill - (@ScottishDex/https://socketkill.com/)',
    }
});

module.exports = talker;