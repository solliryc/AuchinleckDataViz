const width = 600;
const height = 300;
const margin = ({top: 30, right: 0, bottom: 30, left: 40})
let color = 'steelBlue'

// Promise.all([...]) to open multiple csv files
d3.dsv(';','data/NBCN-m.csv', function(d){
    return {
        station: d.stn,
        year: d.time.substr(0, 4),
        month: d.time.substr(4, 2),
        temp_moy: parseFloat(d.tre200m0),
    }
}).then(function(data) {

    const station = data.filter(d => d.station === 'NEU' && d.year === '2019');

    console.log(station)
    
    const svg = d3.select('.main')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'font: 10px sans-serif');
    
    // Créer l'échelle verticale
    const y = d3.scaleLinear()
    .domain([0, d3.max(station, d => d.temp_moy)])
    .range([height - margin.bottom, margin.top])
    .interpolate(d3.interpolateRound);
    
    // Créer l'échelle horizontale
    const x = d3.scaleBand()
    .domain(station.map(d => d.month))
    .range([margin.left, width - margin.right])
    .padding(0.1)
    .round(true);
    
    const teinte = d3.scaleSequential()
    .domain([0, d3.max(station, d => d.temp_moy)])
    .interpolator(d3.interpolateBlues)
    
    // Ajouter les barres
    svg.append('g')
    .selectAll('rect')
    .data(station)
    .enter()
    .append('rect')
    .attr('height', d => y(0) - y(d.temp_moy))
    .attr('width', x.bandwidth())
    .attr('y', (d => y(d.temp_moy)))
    .attr('x', d => x(d.month))
    .style('fill', d => teinte(d.temp_moy))
    
    // Ajouter les titres
    svg.append('g')
    .style('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${x.bandwidth() / 2}, 10)`)
    .selectAll('text')
    .data(station)
    .enter()
    .append('text')
    .attr('y', d => y(d.temp_moy))
    .attr('x', d => x(d.month))
    .attr('dy', '0.35em')
    .text(d => d.temp_moy)
    
    var xAxisTranslate = height - 20;
    
    svg.append('g')
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    
    svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y))
    //.call(g => g.select('.domain').remove())
});



