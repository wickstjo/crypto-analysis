// GENERATE EXCHANGE CHART & UPDATE DATA OBJECT
function modules(data, settings) {

   // ESTABLISH MODULE TYPE AND RELEVANT CURRENCY
   var modules = [
      ['exchange', data.query.currency.to],
      ['sold', data.query.currency.from]
   ];

   // FETCH DOT SIZE BASED ON QUERY LIMIT
   var dot = dotsize(data, settings);

   // LOOP THROUGH AND BUILD CHART
   modules.forEach(mod => {

      // Y-SCALING
      var yScale = d3.scaleLinear()
         .domain([d3.max(data[mod[0]]) * settings.multiplier, 0])
         .range([0, settings.height])

      // X-SCALING
      var xScale = d3.scaleTime()
         .domain([0, data[mod[0]].length - 1])
         .rangeRound([0, settings.width])

      // Y-AXIS
      var yAxis = d3.axisRight(yScale)
         .tickPadding(7)
         .ticks(3)
   
      // GENERATE PATH METHOD
      var pathify = d3.area()
         .x((data, i) => { return xScale(i) })
         .y0(yScale(0))
         .y1((data) => { return yScale(data) })

      // CONVERT XY OBJECTS INTO D3 PATHS
      data.paths[mod[0]] = pathify(data[mod[0]]);

      // GENERATE CANVAS
      var canvas = d3.select('#' + mod[0]).append('svg')
         .attr('width', settings.width)
         .attr('height', settings.height)

      canvas.append('g')
         .attr('class', 'yAxis')
         .call(yAxis)
         .style('pointer-events', 'unset')

      // GENERATE AREA
      canvas.append('path')
         .attr('fill', settings.background[mod[0]])
         .attr('opacity', settings.opacity)
         .attr('d', data.paths[mod[0]])

      // GENERATE DOTS FOR BREAKPOINTS
      canvas.selectAll('circle')
         .data(data[mod[0]])
            .enter().append('circle')
               .attr('cx', (data, i) => { return xScale(i) })
               .attr('cy', (data) => { return yScale(data) })
               .attr('r', dot)
               .attr('fill', settings.dot[mod[0]])
               .style('transition', '.2s')

               .on('mouseover', function(d) {
                  d3.select(this).attr("r", dot * 3)
                  $('#tooltip').html(formatnum(d, mod[1]))
                  $('#tooltip').css('opacity', 1)
                  $('#tooltip').css('left', d3.event.pageX - ($('#tooltip').width() / 1.5) + 'px')
                  $('#tooltip').css('top', d3.event.pageY + 20 + 'px')
               }) 
               .on('mouseout', function() {
                  d3.select(this).attr("r", dot)
                  $('#tooltip').css('opacity', 0)
               })
      });

   // RETURN UPDATED DATA OBJECT
   return data;
}

// GENERATE LINE PATH
function spread(data, settings) {

   // FETCH LINE SIZE BASED ON QUERY LIMIT
   var line = linesize(data, settings);
   
   // Y-SCALING
   var yScale = d3.scaleLinear()
      .domain([d3.max(data.spread.avg) * 1.5, (d3.max(data.spread.avg) * 0.2) * -1])
      .range([0, settings.height])

   // X-SCALING
   var xScale = d3.scaleLinear()
      .domain([0, data.spread.avg.length - 1])
      .rangeRound([0, settings.width])
   
   // GENERATE PATH METHOD
   var pathify = d3.line()
      .x((data, i) => { return xScale(i) })
      .y((data) => { return yScale(data) })

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
      .attr('stroke-width', line)
      .attr('opacity', settings.opacity)
      .attr('d', data.paths.spread)

   // GENERATE DOTS FOR BREAKPOINTS
   canvas.selectAll('line')
     .data(data.spread.size)
        .enter().append('line')
            .attr('x1', (d, i) => { return xScale(i) })
            .attr('y1', (d, i) => { return yScale(data.spread.avg[i] - (d.difference * 5)) })
            .attr('x2', (d, i) => { return xScale(i) })
            .attr('y2', (d, i) => { return yScale(data.spread.avg[i] + (d.difference * 5)) })
            .attr('stroke', settings.border.color)
            .attr('stroke-width', line)
            .attr('opacity', settings.opacity)
            .style('transition', '.2s')

            // MOUSEOVER/OUT CONFIG
            .on('mouseover', function(d) {
               $('#tooltip').html(textify(d))
               $('#tooltip').css('opacity', 1)
               $('#tooltip').css('left', d3.event.pageX - ($('#tooltip').width() / 1.5) + 'px')
               $('#tooltip').css('top', d3.event.pageY + 20 + 'px')
            }) 
            .on('mouseout', function() { $('#tooltip').css('opacity', 0) })

   // RETURN UPDATED DATA OBJECT
   return data;
}

// MAKE TOOLTIP TABLE FOR SPREAD STATS
function textify(stats) {
   var tbl = `
      <table>
         <tr>
            <td>High:</td>
            <td>` + stats.high.toFixed(2) + `</td>
         </tr>
         <tr>
            <td>Median:</td>
            <td>` + stats.median.toFixed(2) + `</td>
         </tr>
         <tr>
            <td>Low:</td>
            <td>` + stats.low.toFixed(2) + `</td>
         </tr>
      </table>
   `;

   return tbl;
}

// FORMAT NUMBER TO BE MORE READABLE
function formatnum(num, currency) {

   // IF OVER A THOUSAND, DIVIDE AND ADD 'K'
   if (num > 999) { num = Math.ceil(num / 1000) + 'K'; }

   // ADD THOUSAND SEPARATOR
   num = String(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   // ADD APPROPRIATE CURRENCY SUFFIX & RETURN
   num = num + ' ' + currency.toUpperCase();
   return num;
}

// FIGURE OUT DOTSIZE BASED ON QUERY LIMIT
function dotsize(data, settings) {

   var size = settings.radius.small;

   if (data.query.days < 151) {
      size = settings.radius.medium;
      if (data.query.days < 51) { size = settings.radius.large; }
   }

   return size;
}

// FIGURE OUT LINE SIZE BASED ON QUERY LIMIT FOR SPREAD CHART
function linesize(data, settings) {

   var size = settings.border.size.small;

   if (data.query.days < 151) {

      size = settings.border.size.medium;
      if (data.query.days < 51) { size = settings.border.size.large } 

   }

   return size;
}

// SHORTHAND FOR CONSOLE LOGGING
function log(stuff) { console.log(stuff); }