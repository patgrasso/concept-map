// Please don't judge me -- it's just a prototype ;)

function drawSemNet(links) {
  var nodes = {};

  links.forEach((link) => {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
  });

  console.log(nodes);
  console.log(links);

  var width = 2000,
      height = 1000;

  var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(50)
        .charge(-1000)
        .theta(0.1)
        .gravity(0.05)
        .on('tick', tick)
        .start();

  var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

  var link = svg.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
          .attr('id', (d, i) => 'link' + i)
          .attr('marker-end', 'url(#arrowhead)')
          .style('stroke', '#ccc')
          .style('pointer-events', 'none');

  var node = svg.selectAll('ellipse')
        .data(force.nodes())
        .enter()
        .append('ellipse')
          .attr('rx', 20)
          .attr('ry', 10)
          .style('fill', '#fff')
          .style('stroke', '#000')
          .call(force.drag);

  var nodelabels = svg.selectAll('.nodelabel')
        .data(force.nodes())
        .enter()
        .append('text')
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          .attr('class', 'nodelabel')
          .attr('stroke', 'black')
          .attr('id', (d, i) => 'nodelabel' + i)
          .text((d) => d.name)
          .attr('dx', function (d) { return -this.getComputedTextLength() / 2;})
          .attr('dy', function (d) { return this.getBBox().height / 2 - 5;});

  var linklabels = svg.selectAll('.linklabel')
        .data(force.links())
        .enter()
        .append('text')
          .style('pointer-events', 'none')
          .attr('class', 'linklabel')
          .attr('id', (d, i) => 'linklabel' + i)
          .attr('x', (d) => d.source.x)
          .attr('y', (d) => d.source.y)
          .attr('font-size', 12)
          .attr('fill', '#000')
          .text((d) => d.type);

  svg.append('defs')
    .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('svg:path')
        .attr('d', 'M0,-5 L10,0 L0,5')
        .attr('fill', '#000')
        .attr('stroke', '#000');

  function tick() {
    link.attr('x1', (d) => {
      return d.source.x;
      var label = svg.select('#nodelabel' + d.source.index)[0][0];
      var rx = label.getComputedTextLength() / 2 + 20;
      var ry = label.getBBox().height;
      var dx = d.target.x - d.source.x;
      var dy = d.target.y - d.source.y;
      var theta = Math.atan(dy / (dx || 0.0001));
      var sign = (dx > 0) ? 1 : -1;
      return d.source.x + Math.cos(theta)*rx;
    });
    link.attr('y1', (d) => {
      return d.source.y;
      var label = svg.select('#nodelabel' + d.source.index)[0][0];
      var rx = label.getComputedTextLength() / 2 + 20;
      var ry = label.getBBox().height;
      var dx = d.target.x - d.source.x;
      var dy = d.target.y - d.source.y;
      var theta = Math.atan(dy / (dx || 0.0001));
      var sign = (dy > 0) ? 1 : -1;
      return d.source.y + Math.sin(theta)*ry;
    });
    link.attr('x2', (d) => {
      return d.target.x;
      var label = svg.select('#nodelabel' + d.target.index)[0][0];
      var rx = label.getComputedTextLength() / 2 + 20;
      var ry = label.getBBox().height;
      var dx = d.source.x - d.target.x;
      var dy = d.source.y - d.target.y;
      var theta = Math.atan(dy / (dx || 0.0001));
      var sign = (dx > 0) ? 1 : -1;
      return d.target.x + Math.cos(theta)*rx;
    });
    link.attr('y2', (d, i) => {
      return d.target.y;
      var label = svg.select('#nodelabel' + d.target.index)[0][0];
      var rx = label.getComputedTextLength() / 2 + 20;
      var ry = label.getBBox().height;
      var dx = d.source.x - d.target.x;
      var dy = d.source.y - d.target.y;
      var theta = Math.atan(dy / (dx || 0.0001));
      var sign = (dy > 0) ? 1 : -1;
      return d.target.y + Math.sin(theta)*ry;
    });
    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
    nodelabels
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y);
    linklabels
      .attr('x', (d) => (d.source.x + d.target.x) / 2)
      .attr('y', (d) => (d.source.y + d.target.y) / 2);
    node.attr('rx', (d, i) => {
      var label = svg.select('#nodelabel' + i)[0][0];
      return label.getComputedTextLength() / 2 + 20;
    });
    node.attr('ry', (d, i) => {
      var label = svg.select('#nodelabel' + i)[0][0];
      return label.getBBox().height;
    });
  }
}


