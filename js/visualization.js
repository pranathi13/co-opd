const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;
const yTooltipOffset = 10;

// Company Scatter Plot:

const svg_company_scatter_plot = d3.select('#company-scatter-plot').append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g_company_scatter_plot = svg_company_scatter_plot.append('g')
    .attr('transform', `translate(${ MARGIN.LEFT }, ${ MARGIN.TOP })`);

// X Label:

g_company_scatter_plot.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 50)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Average Pay');

// Y Label

g_company_scatter_plot.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Average Rating');

d3.csv('data/coops.csv').then(data => {
  data.forEach(d => {
    d.pay = Number(d.pay);
    d.rating = Number(d.rating);
    d.company = String(d.company);
  });

  const groupedByCompany = d3.group(data, d => d.company);

  // Finds Average Pay for each Company:
  groupedByCompany.forEach(group => {
    group.averagePay = d3.mean(group, d => d.pay);
  });

  // Finds Average Rating for each Company:
  groupedByCompany.forEach(group => {
    group.averageRating = d3.mean(group, d => d.rating);
  });

  const arrayOfAveragePay = [];

  groupedByCompany.forEach((company) => {
    arrayOfAveragePay.push(company.averagePay);
  });

  const arrayOfAverageRating = [];

  groupedByCompany.forEach((company) => {
    arrayOfAverageRating.push(company.averageRating);
  });

  const maxPay = d3.max(arrayOfAveragePay);

  const maxRating = d3.max(arrayOfAverageRating);

  const x = d3.scaleLinear()
      .domain([ 0, maxPay ])
      .range([ 0, WIDTH ]);

  const y = d3.scaleLinear()
      .domain([ 0, maxRating ])
      .range([ HEIGHT, 0 ]);

  const xAxisCall = d3.axisBottom(x);
  g_company_scatter_plot.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${ HEIGHT })`)
      .call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  g_company_scatter_plot.append('g')
      .attr('class', 'y axis')
      .call(yAxisCall);

  //Tooltip:

  const tooltip = d3.select('#company-scatter-plot')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0)
      .attr('class', 'tooltip');

  const mouseover = (event, d) => {
    tooltip.html(
        `${ d[0].company }
<br>Average Pay: $${ d.averagePay }
<br>Average Rating: ${ d.averageRating }
<br>Number of Reviews: ${ d.length }`)
        .style('opacity', 1);
  };

  const mousemove = (event) => {
    //change the location data of the cursor
    tooltip.style('left', (event.pageX) + 'px').style('top', (event.pageY + yTooltipOffset) + 'px');
  };

  const mouseleave = () => {
    tooltip.style('opacity', 0);
  };

  // Circles:
  g_company_scatter_plot.selectAll('circle')
      .data(groupedByCompany.values())
      .enter()
      .append('circle')
      .attr('cx', d => x(d.averagePay))
      .attr('cy', d => y(d.averageRating))
      .attr('r', 5)
      .attr('fill', '#69b3a2')
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);

});

// Rating Distribution:

const svg_rating = d3.select('#rating-distribution').append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g_rating = svg_rating.append('g')
    .attr('transform', `translate(${ MARGIN.LEFT }, ${ MARGIN.TOP })`);

// X Label
g_rating.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 50)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Stars');

// Y label
g_rating.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Count');

d3.csv('data/coops.csv').then(data => {
  data.forEach(d => {
    d.rating = Number(d.rating);
  });

  // data = data.filter((d) => d.company == "Wayfair LLC")

  const ratingMap = d3.rollup(data, v => v.length, d => d.rating);

  const ratings = [
    { 'rating': 1, 'count': ratingMap.get(1) },
    { 'rating': 1.5, 'count': ratingMap.get(1.5) },
    { 'rating': 2, 'count': ratingMap.get(2) },
    { 'rating': 2.5, 'count': ratingMap.get(2.5) },
    { 'rating': 3, 'count': ratingMap.get(3) },
    { 'rating': 3.5, 'count': ratingMap.get(3.5) },
    { 'rating': 4, 'count': ratingMap.get(4) },
    { 'rating': 4.5, 'count': ratingMap.get(4.5) },
    { 'rating': 5, 'count': ratingMap.get(5) } ];

  const x = d3.scaleBand()
      .domain(ratings.map(d => d.rating))
      .range([ 0, WIDTH ]);

  const y = d3.scaleLinear()
      .domain([ 0, d3.max(ratings, d => d.count) ])
      .range([ HEIGHT, 0 ]);

  const xAxisCall = d3.axisBottom(x);
  g_rating.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${ HEIGHT })`)
      .call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  g_rating.append('g')
      .attr('class', 'y axis')
      .call(yAxisCall);

  const rects = g_rating.selectAll('rect')
      .data(ratings);

  rects.enter().append('rect')
      .attr('y', d => y(d.count))
      .attr('x', d => x(d.rating))
      .attr('width', x.bandwidth)
      .attr('height', d => HEIGHT - y(d.count))
      .attr('fill', 'black');
});

