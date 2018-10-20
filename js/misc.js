// GENERATE EXCHANGE CHART & UPDATE DATA OBJECT
function exchange(data, settings) {

   // Y-SCALING
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.exchange) * settings.multiplier])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleTime()
      .domain([0, data.exchange.length - 1])
      .rangeRound([0, settings.width])

   // GENERATE PATH METHOD
   var pathify = d3.area()
      .x((data, i) => { return xScale(i) })
      .y0(settings.height - yScale(0))
      .y1((data) => { return settings.height - yScale(data) })

   // CONVERT XY OBJECTS INTO D3 PATHS
   data.paths.exchange = pathify(data.exchange);

   // GENERATE CANVAS
   var canvas = d3.select('#exchange').append('svg')
      .attr('width', settings.width)
      .attr('height', settings.height)

   // GENERATE AREA
   canvas.append('path')
      .attr('fill', settings.background.red)
      .attr('opacity', settings.opacity)
      .attr('d', data.paths.exchange)

   // GENERATE DOTS FOR BREAKPOINTS
   canvas.selectAll('circle')
      .data(data.exchange)
         .enter().append('circle')
            .attr('cx', (data, i) => { return xScale(i) })
            .attr('cy', (data) => { return settings.height - yScale(data) })
            .attr('r', settings.radius)
            .attr('fill', settings.dot.red)

   // RETURN UPDATED DATA OBJECT
   return data;
}

// GENERATE SOLD CHART & UPDATE DATA OBJECT
function sold(data, settings) {

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.sold) * settings.multiplier])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleTime()
      .domain([0, data.sold.length - 1])
      .rangeRound([0, settings.width])

   // GENERATE PATH METHOD
   var pathify = d3.area()
      .x((data, i) => { return xScale(i) })
      .y0(settings.height - yScale(0))
      .y1((data) => { return settings.height - yScale(data) })

   // CONVERT XY OBJECTS INTO D3 PATHS
   data.paths.sold = pathify(data.sold);
   
   // GENERATE CANVAS
   var canvas = d3.select('#sold').append('svg')
      .attr('width', settings.width)
      .attr('height', settings.height)

   // GENERATE AREA
   canvas.append('path')
      .attr('fill', settings.background.green)
      .attr('opacity', settings.opacity)
      .attr('d', data.paths.sold)

   // GENERATE DOTS FOR BREAKPOINTS
   canvas.selectAll('circle')
      .data(data.sold)
         .enter().append('circle')
            .attr('cx', (data, i) => { return xScale(i) })
            .attr('cy', (data) => { return settings.height - yScale(data) })
            .attr('r', settings.radius)
            .attr('fill', settings.dot.green)

   // RETURN UPDATED DATA OBJECT
   return data;
}

// GENERATE LINE PATH
function spread(data, settings) {

   // Y-SCALING
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.spread.avg) * 1.2])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleLinear()
      .domain([0, data.spread.avg.length - 1])
      .rangeRound([0, settings.width])

   // GENERATE PATH METHOD
   var pathify = d3.line()
      .x((data, i) => { return xScale(i) })
      .y((data) => { return settings.height - yScale(data) })

   // CONVERT XY OBJECTS INTO D3 PATHS
   data.paths.spread = pathify(data.spread.avg);
   
  // GENERATE GRAPH CANVAS
  var canvas = d3.select('#spread').append('svg')
  .attr('width', settings.width)
  .attr('height', settings.height)

  // GENERATE PATH
  canvas.append('path')
     .attr('fill', 'none')
     .attr('stroke', settings.border.color)
     .attr('stroke-width', settings.border.size)
     .attr('opacity', settings.opacity)
     .attr('d', data.paths.spread)

   // GENERATE DOTS FOR BREAKPOINTS
   canvas.selectAll('circle')
     .data(data.spread.avg)
        .enter().append('circle')
           .attr('cx', (data, i) => { return xScale(i) })
           .attr('cy', (data) => { return settings.height - yScale(data) })
           .attr('r', settings.radius)
           .attr('fill', settings.dot.blue)

   // RETURN UPDATED DATA OBJECT
   return data;
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }