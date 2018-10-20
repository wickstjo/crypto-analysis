// QUERY PROPS
var query = {
   currency: {
      from: 'ETH',
      to: 'BTC'
   },
   days: 50,
   timestamp: {
      from: 0,
      to: 0
   }
}

// DATA PROPS
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

   // SET RELEVANT DATA TO MAIN OBJECT
   for (var x = 0; x < response.Data.length; x++) {
      data.sold.push(response.Data[x].volumefrom);
      data.exchange.push(response.Data[x].volumeto);

      data.spread.avg.push((response.Data[x].high + response.Data[x].low) / 2);
      data.spread.size.push(response.Data[x].high + response.Data[x].low);
   }

   // REMOVE LAST ELEMENT, IE TODAYS DATA, FOR READABILITY
   data.exchange.pop()
   data.sold.pop()
   data.spread.avg.pop()
   data.spread.size.pop()

   // APPEND IN BOXES FOR THE GRAPHS
   $('body').append('<div id="exchange"></div>');
   $('body').append('<div id="sold"></div>');
   $('body').append('<div id="spread"></div>');

   // SETTINGS OBJECT
   var settings = {
      width: $('#exchange').width(),
      height: (window.innerHeight - 60 - 40 - 24) / 3,
      border: {
         color: 'white',
         size: 0
      },
      background: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA'
      },
      opacity: 0.6,
      padding: 10
   }

   // GENERATE AREA PATH FOR DAILY EXCHANGE AMOUNTS
   data = arealize(data, settings);

      // GENERATE CANVAS
      var canvas = d3.select('#exchange').append('svg')
         .attr('width', settings.width)
         .attr('height', settings.height)

      // GENERATE AREA
      canvas.append('path')
         .attr('fill', settings.background.red)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('opacity', settings.opacity)
         .attr('d', data.paths.exchange)

   // ADD LINEAR SCALING
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.sold)])
      .range([0, settings.height])

   // ADD ORDINAL SCALING
   var xScale = d3.scaleBand()
      .domain(data.sold)
      .range([0, settings.width])
      .paddingInner(settings.padding / 100)

   // GENERATE CANVAS
   var canvas = d3.select('#sold').append('svg')

      // ADD CUSTOMIZED PROPERTIES
      .attr('width', settings.width)
      .attr('height', settings.height)
      .style('background', settings.background)

      // GENERATE 'BARS' BY LOOPING THROUGH DATA
      canvas.selectAll('bars').data(data.sold).enter()

         // ADD CUSTOMIZED PROPERTIES
         .append('rect')
         .attr('width', xScale.bandwidth())
         .attr('height', (d) => { return yScale(d); })
         .attr('x', (d) => { return xScale(d); })
         .attr('y', (d) => { return settings.height - yScale(d); })
         .attr('fill', settings.background.blue)
         .attr('stroke', settings.border.color)
         .attr('stroke-width', settings.border.size)
         .attr('opacity', settings.opacity)

   // GENERATE LINE PATH FOR AVERAGE DAILY SPREAD
   data = lineify(data, settings);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#spread').append('svg')
         .attr('width', settings.width)
         .attr('height', settings.height)

      // SET PATH
      canvas.append('path')
         .attr('fill', 'none')
         .attr('stroke', settings.background.green)
         .attr('stroke-width', 3)
         .attr('opacity', settings.opacity)
         .attr('d', data.paths.spread)

   log(data)
   log(query)
});