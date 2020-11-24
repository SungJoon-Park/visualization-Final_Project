let width = 500,
  height = 700;

const margin = { top: 40, right: 50, bottom: 50, left: 40 };

const svg = d3
  .select('#line-chart-container')
  .append('svg')
  .attr('width', width + 1000)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Load CSV file
d3.csv('data/clean/netflix-movie.csv').then((data) => {
  console.log(data);

  // Axes
  let x = d3.scaleLinear().range([0, width]).domain([2012, 2019]);
  // y-axis for Movie Tickets
  let y = d3.scaleLinear().range([height, 0]).domain([1200, 1400]);

  let y1 = d3.scaleLinear().range([height, 0]).domain([50, 250]);

  //connecting the dots
  let line = d3
    .line()
    .curve(d3.curveCatmullRom)
    .x((d) => x(d.Year) + 101)
    .y((d) => y(d.MovieTickets));

  let line1 = d3
    .line()
    .curve(d3.curveCatmullRom)
    .x((d) => x(d.Year) + 101)
    .y((d) => y1(d.NetflixSubscribers));

  const l = length(line(data));
  const l1 = length(line1(data));

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-dasharray', `0,${l}`)
    .attr('d', line)
    .transition()
    .duration(3000)
    .ease(d3.easeLinear)
    .attr('stroke-dasharray', `${l},${l}`);

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#ff3399')
    .attr('stroke-width', 2.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-dasharray', `0,${l1}`)
    .attr('d', line1)
    .transition()
    .duration(3000)
    .ease(d3.easeLinear)
    .attr('stroke-dasharray', `${l1},${l1}`);

  let xAxis = (g) =>
    g
      .attr('transform', `translate(100,${height - 60})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickFormat(d3.format('d'))
      )
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('y2', -height)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', width + 10)
          .attr('y', -4)
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'end')
          .attr('fill', 'black')
          .text('Year')
      );
  //yAxis for movie tickets
  let yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left + 30}-10)`)
      .call(d3.axisLeft(y).ticks(width / 110))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width + 80)
          .attr('stroke-opacity', 0.1)
      )
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 6)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('fill', 'blue')
          .text('Number of Movie Tickets Sold, US  (million)')
      );
  //yAxis for netflix
  let yAxis1 = (g) =>
    g
      .attr('transform', `translate(${margin.left + 605}-10)`)
      .call(d3.axisRight(y1).ticks(width / 110))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -170)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('fill', '#ff3399')
          .text('Netflix Subscriptions, US (million)')
      );

  svg.append('g').call(xAxis);
  svg.append('g').call(yAxis);
  svg.append('g').call(yAxis1);

  const datapoints = svg.append('g').selectAll('circle').data(data).enter();

  const datapoints1 = svg.append('g').selectAll('circle').data(data).enter();

  // chart
  // add circles
  datapoints
    .append('circle')
    .on('mouseenter', (event, d) => {
      const pos = d3.pointer(event, window);

      console.log(pos);

      d3.select('.tooltip')
        .style('display', 'inline-block')
        .style('opacity', 0.8)
        .style('left', pos[0] + 'px')
        .style('top', pos[1] + 'px')
        .html(d.MovieTickets);
    })
    .on('mouseleave', function (d) {
      d3.select('.tooltip')
        .style('display', 'hidden')
        .style('opacity', 0)
        .html('');
    })
    .attr('cx', (d) => x(d.Year) + 101)
    .attr('cy', (d) => y(d.MovieTickets))
    .attr('r', 3.5)
    .style('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  datapoints1
    .append('circle')
    .on('mouseenter', (event, d) => {
      const pos = d3.pointer(event, window);

      console.log(pos);

      d3.select('.tooltip')
        .style('display', 'inline-block')
        .style('opacity', 0.8)
        .style('left', pos[0] + 'px')
        .style('top', pos[1] + 'px')
        .html(d.NetflixSubscribers);
    })
    .on('mouseleave', function (d) {
      d3.select('.tooltip')
        .style('display', 'hidden')
        .style('opacity', 0)
        .html('');
    })
    .attr('cx', (d) => x(d.Year) + 101)
    .attr('cy', (d) => y1(d.NetflixSubscribers))
    .attr('r', 3.5)
    .style('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  function length(path) {
    return d3.create('svg:path').attr('d', path).node().getTotalLength();
  }
});
