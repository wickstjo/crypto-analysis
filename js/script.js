// QUERY OBJECT
var query = {
   currency: {
      from: 'ETH',
      to: 'EUR'
   },
   days: 100,
   timestamp: {
      from: 0,
      to: 0
   }
}

// DATA OBJECT
var data = {
   raw: {},
   exchange: [],
   sold: [],
   spread: {
      avg: [],
      size: []
   },
   paths: {}
}

// WAIT FOR PROMISE QUERY TO RESOLVE
d3.json('https://min-api.cryptocompare.com/data/histoday?fsym=' + query.currency.from + '&tsym=' + query.currency.to + '&limit=' + query.days).then((response) => {

   // SAVE RAW RESPONSE & TIMESTAMPS
   data.raw = response;
   query.timestamp.from = response.TimeFrom;
   query.timestamp.to = response.TimeTo;

   // APPEND IN DIVS FOR THE GRAPHS
   $('body').append('<div id="exchange"></div>');
   $('body').append('<div id="sold"></div>');
   $('body').append('<div id="spread"></div>');

   // SETTINGS OBJECT
   var settings = {
      width: $('#exchange').width(),
      height: (window.innerHeight - 60 - 40 - 24) / 3,
      border: {
         color: '#7D84DA',
         size: 4
      },
      background: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA'
      },
      dot: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA'
      },
      opacity: 0.6,
      radius: 2.5,
      multiplier: 1.02
   }

   // SET RELEVANT DATA TO MAIN OBJECT
   for (var x = 0; x < response.Data.length; x++) {
      data.sold.push(response.Data[x].volumefrom);
      data.exchange.push(response.Data[x].volumeto);
      data.spread.avg.push((response.Data[x].high + response.Data[x].low) / 2);
      data.spread.size.push(response.Data[x].high - response.Data[x].low);
   }

   // REMOVE LAST ELEMENT, IE TODAYS DATA, FOR READABILITY
   data.exchange.pop();
   data.sold.pop();
   data.spread.avg.pop();
   data.spread.size.pop();

   // GENERATE CHARTS & RETURN UPDATED DATA OBJECT
   data = exchange(data, settings);
   data = sold(data, settings);
   data = spread(data, settings);

   log(data)
   log(query)
});