// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let tooltip = d3.select("body")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

let svg_1 = d3.select("#graph1")
    .append("svg")
    .attr('width', graph_1_width)     // HINT: width
    .attr('height', graph_1_height)     // HINT: height
    .append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`);    // HINT: transform

// Set up reference to count SVG group

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);
    
let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability

let countRef = svg_1.append("g");
let y_axis_label = svg_1.append("g");

let x_middle = ((MAX_WIDTH / 2) - 10) / 2  - 150;
let y_middle = 100;

// TODO: Add x-axis label
svg_1.append("text")
    .attr("transform", `translate(${x_middle} , 200)`)  
    .style("text-anchor", "middle")
    .text("Count");

// TODO: Add y-axis label
svg_1.append("text")
    .attr("transform", `translate(-100, ${y_middle})`) 
    .style("text-anchor", "middle")
    .text("Year");
    
// TODO: Add chart title
svg_1.append("text")
    .attr("transform", `translate(${x_middle}, -20)`) 
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("The number of football games by year");


function setData(index) {
    d3.csv('data/football.csv').then(function(data) {

        data = cleanData_1(data);
        if (index == 0){
            data = data.slice(0, 10);
        } else {
            data = data.slice(10, 20)
        }
    
        let NUM_EXAMPLES = data.length;

        x.domain([0, d3.max(data, function(d) {
            return d.count;
        })]);

        y.domain(data.map(d => d["year"]));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));
     
        let bars = svg_1.selectAll("rect").data(data);
    
        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d["year"] }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));
    
        //let rectHeight = graph_1_height / NUM_EXAMPLES;
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d["year"]) }) 
            .attr("x", x(0))
            .attr("y", function(d, i) {
                return y(d.year);
            })              
            .attr("width", d => x(d.count))
            .attr("height",  y.bandwidth());       
    
        let counts = countRef.selectAll("text").data(data);
    
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", d => x(d.count))       
            .attr("y", d => y(d.year)+10)  
            .style("text-anchor", "start")
            .text(d => d.count);
    
        bars.exit().remove();
        counts.exit().remove();
        
    });
}
// TODO: Load the artists CSV file into D3 by using the d3.csv() method


function cleanData_1(data) {
    
    data.forEach(d => {
        const date = new Date(d.date);
        d.date = date.getFullYear();
    });

    let yearCounts = data.reduce(function(obj, d){
        if (!obj[d.date]) {
            obj[d.date] = 1;
        } else {
            obj[d.date]++;
        }
        return obj;
    }, {});

    let to_return = [];
    let a = Object.keys(yearCounts);

    a.forEach(key => {
        to_push = {
           "year" : key,
           "count" : yearCounts[key]
        }
        to_return.push(to_push);
    });
    return to_return.slice(-21, -1);
}

setData(0)



// Set up reference to count SVG group

d3.csv('data/football.csv').then(function(data) {

    data = cleanData_2(data);

    let svg_2 = d3.select("#graph2")
    .append("svg")
    .attr('width', graph_2_width + margin.left + margin.right)     // HINT: width
    .attr('height', graph_2_height + margin.top + margin.bottom)     // HINT: height
    .append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`);    // HINT: transform

    

    let mouseover = function(d) {
        let color_span = `<span style="color: #ff5c7a;">`;
        let html = `${d.text}<br/>
                Total Games: ${color_span}${d.total}</span><br/>
                Winning Games: ${color_span}${d.win}</span><br/>
                Winning Percentage: ${color_span}${d.p}%</span><br/>
                Rank: ${color_span}${d.index}</span>`;       // HINT: Display the song here

        // Show the tooltip and set the position relative to the event X and Y location
        tooltip.html(html)
            .style("left", `${(d3.event.pageX) - 220}px`)
            .style("top", `${(d3.event.pageY) - 30}px`)
            .style("box-shadow", "2px 2px 5px #ff5c7a")
            .transition()
            .duration(200)
            .style("opacity", 1)
    };

    // Mouseout function to hide the tool on exit
    let mouseout = function(d) {
        // Set opacity back to 0 to hide
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };

    svg_2.append("text")
        .attr("transform", `translate(${x_middle}, 0)`) 
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top 10 Winning Percentage Countries");

    let layout = d3.layout.cloud()
        .size([graph_2_width, graph_2_height])
        .words(data.map(function(d) { return {text: d.country, size: d.p, total: d.total, win: d.win, p: d.p, index: data.indexOf(d) + 1}; }))
        .padding(5)        //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 360; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", function (words) {
            svg_2.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; })
            .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout);
        })
        
    layout.start();
        
});

// TODO: Load the artists CSV file into D3 by using the d3.csv() method


function cleanData_2(data) {
    total = {};
    count = {};
    data.forEach(d => {
        const home_team = d.home_team;
        const away_team = d.away_team;
        const home_score = d.home_score;
        const away_score= d.away_score;
        if (!total[home_team]) {
            total[home_team] = 0;
            count[home_team] = 0;
        }
        if (!total[away_team]) {
            total[away_team] = 0;
            count[away_team] = 0;
        }

        total[home_team]++;
        total[away_team]++;
        

        if (home_score > away_score) {
            count[home_team]++;
        }
        else if (away_score > home_score) {
            count[away_team]++;
        }
    });

    let to_return = [];
    let a = Object.keys(total);

    a.forEach(key => {
        let per = parseFloat((count[key]/total[key]).toFixed(4));
        to_push = {
           "country" : key,
           "total" : total[key],
           "win": count[key],
           "p": parseFloat((per * 100).toFixed(2))
        }
        to_return.push(to_push);
    });
    let sorted = to_return
    .filter(function (a) {
        return a.total > 100;
    })
    .sort(function(a, b) {
        return b.p - a.p;
    }).slice(0, 10);
    return sorted;
}

let data3;

let svg_graph = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const forceX = d3.forceX(graph_3_width / 2).strength(0.05);
const forceY = d3.forceY((graph_3_height + margin.top) / 2).strength(0.05);

let graph_title = svg_graph.append("text")
    .attr("transform", `translate(${(graph_3_width / 2)}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Top performing country in last two World Cup");

let simulation = d3.forceSimulation()
    .force('x', forceX)
    .force('y',  forceY)
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter((graph_3_width - margin.right) / 2,
        (graph_3_height - margin.top) / 2));

let color_artists = d3.scaleOrdinal(d3.schemeTableau10);

d3.csv('data/football.csv').then(function(d) {
    data3 = d;
    createGraph();
});

function createGraph() {
    let links = [], nodes = [], output_links = [];

    link_info = cleanData_4(data3);
    
    link_info.forEach(d => {
        links.push([d.home_country, d.away_country, d.score]);
    });

    let node_info = cleanData_3(data3);

    let count = function(pair) {
        let c = 0;
        links.forEach(function(l) {
            if ((l.home_country == pair.home_country && l.away_country == pair.away_country) ||
            (l.home_country == pair.away_country && l.away_country == pair.home_country)) {
                c++;
            }
        });
        return c;
    };
    let i = 0;

    links.forEach(function(a) {
        let html = `${a[0]} ${a[2]} ${a[1]}`;
        output_links.push({source: a[0], target: a[1], value: count(a), html: html, id: i});
        i++;
    });

    i = 0;
    node_info.forEach(function(b) {
        let a = b.country;
        let group = Math.round(node_info.indexOf(b) * (10.0 / node_info.length));
        nodes.push({id: a, group: group, count: b.score, idx: i, html: `${a}<br/>
        Total Games: ${b.total}</span><br/>
        Winning Games: ${b.win}</span><br/>
        Winning Percentage: ${b.p}%</span><br/>
        Score: ${b.score}</span>`});
        i++;
    });

    startGraph({nodes: nodes, links: output_links});
}

let node_size = d3.scaleLinear().range([4, 10]);

function startGraph(graph) {
    // Set up D3 linear scale for the node size based on the number of connections an artist has
    node_size.domain(d3.extent(graph.nodes, function(d) { return parseInt(d.count); }));

    // Use graph.links to create lines with width as a function of number of collaborations
    let link = svg_graph.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", "2")
        .attr("id", function(d) { return `link-${d.id}` })
        .on("mouseover", function(d) { flow_mouseover(d, "html", "link") })
        .on("mouseout", function(d) { flow_mouseout(d, "html", "link")} );

    // Use graph.nodes to create circles for each artist
    let node = svg_graph.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g");
    node.append("circle")
        .attr("r", function(d) { return node_size(parseInt(d.count)) })
        .attr("fill", function(d) { return color_artists(d.group); })
        .attr("id", function(d) { return `node-${d.idx}` })
        .on("mouseover", function(d) { flow_mouseover(d, "html", 'node') })
        .on("mouseout", function(d) { flow_mouseout(d, "html", 'node') })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    // Set up simulation handlers and simulation link force
    simulation.nodes(graph.nodes).on("tick", ticked);
    simulation.force("link").links(graph.links);

    function ticked() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
                // Set up boundary box to prevent animation from going past SVG dimensions
                let radius = Math.round(node_size(parseInt(d.count)));
                d.x = Math.max(radius,
                    Math.min(graph_3_width - radius, d.x));
                d.y = Math.max(radius,
                    Math.min((graph_3_height - margin.top - margin.bottom) - radius, d.y));
                return "translate(" + d.x + "," + d.y + ")";
            });
    }
}

// Mouseover function to display the tooltip on hover
let flow_mouseover = function(d, attr, id) {
    if (id === "node") {
        svg_graph.select(`#node-${d.idx}`).attr("fill", function(d) {
            return darkenColor(color_artists(d.group), 0.5);
        }).attr("r", function(d) {
            return node_size(parseInt(d.count)) * 1.5;
        })
    } else {
        svg_graph.select(`#link-${d.id}`).attr("stroke-width", '7');
    }

    let html = `${d[attr]}`;

    tooltip.html(html)
        .style("left", `${(d3.event.pageX) - 50}px`)
        .style("top", `${(d3.event.pageY) + 30}px`)
        .style("box-shadow", `1px 1px 5px`)
        .transition()
        .duration(200)
        .style("opacity", 0.9)
};

