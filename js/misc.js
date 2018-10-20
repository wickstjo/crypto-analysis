// GENERATE AREA PATH
function arealize(data, settings) {

   // Y-SCALING -- BASED ON OVERALL HIGHEST VALUE
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.exchange)])
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
   
   return data;
}

// GENERATE LINE PATH
function lineify(data, settings) {

   // Y-SCALING
   var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.spread.avg) * 1.5])
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
   
   return data;
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }