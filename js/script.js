// https://beta.observablehq.com/@mbostock/d3-area-chart
// CHANGE LINE GRAPHS TO AREA GRAPHS

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
   data = {
      sold: [],
      exchange: [0], // SET ZERO AS STARTING COORDINATE FOR LINE CHART
      avg: [0],
      paths: {},
      query: {
            from: response.TimeFrom,
            to: response.TimeTo
      }
   };

   // SET RELEVANT DATA TO MAIN OBJECT
   for (var x = 0; x < response.Data.length; x++) {
      data.sold.push(response.Data[x].volumefrom);
      data.exchange.push(response.Data[x].volumeto);
      data.avg.push((response.Data[x].high + response.Data[x].low) / 2);
   }

   // REMOVE LAST ELEMENT, IE TODAYS DATA, FOR READABILITY
   data.exchange.pop()
   data.sold.pop()
   data.avg.pop()

   // PUSH IN ENDING COORDINATE FOR LINE CHARTS
   data.exchange.push(0);
   data.avg.push(0);

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

                                                                                 // LINE CHART STARTS

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.exchange)])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleLinear()
      .domain([0, data.exchange.length - 1])
      .rangeRound([0, settings.width])

   // GENERATE PATH METHOD
   var pathify = d3.line()
      .x((data, i) => { return xScale(i) })
      .y((data) => { return settings.height - yScale(data) })
      .curve(d3.curveBasis)

   // CONVERT XY OBJECTS INTO D3 PATHS
   data.paths.exchange = pathify(data.exchange);

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
      .attr('d', data.paths.exchange)

                                                                                 // LINE CHART ENDS
                                                                                 // BAR CHART STARTS

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
   var canvas = d3.select('#barchart').append('svg')

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

                                                                                 // BAR CHART ENDS
                                                                                 // BOX PLOT STARTS

      // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
      var yScale = d3.scaleLinear()
            .domain([0, d3.max(data.avg)])
            .range([0, settings.height])

      // X-SCALING
      var xScale = d3.scaleLinear()
            .domain([0, data.avg.length - 1])
            .rangeRound([0, settings.width])

      // GENERATE PATH METHOD
      var pathify = d3.line()
            .x((data, i) => { return xScale(i) })
            .y((data) => { return settings.height - yScale(data) })
            .curve(d3.curveBasis)

      // CONVERT XY OBJECTS INTO D3 PATHS
      data.paths.avg = pathify(data.avg);

      // GENERATE GRAPH CANVAS
      var canvas = d3.select('#boxplot').append('svg')

            // ADD CUSTOMIZED PROPERTIES
            .attr('width', settings.width)
            .attr('height', settings.height)

      // SET PATH
      canvas.append('path')
            .attr('fill', settings.background.green)
            .attr('stroke', settings.border.color)
            .attr('stroke-width', settings.border.size)
            .attr('opacity', settings.opacity)
            .attr('d', data.paths.avg)

      // BOX PLOT ENDS

      log(data)
});