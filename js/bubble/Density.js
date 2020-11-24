export default function DensityChart(container) {
    const margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 50
        },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3
        .select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    const xAxis = d3.axisBottom()
        .scale(x);

    const yAxis = d3.axisLeft()
        .scale(y);

    let xDisplay = group
        .append('g')
        .attr('class', 'axis x-axis');

    let yDisplay = group
        .append('g')
        .attr('class', 'axis y-axis');

    function update(data, category) {
        let obj = [];
        data.forEach(d => {
            let runtime = d.Runtime;
            if (d.category === category) {
                obj.push({
                    "Runtime": runtime
                });
            }
        });

        x.domain([0, d3.max(obj, d => d.Runtime)]);
        xDisplay
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        var histogram = d3.histogram()
            .value((d) => d.Runtime)
            .domain(x.domain())
            .thresholds(x.ticks(80));

        var bins = histogram(obj);

        y.domain([0, d3.max(bins, d => d.length)]);
        yDisplay
            .call(yAxis);

        let bars = group.selectAll(".rect")
            .data(bins)
            .join("rect")
            .attr("x", 1)
            .attr("transform", function (d) {
                return "translate(" + x(d.x0) + "," + y(d.length) + ")";
            })
            .attr("width", function (d) {
                return x(d.x1) - x(d.x0);
            })
            .attr("height", function (d) {
                return height - y(d.length);
            })
            .style("fill", "#69b3a2");
        bars
            .on("mouseover", (event, d) => {

                d3.select('.tooltip')
                    .html(() => {
                        console.log(d[0].Runtime);
                        console.log(d.length);
                        return
                    });
            })
            .on("mouseout", (event, d) => {
                d3.select('.tooltip')
                    .style('display', 'none');
            });

        bars.exit().remove();


        // let label = svg.selectAll('div')
        //     .data(category)
        //     .join('text')
        //     .attr('class', 'text')
        //     .text(data)
        //     .attr('x', 1000 + 15)
        //     .attr('y', (d, i) => 308 + i * 15)
        //     .attr('text-anchor', 'beginning')
        //     .attr('font-size', 12);
    }

    function remove() {
        group.selectAll('svg').remove();
    }

    return {
        update,
        remove,
    };
}