// Pay Distribution

const svg_pay = d3.select('#pay-distribution').append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g_pay = svg_pay.append('g')
    .attr('transform', `translate(${ MARGIN.LEFT }, ${ MARGIN.TOP })`);

// X Label
g_pay.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 50)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Pay ($/hr)');

// Y label
g_pay.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Count');

d3.csv('data/coops.csv').then(data => {
  data.forEach(d => {
    d.pay = Number(d.pay);
  });

  // data = data.filter((d) => d.company == "Wayfair LLC")

  const payMap = d3.rollup(data, v => v.length, d => d.pay);
  const compensations = [];

  for (const [ key, value ] of payMap) {
    let nonPaid = 0;
    let to15 = 0;
    let to20 = 0;
    let to25 = 0;
    let to30 = 0;
    let to35 = 0;
    let to40 = 0;
    let to45 = 0;
    let to50 = 0;
    let over50 = 0;

    if (key === 0) {
      nonPaid += value;
    } else if (key < 15) {
      to15 += value;
    } else if (key < 20) {
      to20 += value;
    } else if (key < 25) {
      to25 += value;
    } else if (key < 30) {
      to30 += value;
    } else if (key < 35) {
      to35 += value;
    } else if (key < 40) {
      to40 += value;
    } else if (key < 45) {
      to45 += value;
    } else if (key < 50) {
      to50 += value;
    } else if (key > 50) {
      over50 += value;
    }
    compensations.push(
        { 'pay': '0', 'count': nonPaid },
        { 'pay': '<15', 'count': to15 },
        { 'pay': '15-20', 'count': to20 },
        { 'pay': '20-25', 'count': to25 },
        { 'pay': '25-30', 'count': to30 },
        { 'pay': '30-35', 'count': to35 },
        { 'pay': '35-40', 'count': to40 },
        { 'pay': '40-45', 'count': to45 },
        { 'pay': '45-50', 'count': to50 },
        { 'pay': '>50', 'count': over50 });
  }

  const x = d3.scaleBand()
      .domain(compensations.map(d => d.pay))
      .range([ 0, WIDTH ]);

  const y = d3.scaleLinear()
      .domain([ 0, d3.max(compensations, d => d.count) ])
      .range([ HEIGHT, 0 ]);

  const xAxisCall = d3.axisBottom(x);
  g_pay.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${ HEIGHT })`)
      .call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  g_pay.append('g')
      .attr('class', 'y axis')
      .call(yAxisCall);

  const rects = g_pay.selectAll('rect')
      .data(compensations);

  rects.enter().append('rect')
      .attr('y', d => y(d.count))
      .attr('x', d => x(d.pay))
      .attr('width', x.bandwidth)
      .attr('height', d => HEIGHT - y(d.count))
      .attr('fill', 'black');
});



  /************************************
   * Grouped bar chart for colleges
  *************************************/

  // Set constants
  const widthCollege = 900;
  const heightCollege = 450;
  const marginCollege = {left:50, right:50, bottom:50, top:50}; 

  // Appends the svg to the body of the page 

  const svgCollege = d3
      .select("#csv-college")
      .append("svg")
      .attr("width", widthCollege-marginCollege.left-marginCollege.right)
      .attr("height", heightCollege - marginCollege.top - marginCollege.bottom)
      .attr("viewBox", [0, 0, widthCollege, heightCollege]);

  //Get the data

  d3.csv("data/coops.csv").then(function(data) {

      let datacoops = d3.nest()
        .key(function(d) {return d.nThCoop; })
        .key(function(d) {return d.college; })
        .rollup(function(v) {return v.length; })
        .entries(data)

        const colleges = unique(data.map(d => d.college))


        const x = d3.scaleBand()
        .domain(datacoops.map(d => d.key))
        .range([marginCollege.left, widthCollege - marginCollege.right])
        .padding(0.1);

        const subx = d3.scaleBand()
        .range([0, x.bandwidth()])
        .domain(colleges)
        .padding(0.05);

        const max = d3.max(
          datacoops,
          d => d3.max(d.values, e => e.value));

        const y = d3.scaleLinear()
        .domain([0, max])
        .range([heightCollege - marginCollege.bottom, marginCollege.top]);

        




  })