function drawSemNetGraphDracula(semnet) {
  var g = new Dracula.Graph();

  semnet.forEach((link) => {
    g.addEdge(link.source, link.target, { label: link.type });
  });
}


function drawSemNetGraphSigma() {
  sigma.parsers.json('/get_graph_sigma', {
    container: 'semnet-graph-canvas'
  });
}


var previousSemnetDot = '';

function drawSemNetGraphVis(semnetDot) {

  if (semnetDot === previousSemnetDot) {
    console.log(new Date().toISOString(), 'No update');
    return;
  }

  var container = document.getElementById('semnet-graph-canvas');
  var parsedData = vis.network.convertDot(semnetDot);
  var progressBar = document.getElementById('progress-drawing');
  var topicHeader = document.getElementById('topics');

  previousSemnetDot = semnetDot;

  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges
  };

  var options = parsedData.options;
  options.layout = {
    improvedLayout: false
  };
  options.physics = {
    stabilization: {
      updateInterval: 10
    }
  };

  var network = new vis.Network(container, data, options);

  document.getElementById('status-drawing').hidden = false;
  progressBar.value = 0;
  progressBar.hidden = false;

  network.on('afterDrawing', () => {
    document.getElementById('status-drawing').hidden = true;
    progressBar.hidden = true;
  });

  network.on('stabilizationProgress', (progress) => {
    progressBar.value = progress.iterations;
    progressBar.max = progress.total;
  });

  network.on('doubleClick', (e) => {
    var newTopic = e.nodes[0].split('(')[0];

    topics.push(newTopic);
    updateTopicList(topics);

    var form = new FormData();
    form.append('sentence', newTopic);

    postRequest('/wiki_page', form, null, true);
  });


  /*
  var nodes = new vis.DataSet(semnet.nodes)
    , edges = new vis.DataSet(semnet.edges);
  var data = {
    nodes: nodes,
    edges: edges
  };

  var network = new vis.Network()
   */

}


function updateTopicList(topics) {
  var topicul = document.getElementById('topics');

  topicul.innerHTML = '';

  topics.forEach((t) => {
    var li = document.createElement('li');
    li.innerText = t;
    topicul.appendChild(li);
  });
}


function getRequest(url, params, callback, nonJSON) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (nonJSON) {
        callback && callback(xhr.responseText, xhr.status);
      } else {
        callback && callback(JSON.parse(xhr.responseText), xhr.status);
      }
    }
  };
  xhr.open('GET', url + '?' + params, true);
  xhr.send();
}

function postRequest(url, formdata, callback, nonJSON) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (nonJSON) {
        callback && callback(xhr.responseText, xhr.status);
      } else {
        callback && callback(JSON.parse(xhr.responseText), xhr.status);
      }
    }
  };
  xhr.open('POST', url, true);
  xhr.send(formdata);
}


var topics = [];


function onSentenceFormSubmit(e) {
  var formdata = new FormData(e.target)
    , statusText = document.getElementById('status')
    , topicHeader = document.getElementById('topics');

  e.preventDefault();
  topics = e.target.children.sentence.value.split(',').map((t) => t.trim());
  updateTopicList(topics);
  e.target.children.sentence.value = '';
  e.target.children.sentence.disabled = true;
  e.target.children.submit.disabled = true;
  statusText.hidden = false;

  postRequest(e.target.action, formdata, (semnet) => {
    getRequest('/to_dot', 'topics='+topics, (dotString) => {
      //drawSemNetGraphVis(dotString);
      e.target.children.sentence.disabled = false;
      e.target.children.submit.disabled = false;
      statusText.hidden = true;
    }, true);
  });
}

document
  .getElementById('sentence_form')
  .addEventListener('submit', onSentenceFormSubmit);

var updateDot = () => {
  getRequest('/to_dot', 'topics='+topics, (semnetDot) => {
    drawSemNetGraphVis(semnetDot);
    setTimeout(updateDot, 5000);
  }, true);
};

updateDot();

