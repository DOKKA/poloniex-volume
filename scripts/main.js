

//get chart data as a promise in a format highcharts can use
function getChartData(currencyPair){
    var unixTimeNow = Math.floor(Date.now() / 1000);
    //why three days? faster load time!
    var threeDaysAgo = unixTimeNow-3600*24*3;
    return $.get('https://poloniex.com/public?command=returnChartData&currencyPair='+currencyPair+'&start='+threeDaysAgo+'&end=9999999999&period=300').then(function(data){
        return data.map(function(item){
            //use base volume for comparing other coins
            var volume = Math.round(item.volume * 100) / 100
            //var volume = Math.round(item.quoteVolume * 100) / 100
            return [item.date * 1000, volume];
        });
    })
}

function createChart(currencyPair, container, chartData){
    Highcharts.stockChart(container, {
        chart: {
            events: {
                load: function () {
                    //maby use this for ajax instead? idk...
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
            text: currencyPair
        },

        exporting: {
            enabled: false
        },

        series: [{
            name: currencyPair,
            data:chartData
        }]
    });
}


$(document).ready(function(){

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $('#btnAddChart').click(function(){
        var currencyPair = $('#selCoins').val();
        var containerName = currencyPair+'_'+(new Date().getTime());
        console.log(containerName)
        var container = `<div id='${containerName}'  style="height: 400px; min-width: 310px"></div>`
        $('body').append(container);
        getChartData(currencyPair).then(function(chartData){
            createChart(currencyPair, containerName, chartData);
        }); 
    });

    //populate the select box
    $.get('https://poloniex.com/public?command=returnTicker',function(data){

        //sorting in javascript, ugh
        var coins = Object.keys(data).sort(function(a, b){
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });
        var options = coins.map(function(coin){
            return `<option value="${coin}">${coin}</option>`
        }).join('');
        $('#selCoins').html(options)

    });
  
});

