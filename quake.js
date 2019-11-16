const canvas = d3.select(".canva");

const width = '100%';
const height = '100%';
const api_url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const api_url_weekly = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';

const svg = canvas.append('svg')
    .attr('width', width)
    .attr('height', height);

// define div for tooltip
var div = d3.select("body")
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

function timeStampToDate(mTime) {
    var mDate = new Date(mTime);
    return mDate.toLocaleDateString("en-US");
}

// parse json
d3.json(api_url)
    .then(data => {
        // here we have our data and start putting all together
        console.log(data);

        const circles = svg.selectAll('circle')
            .data(data.features);
        console.log(data.features);

        // update existing circles
        circles
            .attr('cx', (d, i) => Math.floor(Math.random() * 200) + d.properties.mag * i)
            .attr('cy', (d, i) => Math.floor(Math.random() * 100) + d.properties.mag)
            .attr('r', (d, i) => d.properties.mag * 2)
            .attr('fill', (d, i) => d.properties.alert);

        // enter section
        circles.enter()
            .append('circle')
            .attr('cx', (d, i) => Math.floor(Math.random() * 200) + d.properties.mag * i)
            .attr('cy', (d, i) => Math.floor(Math.random() * 100) + d.properties.mag)
            .attr('r', (d, i) => d.properties.mag * 2)
            .attr('fill', (d, i) => d.properties.alert)
            .on('mouseover', (d, i, n) => {
                d3.select(n[i])
                    .transition()
                    .duration(100)
                    .style('opacity', 0.7);

                div.transition()
                    .duration(200)
                    .style('opacity', 0.9);

                div.html("<p> "+ d.properties.mag + "</p>" + "time: " +
                        "<p>"+ timeStampToDate(d.properties.time) + "</p>")
                    .style('left', (d3.event.pageX) + "px")
                    .style('top', (d3.event.pageY) + "px");

            }).on('mouseout', (d, i, n) => {
            d3.select(n[i])
                .transition()
                .duration(100)
                .style('opacity', 1);

            div.transition()
                .duration(500)
                .style('opacity', 0);
            });
    })
