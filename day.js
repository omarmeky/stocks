var http = require('http');

var calculateDays = function(gain, quotes) {
    var days = 0;
    gain = 1 + (gain / 100);
    for (var i = quotes.length - 1; i > -1; i--) {
        if ((quotes[i].open * 0.95) > quotes[i].low)
          return -1;
        if ((quotes[i].open * gain) <= quotes[i].high) {
          days++;
        }
    }
    return days;
};

var calculateMax = function(quotes) {
    var max = {
        gain: 0,
        profit: 0
    };
    for (var g = 0; g < 5.1; g+= 0.1) {
        var days = calculateDays(g, quotes);
        if (days === -1)
          return {
            gain: 0,
            profit: 0
          };
        var newProfit = Math.pow(1 + (g / 100), days);
        if (newProfit > max.profit) {
            max.gain = g;
            max.profit = newProfit;
            max.rate = (days / quotes.length) * 100 + '%';
        }
    }
    return max;
}

var calculateBestProfit = function(symbol, cb) {
    http.get('http://ichart.yahoo.com/table.csv?s=' + symbol + '&g=d', function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            console.log('Analyzing ' + symbol);
            body = body.split('\n');
            var quotes = [];
            for (var i = 1; i < 61; i++) {
                try {
                  quotes.push({
                      open: body[i].split(',')[1],
                      high: body[i].split(',')[2],
                      low: body[i].split(',')[3]
                  });
                }
                catch (err) {}
            }
            if (cb) {
                cb(calculateMax(quotes))
            };
        });
    });
};

