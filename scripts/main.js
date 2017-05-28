function highcharts(chartData){

  
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

// Create the chart
Highcharts.stockChart('container', {
    chart: {
        events: {
            load: function () {

            }
        }
    },

    rangeSelector: {
        buttons: [{
            count: 60,
            type: 'minute',
            text: '1H'
        }, {
            count: 1,
            type: 'day',
            text: '1D'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        selected: 0
    },

    title: {
        text: 'Live random data'
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'Random data',
        data:chartData
    }]
});


}


$(document).ready(function(){


    var unixTimeNow = Math.floor(Date.now() / 1000);

    //why three days? faster load time!
    var threeDaysAgo = unixTimeNow-3600*24*3;

    $.get('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETH&start='+threeDaysAgo+'&end=9999999999&period=300',function(data){
        console.log(data)
        var chartData = data.map(function(item){
            //return [item.date * 1000, Math.round(item.quoteVolume)];
            var volume = Math.round(item.volume * 100) / 100
            return [item.date * 1000, volume];
        });
        highcharts(chartData);
    });
  
});

