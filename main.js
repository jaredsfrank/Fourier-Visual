
function f(x){
    var ans = Math.sin(x);
}
//Square Function
function h(x, m){
    var ans = 0;
    for (n=1; n<=m; n++){
        ans += 4/((2*n-1)*Math.PI)*Math.sin(.5*(2*n-1)*Math.PI*x);
    }
    return Math.round(ans*1000)/1000;
}
//Y=x^2
function g(x,m){
  var ans = 0;
  for (n=1; n<=m; n++){
    ans+=4*Math.pow(-1,n)/(n*n)*Math.cos(n*x)
  }
  return Math.round(ans*1000)/1000;
}

//Other
function j(x,m){
  var ans = Math.PI;
  for (n=1; n<=m; n++){
    ans+= 2/(n*n*Math.PI)*(Math.pow(-1,n)-1)*Math.cos(n*x);
    ans-= 1/n*(1+Math.pow(-1,n))*Math.sin(n*x);
  }
  return Math.round(ans*1000)/1000;
}

function calcPoints (start, end, interval, f){
    var accum = [];
    for (x = start; x <= end; x+=interval){
        accum.push({x: x, y: f(x)})
    }
    return accum;
}

function calcPointsFourrier (start, end, interval, f, m){
    var accum = [];
    for (x = start; x <= end; x+=interval){
        accum.push({x: x, y: f(x, m)})
    }
    return accum;
}

var lineData = calcPointsFourrier(-Math.PI, 5*Math.PI, .02, j, 100);


var vis = d3.select('#visualisation'),
      WIDTH = 1000,
      HEIGHT = 500,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      }

  var xRange = d3.scale.linear()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([d3.min(lineData, function(d) {
            return d.x;}), 
        d3.max(lineData, function(d) {
        return d.x;
      })]);
  var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
        return d.y;
      }), d3.max(lineData, function(d) {
        return d.y;
      })]);
  var xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(5)
        .tickSubdivide(true);
  var yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(5)
        .orient('left')
        .tickSubdivide(true);

  vis.append('svg:g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
  .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'y-axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);

  var lineFunc = d3.svg.line()
    .x(function(d) {
      return xRange(d.x);
    })
    .y(function(d) {
      return yRange(d.y);
    })
    .interpolate('linear');

    vis.append('svg:path')
    .attr('class','line')
    .attr('d', lineFunc(lineData))


var start = 100;  
d3.select('body').append('p').attr('class','label').text("m = "+start);

function draw(lineData) {
  vis.select('.line')
    .attr('d', lineFunc(lineData))
  yRange.range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
        return d.y;
      }), d3.max(lineData, function(d) {
        return d.y;
      })]);
  vis.select('.y-axis').call(yAxis.scale(yRange));
}


d3.select('body').append('input').attr('type','range').attr('min',"0").attr('max',"200").attr('value',start)
  .on("input", function(){
    var new_val = this.value;
    var new_data = calcPointsFourrier(-Math.PI, 5*Math.PI, .02, j, new_val);
    d3.select('.label').text("m = "+new_val)
    draw(new_data);})

window.onload = (draw(lineData));


