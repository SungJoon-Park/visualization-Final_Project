import mapDataProcessor from './js/map/mapDataProcessor.js';
import MapChart from './js/map/mapChart.js';
import PieChart from './js/pie/piechart.js';
import BubbleChart from './js/bubble/Bubble.js';

Promise.all([
  d3.json('./data/raw/world-110m.json'),
  d3.csv('./data/clean/streaming_platform_map.csv', d3.autoType),
]).then(([worldmap, data]) => {
  const processedObj = mapDataProcessor.mapProcess(data);

  const mapChart = MapChart('#map-chart-container');
  mapChart.update(worldmap, processedObj);
});

d3.csv('./data/clean/streaming_platform_pie.csv', d3.autoType).then((data) => {
  let type = 'all';
  d3.select('#group-by').on('change', (e) => {
    type = e.target.value;
    pieChart.update(data, type);
  });

  const pieChart = PieChart('#pie-chart-container');
  pieChart.update(data, type);
});

d3.csv('./data/clean/streaming_platform_bubble.csv', d3.autoType).then(
  (data) => {
    let movies = data.filter((d) => {
      if (0 < d.IMDb <= 10 && d.Genres) {
        return d;
      }
    });
    let dataset = movies.slice(0, 600);
    const Bubble = BubbleChart('#bubble-chart-container');
    Bubble.update(dataset);
  }
);