var symbols = ['AAPL', 'XOM', 'MSFT', 'JNJ', 'WMT', 'PG', 'BABA', 'PFE', 'CVX', 'ORCL', 'FB', 'KO', 'GOOGL', 'IBM', 'MRK', 'HD', 'GILD', 'INTC', 'PEP', 'V', 'CVS', 'QCOM', 'BMY', 'MDT', 'BIIB', 'MMM', 'SLB', 'CELG', 'UNP', 'MA', 'ABBV', 'MCD', 'WBA', 'LLY', 'HON', 'COP', 'ABT', 'SBUX', 'DD', 'EBAY', 'LOW', 'NKE', 'UPS', 'CL', 'DHR', 'PCLN', 'TXN', 'ESRX', 'ACN', 'BIDU', 'MDLZ', 'MON', 'OXY', 'EMC', 'FDX', 'EOG', 'REGN', 'DPS', 'TJX', 'CRM', 'YHOO', 'APC', 'EMR', 'PSX', 'ADBE', 'ADP', 'JD', 'KMB', 'LYB', 'HAL', 'ALXN', 'BAX', 'CTSH', 'ITW', 'SYK', 'ETN', 'IR', 'JCI', 'PH', 'PX', 'ADM', 'GIS', 'TWTR', 'YUM', 'APD', 'BDX', 'ECL', 'NSC', 'PSA', 'PPG', 'LUV', 'VFC', 'CAH', 'MU', 'VRTX', 'AMAT', 'GLW', 'INTU', 'LNKD', 'MHFI', 'TEL', 'BHI', 'PCP', 'SHW', 'TSLA', 'BRCM', 'CMI', 'ILMN', 'MPC', 'LB', 'NXPI', 'APA', 'CERN', 'PRGO', 'PXD', 'BSX', 'DLPH', 'EL', 'SCCO', 'ZTS', 'DG', 'MNST', 'NOV', 'SYY', 'WDC', 'HES', 'ORLY', 'STJ', 'ZMH', 'AZO', 'MRO', 'MJN', 'MCO', 'ROST', 'TYC', 'WFM', 'ADI', 'BMRN', 'FISV', 'GPS', 'GMCR', 'NBL', 'PCYC', 'SNDK', 'SWKS', 'APH', 'EA', 'MSCI', 'PAYX', 'ROP', 'STX', 'SYMC', 'WY', 'HSY', 'ISRG', 'MOS', 'JWN', 'NUE', 'ROK', 'SIAL', 'A', 'CPB', 'CLX', 'DLTR', 'EW', 'HSP', 'INCY', 'MSI', 'VIPS', 'WHR', 'GWW', 'ADSK', 'CA', 'CLR', 'GPC', 'KORS', 'AOS', 'SWK', 'TIF', 'UA', 'AKAM', 'AME', 'BBBY', 'BWA', 'BCR', 'COG', 'FLT', 'HBI', 'QVCA', 'MHK', 'PNR', 'AR', 'ALV', 'COH', 'CXO', 'DOV', 'EQT', 'EXPE', 'HSIC', 'SJM', 'JNPR', 'KSU', 'LRCX', 'LLTC', 'PANW', 'RHT', 'NOW', 'SRCL', 'TRIP', 'VRSK', 'VMC', 'AAP', 'ALTR', 'CAM', 'CHRW', 'CHD', 'CTXS', 'EFX', 'FAST', 'JBHT', 'IFF', 'JAZZ', 'KLAC', 'NWL', 'QRVO', 'SPLS', 'TSCO', 'TRW', 'VMW', 'XLNX', 'ALKS', 'ALNY', 'CTAS', 'CTRP', 'EXPD', 'FDO', 'FLR', 'FMC', 'FTI', 'GRMN', 'HAR', 'MLM', 'MDVN', 'PLL', 'PII', 'RL', 'RRC', 'ST', 'SIG', 'ULTA', 'VAR', 'WAT', 'WDAY', 'ARG', 'ALK', 'DOX', 'XEC', 'FFIV', 'FLS', 'FL', 'HAS', 'HP', 'LULU', 'MAT', 'MXIM', 'MKC', 'MTD', 'MCHP', 'PHM', 'RMD', 'RHI', 'SNA', 'SWN', 'SPLK', 'VAL', 'WAB', 'WLK', 'ANSS', 'COO', 'XRAY', 'FBHS', 'IT', 'HRS', 'HFC', 'IHS', 'ISIS', 'N', 'Q', 'RAX', 'SNPS', 'TDC', 'TER', 'TSS', 'TRMB', 'UTHR', 'VRSN', 'GRA', 'WBC', 'WSM', 'AYI', 'ALB', 'CDKVV', 'CFX', 'DKS', 'FDS', 'FSLR', 'HLF', 'HUBB', 'IEX', 'IDXX', 'LEG', 'LKQ', 'MD', 'ODFL', 'PKI', 'PBYI', 'QIHU', 'PWR', 'RPM', 'SPR', 'SAVE', 'DATA', 'URBN', 'PAY', 'Z', 'DDD', 'AGCO', 'ALLE', 'AZPN', 'ATML', 'AVY', 'BIO', 'BR', 'BRCD', 'CDNS', 'CSL', 'CPHD', 'CRL', 'CHH', 'CIE', 'CSGP', 'CR', 'CY', 'CYT', 'DXCM', 'DO', 'FANG', 'DCI', 'DRC', 'DST', 'EXP', 'FLIR', 'FLO', 'FTNT', 'G', 'GNTX', 'GGG', 'GRPN', 'HAIN', 'INFA', 'ICPT', 'ITT', 'JKHY', 'JDSU', 'JOY', 'KATE', 'KEYS', 'KEX', 'LSTR', 'MSCC', 'MIDD', 'MUSA', 'EDU', 'NEU', 'NDSN', 'NUS', 'NVR', 'OII', 'ONNN', 'PCRX', 'PDCO', 'POL', 'PTC', 'RH', 'RVBD', 'RGLD', 'SGEN', 'SIRO', 'SYNA', 'TDY', 'TKR', 'TUP', 'UNFI', 'VRNT', 'JWA', 'XYL', 'YNDX', 'ALGN', 'AEO', 'AMH', 'ATR', 'ARUN', 'ATHN', 'BWC', 'TECH', 'BITA', 'BRKR', 'BC', 'CRI', 'CAVM', 'CBI', 'CLC', 'CGNX', 'CVLT', 'CMP', 'CVG', 'CPRT', 'CLB', 'CXW', 'CREE', 'DLX', 'DDS', 'DLB', 'DSW', 'EGN', 'EEFT', 'XLS', 'FEIC', 'FOSL', 'GWRE', 'GPOR', 'HXL', 'HSNI', 'IPXL', 'IDTI', 'IPGP', 'JCOM', 'KMT', 'LII', 'LECO', 'LPX', 'MANH', 'MMS', 'MENT', 'MR', 'MSM', 'MYGN', 'NFG', 'NATI', 'OSK', 'PNRA', 'PRXL', 'PLT', 'PLCM', 'POOL', 'PPS', 'QLIK', 'RYN', 'RBC', 'ROL', 'SAIC', 'SMG', 'SEMG', 'SXT', 'SFLY', 'SWI', 'SON', 'SSS', 'SFM', 'SSNC', 'STE', 'TMH', 'TFX', 'THO', 'TTC', 'TYL', 'ULTI', 'WOOF', 'VSAT', 'WSO', 'WST', 'WWD', 'WX', 'YELP', 'ZBRA', 'WUBA', 'AAN', 'ANF', 'ACXM', 'ABCO', 'MDRX', 'ANN', 'ASNA', 'BIG', 'CRS', 'CHE', 'CHS', 'CMPR', 'CNW', 'CSTM', 'CEB', 'DECK', 'DV', 'DBD', 'DRQ', 'ENS', 'FICO', 'FCS', 'FNSR', 'FET', 'FUL', 'LOPE', 'HAE', 'HYH', 'HCSG', 'HEI', 'MLHR', 'HRC', 'HNI', 'KN', 'LANC', 'LTRPA', 'LFUS', 'MNKD', 'MDSO', 'MOGA', 'MSA', 'MLI', 'NSR', 'NORD', 'DNOW', 'OIS', 'PTEN', 'PPO', 'SMTC', 'SLAB', 'SKX', 'SHOO', 'SWC', 'THRX', 'THOR', 'VMI', 'WB', 'WOR', 'ATU', 'AIT', 'ATHM', 'CRR', 'GTLS', 'DWA', 'GCO', 'GES', 'HLX', 'HIMX', 'HMSY', 'HUBG', 'ITRI', 'LL', 'PIR', 'PCH', 'QIWI', 'QUNR', 'SIMO', 'SFUN', 'JOE', 'TMST', 'UNT', 'SLCA', 'WNS', 'GOOG', 'LVNTA'];

var bestProfits = [];

console.time('time spent');

symbols.forEach(function(symbol) {
    calculateBestProfit(symbol, function(bestProfit) {
        bestProfit.symbol = symbol;
        console.log(JSON.stringify(bestProfit));
        bestProfits.push(bestProfit);
        if (bestProfits.length === symbols.length) {
            console.log('ANALYSIS COMPLETE');
            bestProfits.sort(function(a, b) {
              return a.profit - b.profit;
            });
            bestProfits.forEach(function(bestProfit) {
              console.log(JSON.stringify(bestProfit));
            });
            console.log('Analyzed ' + bestProfits.length + ' of ' + symbols.length);
            console.timeEnd('time spent');
        }
    });
});
