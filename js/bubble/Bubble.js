import DensityChart from './Density.js';

export default function BubbleChart(container) {
  const w = 1200,
    h = 600;
  const rScale = d3.scaleLinear().range([4, 10]).clamp(true);
  const cScale = d3.scaleOrdinal(d3.schemeTableau10);
  const centerScale = d3.scalePoint().padding(1).range([0, w]);
  const forceStrength = 0.05;

  let svg = d3
    .select(container)
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // const drag = (simulation) => {
  //     function started(event) {
  //         if (!event.active) simulation.alpha(1).restart();
  //         event.subject.fx = event.subject.x;
  //         event.subject.fy = event.subject.y;
  //     }

  //     function dragged(event) {
  //         event.subject.fx = event.x;
  //         event.subject.fy = event.y;
  //     }

  //     function ended(event) {
  //         if (!event.active) simulation.alphaTarget(0.0);
  //         event.subject.fx = null;
  //         event.subject.fy = null;

  //     }
  //     return d3.drag()
  //         .on("start", started)
  //         .on("drag", dragged)
  //         .on("end", ended);
  // }

  const density = DensityChart('#runtime-distribution');

  function update(data) {
    //for color variations
    data.forEach((d) => {
      let genre = d.Genres;

      if (
        genre == 'Action' ||
        genre == 'Adventure' ||
        genre == 'Sci-Fi' ||
        genre == 'Fantasy'
      ) {
        d.category = 'genre1';
      } else if (
        genre == 'Comedy' ||
        genre == 'Talk-Show' ||
        genre == 'Game-Show'
      ) {
        d.category = 'genre2';
      } else if (genre == 'Biography' || genre == 'Documentary') {
        d.category = 'genre3';
      } else if (
        genre == 'Horror' ||
        genre == 'Mystery' ||
        genre == 'Thriller' ||
        genre == 'Crime' ||
        genre == 'Film-Noir'
      ) {
        d.category = 'genre4';
      } else if (
        genre == 'Drama' ||
        genre == 'Family' ||
        genre == 'Animation'
      ) {
        d.category = 'genre5';
      } else {
        d.category = 'genre6';
      }
    });

    rScale.domain(d3.extent(data, (d) => d.IMDb));

    data.forEach(function (d) {
      d.x = w / 2;
      d.y = h / 2;
    });

    var circles = svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('r', (d) => rScale(d.IMDb))
      .attr('cx', (d, i) => {
        return 175 + 25 * i + 2 * i ** 2;
      })
      .attr('cy', (d) => 250)
      .style('fill', (d, i) => {
        return cScale(d.category);
      })
      // .style("stroke", "black")
      // .style("stroke-width", 1)
      .style('pointer-events', 'all');
    // .call(drag(simulation));

    circles.append('title').text((d) => d.Title);

    // circles
    //     .on("mouseover", (event, d) => {

    //         d3.select('.tooltip')
    //             .html(() => {
    //                 console.log(d.Title);
    //                 console.log(d.Genres);
    //                 console.log(d.IMDb);
    //                 return d.Genres
    //             });
    //     })
    //     .on("mouseout", (event, d) => {

    //         d3.select('.tooltip')
    //             .style('display', 'none');
    //     });

    circles.on('click', (event, d) => {
      density.remove();

      density.update(data, d.category);
    });
    circles.on('dbclick', (event, d) => {
      density.remove();
    });

    function ticked() {
      circles
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });
    }

    const simulation = d3
      .forceSimulation()
      .force(
        'collide',
        d3.forceCollide(d3.max(data, (d) => d.IMDb)).iterations(5)
      )
      // .force("charge", d3.forceManyBody().strength(5))
      .force('y', d3.forceY().y(h / 2))
      .force('x', d3.forceX().x(w / 2));

    simulation.nodes(data).on('tick', ticked);

    let color_domain = cScale.domain().sort();

    // let legend = svg.selectAll('rect')
    //     .data(color_domain)
    //     .enter()
    //     .append('rect')
    //     .attr('class', 'box')
    //     .attr('width', 10)
    //     .attr('height', 10)
    //     .attr('x', 1000)
    //     .attr('y', (d, i) => 300 + i * 15)
    //     .attr('fill', d => cScale(d));

    // let label = svg.selectAll('div')
    //     .data(color_domain)
    //     .join('text')
    //     .attr('class', 'region')
    //     .text(d => {
    //         let genre_title;
    //         if (d === "genre1") {
    //             genre_title = "Action & Adventure & Sci-Fi & Fantasy"
    //         } else if (d === "genre2") {
    //             genre_title = "Comedy & Talk-Show & Game-Show & Reality-TV"
    //         } else if (d === "genre3") {
    //             genre_title = "Biography & Documentary & History"
    //         } else if (d === "genre4") {
    //             genre_title = "Horror & Mystery & Thriller & Crime & Film-Noir"
    //         } else if (d === "genre5") {
    //             genre_title = "Drama & Romance & Family & Animation"
    //         } else {
    //             genre_title = "Others"
    //         }
    //         return genre_title;
    //     })
    //     .attr('x', 1000 + 15)
    //     .attr('y', (d, i) => 308 + i * 15)
    //     .attr('text-anchor', 'beginning')
    //     .attr('font-size', 12);

    function hideTitles() {
      svg.selectAll('.title').remove();
    }

    function showTitles(byVar, scale) {
      // Another way to do this would be to create
      // the year texts once and then just hide them.
      // let box = svg.selectAll('.title')
      //     .data(scale.domain())
      //     .join('rect')
      //     .attr('class', 'text box')
      //     .attr('x', (d) => scale(d)-80)
      //     .attr('y', 300)
      //     .attr('width',150)
      //     .attr('height',20)
      //     .attr('opacity',0.4);
      var titles = svg
        .selectAll('.title')
        .data(scale.domain())
        .join('text')
        .attr('class', 'title')
        .attr('x', (d) => scale(d))
        .attr('y', 300)
        .attr('text-anchor', 'middle')
        .style('font-size', 16)
        .style('font-weight', 'bold')
        .html((d) => {
          let genre_title;
          if (d === 'genre1') {
            // genre_title = "Action & Adventure & Sci-Fi & Fantasy"
            genre_title = 'Action & Adventure';
          } else if (d === 'genre2') {
            // genre_title = "Comedy & Talk-Show & Game-Show & Reality-TV"
            genre_title = 'Comedy & Shows';
          } else if (d === 'genre3') {
            genre_title = 'Bio & Documentary';
          } else if (d === 'genre4') {
            genre_title = 'Horror & Crime';
          } else if (d === 'genre5') {
            genre_title = 'Drama & Family & Animation';
          } else {
            genre_title = 'Others';
          }
          return genre_title;
        });

      titles.exit().remove();
    }

    function splitBubbles(byVar) {
      if (byVar === 'All') {
        hideTitles();
        simulation.force('x', d3.forceX().x(w / 2));
      } else if (byVar === 'Genres') {
        const category_map = data.map((d) => d.category);
        category_map.sort();

        centerScale.domain(category_map);
        showTitles(byVar, centerScale);
        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force(
          'x',
          d3
            .forceX()
            .strength(forceStrength)
            .x((d) => centerScale(d.category))
        );
      }

      // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(2).restart();
    }

    function setupButtons() {
      d3.selectAll('.button').on('click', function () {
        // Remove active class from all buttons
        d3.selectAll('.button').classed('active', false);
        // Find the button just clicked
        var button = d3.select(this);

        // Set it as the active button
        button.classed('active', true);

        // Get the id of the button
        var buttonId = button.attr('id');

        console.log(buttonId);
        // Toggle the bubble chart based on
        // the currently clicked button.
        splitBubbles(buttonId);
      });
    }

    setupButtons();
  }
  return {
    update,
  };
}
