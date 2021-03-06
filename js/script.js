function charts(_from, _to, _limit) {

   // DATA OBJECT
   var data = {
      raw: {},
      exchange: [],
      sold: [],
      dates: [],
      spread: {
         avg: [],
         size: []
      },
      paths: {},
      query: {
         currency: {
            from: convert(_from),
            to: convert(_to)
         },
         days: _limit,
         timestamp: {
            from: 0,
            to: 0
         }
      }
   }

   // WAIT FOR PROMISE QUERY TO RESOLVE
   d3.json('https://min-api.cryptocompare.com/data/histoday?fsym=' + data.query.currency.from + '&tsym=' + data.query.currency.to + '&limit=' + data.query.days).then((response) => {

      // SAVE RAW RESPONSE & TIMESTAMPS
      data.raw = response;
      data.query.timestamp.from = response.TimeFrom;
      data.query.timestamp.to = response.TimeTo;

      // NECESSARY SELECTORS
      var selectors = `
         <div id="exchange"></div>
         <div id="sold"></div>
         <div id="spread"></div>
      `;

      // EMTRY OLD INNERBODY, THEN RENDER IN SELECTORS
      $('#innerbody').html('').html(selectors);

      // SETTINGS OBJECT
      var settings = {
         width: $('#exchange').width(),
         height: (window.innerHeight - 60 - 40 - 24) / 3,
         border: {
            color: '#7D84DA',
            size: {
               large: 6,
               medium: 5,
               small: 3
            }
         },
         background: {
            exchange: '#D86666',
            sold: '#5ECA66'
         },
         dot: {
            exchange: '#D86666',
            sold: '#5ECA66'
         },
         radius: {
            large: 6,
            medium: 4,
            small: 2
         },
         opacity: 0.6,
         multiplier: 1.02
      }

      // SET RELEVANT DATA TO MAIN OBJECT
      for (var x = 0; x < response.Data.length; x++) {
         data.sold.push(response.Data[x].volumefrom);
         data.exchange.push(response.Data[x].volumeto);
         data.dates.push(convert_unix(response.Data[x].time));
         data.spread.avg.push(response.Data[x].low + ((response.Data[x].high + response.Data[x].low) / 2));
         data.spread.size.push(
            {
               median: response.Data[x].low + ((response.Data[x].high - response.Data[x].low) / 2),
               high: response.Data[x].high,
               low: response.Data[x].low,
               difference: response.Data[x].high - response.Data[x].low
            }
         );
      }

      // REMOVE LAST ELEMENT, IE TODAYS DATA, FOR READABILITY
      data.exchange.pop();
      data.sold.pop();
      data.spread.avg.pop();
      data.spread.size.pop();

      // GENERATE CHARTS & RETURN UPDATED DATA OBJECT
      data = modules(data, settings);
      data = spread(data, settings);

      log(data)
   });
}

// RUN IT
charts('bitcoin', 'euro', 120);