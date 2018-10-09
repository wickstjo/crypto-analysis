// SET QUERY PROPS
var data = {
   from: 'ETH',
   to: 'EUR',
   days: 50
}

// STITCH QUERY STRING TOGETHER
var query = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + data.from + '&tsym=' + data.to + '&limit=' + data.days;

// WAIT FOR PROMISE TO RESOLVE
d3.json(query).then((response) => {

   // SET CHILD CONTAINERS
   data.daily = {
      sold: [],
      exchange: [0] // SET ZERO AS STARTING COORDINATE FOR LINE CHART
   };

   data.ranges = {
      highest: [],
      lowest: [],
      lengths: []
   };

   // SET RELEVANT DATA TO MAIN OBJECT
   for (var x = 0; x < response.Data.length; x++) {
      data.daily.sold.push(response.Data[x].volumefrom);
      data.daily.exchange.push(response.Data[x].volumeto);

      data.ranges.highest.push(response.Data[x].high);
      data.ranges.lowest.push(response.Data[x].low);
      data.ranges.lengths.push(response.Data[x].high - response.Data[x].low);
   }

   // REMOVE LAST ELEMENT, IE TODAYS DATA, FOR READABILITY
   data.daily.exchange.pop()
   data.daily.sold.pop()
   data.ranges.highest.pop()
   data.ranges.lowest.pop()
   data.ranges.lengths.pop()

   // FIND & SET HIGHEST AND LOWEST VALUES IN RANGES FOR SCALING
   data.ranges.lowest = d3.min(data.ranges.lowest);
   data.ranges.highest = d3.max(data.ranges.highest);

   // PUSH IN ENDING COORDINATE FOR LINE CHART
   data.daily.exchange.push(0)

   // APPEND IN BOXES FOR THE GRAPHS
   $('body').append('<div id="linechart"></div>');
   $('body').append('<div id="barchart"></div>');
   $('body').append('<div id="boxplot"></div>');

   // SETTINGS OBJECT
   var settings = {
      width: $('#linechart').width(),
      height: (window.innerHeight - 60 - 40 - 24) / 3,
      border: {
         color: 'white',
         size: 1
      },
      background: {
         red: '#D86666',
         green: '#5ECA66',
         blue: '#7D84DA'
      },
      opacity: 0.8,
      padding: 10
   }

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.daily.exchange)])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleLinear()
      .domain([0, data.daily.exchange.length - 1])
      .rangeRound([0, settings.width])

   // GENERATE PATH METHOD
   var pathify = d3.line()
      .x((data, i) => { return xScale(i) })
      .y((data) => { return settings.height - yScale(data) })
      .curve(d3.curveBasis)

   // CONVERT XY OBJECTS INTO D3 PATHS
   data.path = pathify(data.daily.exchange);
   log(data)

                                                                                 // LINE CHART STARTS

   // GENERATE GRAPH CANVAS
   var canvas = d3.select('#linechart').append('svg')

      // ADD CUSTOMIZED PROPERTIES
      .attr('width', settings.width)
      .attr('height', settings.height)

   // SET PATH
   canvas.append('path')
      .attr('fill', settings.background.red)
      .attr('stroke', settings.border.color)
      .attr('stroke-width', settings.border.size)
      .attr('opacity', settings.opacity)
      .attr('d', data.path)

                                                                                 // LINE CHART ENDS
                                                                                 // BAR CHART STARTS

   // ADD LINEAR SCALING
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.daily.sold)])
      .range([0, settings.height])

   // ADD ORDINAL SCALING
   var xScale = d3.scaleBand()
      .domain(data.daily.sold)
      .range([0, settings.width])
      .paddingInner(settings.padding / 100)

   // GENERATE CANVAS
   var canvas = d3.select('#barchart').append('svg')

      // ADD CUSTOMIZED PROPERTIES
      .attr('width', settings.width)
      .attr('height', settings.height)
      .style('background', settings.background)

      // GENERATE 'BARS' BY LOOPING THROUGH DATA
      canvas.selectAll('bars').data(data.daily.sold).enter()

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

                                                                                 // BAR CHART ENDS
                                                                                 // BOX PLOT STARTS

      // ADD LINEAR SCALING
      var yScale = d3.scaleLinear()
         .domain([0, d3.max(data.ranges.lengths)])
         .range([0, settings.height])

      // ADD ORDINAL SCALING
      var xScale = d3.scaleBand()
         .domain(data.ranges.lengths)
         .range([0, settings.width])
         .paddingInner(settings.padding / 100)

      // GENERATE CANVAS
      var canvas = d3.select('#boxplot').append('svg')

         // ADD CUSTOMIZED PROPERTIES
         .attr('width', settings.width)
         .attr('height', settings.height)
         .style('background', settings.background)

         // GENERATE 'BARS' BY LOOPING THROUGH DATA
         canvas.selectAll('bars').data(data.ranges.lengths).enter()

            // ADD CUSTOMIZED PROPERTIES
            .append('rect')
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => { return yScale(d); })
            .attr('x', (d) => { return xScale(d); })
            .attr('y', (d) => { return settings.height - yScale(d); })
            .attr('fill', settings.background.green)
            .attr('stroke', settings.border.color)
            .attr('stroke-width', settings.border.size)
            .attr('opacity', settings.opacity)

      // BOX PLOT ENDS
});