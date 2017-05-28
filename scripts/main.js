function highcharts(chartData){

  


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

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $.get('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETH&start='+threeDaysAgo+'&end=9999999999&period=300',function(data){
        console.log(data)
        var chartData = data.map(function(item){
            //use base volume for comparing other coins
            var volume = Math.round(item.volume * 100) / 100
            //var volume = Math.round(item.quoteVolume * 100) / 100
            return [item.date * 1000, volume];
        });
        highcharts(chartData);
    });

    $.get('https://poloniex.com/public?command=returnTicker',function(data){
        var coins = Object.keys(data);
        var options = coins.map(function(coin){
            return `<option value="${coin}">${coin}</option>`
        }).join('');
        $('#selCoins').html(options)

    })
  
});