// Mouseout function to hide the tool on exit
let flow_mouseout = function(d, attr, id) {
    if (id === "node") {
        svg_graph.select(`#node-${d.idx}`).attr("fill", function(d) {
            return color_artists(d.group);
        }).attr("r", function(d) {
            return node_size(parseInt(d.count));
        })
    } else {
        svg_graph.select(`#link-${d.id}`).attr("stroke-width", '2');
    }

    // Set opacity back to 0 to hide
    tooltip.transition()
        .duration(200)
        .style("opacity", 0);
};

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function cleanData_3(data) {
    total = {};
    count = {};
    score = {};
    let sorted = data
    .filter(function (a) {
        return (a.tournament == 'FIFA World Cup' && (new Date(a.date).getFullYear() == 2018 || new Date(a.date).getFullYear() == 2014));
    });
    sorted.forEach(d => {
        const home_team = d.home_team;
        const away_team = d.away_team;
        const home_score = d.home_score;
        const away_score= d.away_score;
        if (!total[home_team]) {
            total[home_team] = 0;
            count[home_team] = 0;
        }
        if (!total[away_team]) {
            total[away_team] = 0;
            count[away_team] = 0;
        }

        total[home_team]++;
        total[away_team]++;

        if (home_score > away_score) {
            count[home_team]++;
        }
        else if (away_score > home_score) {
            count[away_team]++;
        }
    });

    let to_return = [];
    let b = [];
    let a = Object.keys(total);

    a.forEach(key => {
        if (count[key] > 5){
            b.push(key);
        }
    });

    sorted.forEach(d => {
        const home_team = d.home_team;
        const away_team = d.away_team;
        const home_score = d.home_score;
        const away_score= d.away_score;
        if (!score[home_team]) {
            score[home_team] = 0;
        }
        if (!score[away_team]) {
            score[away_team] = 0;
        }

        if (home_score > away_score && b.includes(away_team)) {
            score[home_team] += 5;
        }
        else if (away_score > home_score && b.includes(home_team)) {
            score[away_team] += 5;
        }
        else if (home_score > away_score && !b.includes(away_team)) {
            score[home_team] += 3;
        }
        else if (away_score > home_score && !b.includes(home_team)) {
            score[away_team] += 3;
        }
        else if (away_score == home_score && (b.includes(away_team) || b.includes(home_team))) {
            score[away_team] += 2;
            score[home_team] += 2;
        }
        else if (away_score == home_score && !(b.includes(away_team) || b.includes(home_team))) {
            score[away_team] += 1;
            score[home_team] += 1;
        }
    });

    a.forEach(key => {
        let per = parseFloat((count[key]/total[key]).toFixed(4));
        to_push = {
           "country" : key,
           "total" : total[key],
           "win": count[key],
           "p": parseFloat((per * 100).toFixed(2)),
           "score": score[key]
        }
        to_return.push(to_push);
    });

    return to_return;
}

function cleanData_4(data) {
    let sorted = data
    .filter(function (a) {
        return (a.tournament == 'FIFA World Cup' && (new Date(a.date).getFullYear() == 2018 || new Date(a.date).getFullYear() == 2014));
    });

    let to_return = [];

    sorted.forEach(key => {
        to_push = {
           "home_country" : key.home_team,
           "away_country" : key.away_team,
           "score" : key.home_score + ' : ' + key.away_score
        };
        to_return.push(to_push);
    });

    return to_return;
}

function darkenColor(color, percentage) {
    return d3.hsl(color).darker(percentage);
}