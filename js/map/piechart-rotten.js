export default function PieChart(container) {
  const margin = { top: 20, right: 50, bottom: 20, left: 50 };
  const width = 400 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const group = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  const color = d3.scaleOrdinal(['steelblue', 'red', 'grey']);

  const arc = d3.arc().innerRadius(0).outerRadius(50);

  function update(data) {
    console.log('piechart', data);

    color.domain(data);

    const arcs = d3.pie()(data);

    group
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', (d) => color(d.data))
      .attr('d', arc);
  }

  return {
    update,
  };
}
