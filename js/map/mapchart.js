import mapDataProcessor from './mapDataProcessor.js';
import BarChart from './barchart.js';
import PieChart from './piechart-rotten.js';
import StarChart from './starChart.js';

export default function MapChart(container) {
  // initialization
  // Create a SVG with the margin convention
  const margin = { top: 20, right: 20, bottom: 20, left: 50 };
  const width = 1000 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  const barChart = BarChart('#bar-chart-container');
  const pieChart = PieChart('#Rotten-tomato-container');
  const starChart = StarChart('#IMDB-chart-container');

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  function update(worldmap, obj) {
    ////// MAP CHART //////
    const topo = topojson.feature(worldmap, worldmap.objects.countries);
    const features = topo.features;
    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      topo
    );

    const path = d3.geoPath().projection(projection);
    const yo = {};

    const objKeys = Object.keys(obj);
    const totalExtent = d3.extent(objKeys, (d) => obj[d].total);

    console.log(totalExtent);

    const mouseover = function (e, d) {
      d3.selectAll('.world-map')
        .transition()
        .duration(200)
        .style('opacity', 0.2);
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .style('stroke-width', 5)
        .style('stroke', 'black');

      const country = d.properties.name;
      const countryVal = obj[country];
      const mapProcessed = mapDataProcessor.barProcess(countryVal);

      const rottenScore = Math.floor(countryVal['Rotten']);
      const pieData = [rottenScore, 100 - rottenScore, 0];

      const imdb = countryVal['IMDB'];
      const imdbRounded = (Math.round(imdb * 100) / 100).toFixed(2);

      const starProcessed = mapDataProcessor.starProcess(imdbRounded);

      //   starChart.update(starProcessed);

      barChart.update(mapProcessed);

      pieChart.update(pieData);
    };

    const mouseleave = function (e, d) {
      d3.selectAll('.world-map').transition().duration(200).style('opacity', 1);
      d3.select(this).transition().duration(200).style('stroke', 'transparent');
    };

    svg
      .selectAll('path')
      .data(features)
      .join('path')
      .attr('class', 'world-map')
      .attr('fill', (d) => {
        const country = d.properties.name;
        if (obj[country] !== undefined) {
          return 'steelblue';
        }
        return 'grey';
      })
      .attr('d', path)
      .style('opacity', 1)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave);

    const keys = Object.keys(obj);
    const filter = keys.filter((v) => yo[v] !== true);
    console.log('filter', filter);

    svg
      .append('path')
      .datum(topojson.mesh(worldmap, worldmap.objects.countries))
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('class', 'world-map subunit-boundary')
      .style('opacity', 1);
  }

  return {
    update,
  };
}
