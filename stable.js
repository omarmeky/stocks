var fs = require('fs'),
    https = require('https'),
    moment = require('moment'),
    readline = require('readline'),
    stats = require('stats-lite');

var symbols = [],
    results = [];

var rl = readline.createInterface({
  input: fs.createReadStream('djim.csv'),
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line) {
  var values = line.split(',');
  if (values.length > 1 && values[0] !== 'Symbol') {
    symbols.push(values[0]);
  }
});

rl.on('close', function() {
  var startDate = moment().subtract(1, 'M');
  symbols.forEach(function(symbol) {
    https.get('https://www.quandl.com/api/v3/datasets/EOD/' + symbol + '.json?api_key=fRzaf_gfEtjYtoe_y3es&start_date=' + startDate.format('YYYY-MM-DD'), function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        var data = JSON.parse(body).dataset.data;
        var highs = [],
            lows = [];
        for (var i = 0; i < data.length; i++) {
          highs.push(data[i][2]);
          lows.push(data[i][3]);
        }
        var highsMean = stats.mean(highs),
            lowsMean = stats.mean(lows);
        results.push({
          symbol: symbol,
          highVolatility: (stats.stdev(highs) / highsMean) * 100,
          lowVolatility: (stats.stdev(lows) / lowsMean) * 100,
          swingPercent: ((highsMean - lowsMean) / lowsMean) * 100
        });
        console.log('analyzed ' + results.length + ' of ' + symbols.length);
        if (symbols.length === results.length) {
          results = results.filter(function(result) {
            return result.highVolatility && result.lowVolatility && result.swingPercent && (result.highVolatility < 2.5) && (result.lowVolatility < 2.5);
          });
          results.sort(function(a, b) {
            return a.swingPercent - b.swingPercent;
          });
          results.forEach(function(result) {
            console.log(JSON.stringify(result));
          });
        }
      });
    });
  });
});