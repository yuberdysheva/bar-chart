/**
 * Created by yuberdysheva on 15/06/2017.
 */

import * as d3 from "d3";
import "./styles.sass"

var fullHeight = 3000;
var beginBackground = [65, 244, 34, 0.5];
var finalBackground = [249, 22, 64, 0.5];

var margin = {top: 20, right: 50, bottom: 50, left: 40};
var width = innerWidth - margin.left - margin.right;
var height = fullHeight - margin.top - margin.bottom;
var svg = d3.select("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);


var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);


var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


d3.tsv("data.tsv", function (d) {
    d.frequency = parseFloat(d.frequency);
    return d;
}, function (error, data) {
    if(error) throw error;

    x.domain([0, d3.max(data, function(d){ return d.frequency; })]);
    y.domain(data.map(function (d) { return d.letter; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x).ticks(10, "%"));
      g.append("text")
        .text("Frequency")
        .attr("x", width - 70)
        .attr("y", height)
        .attr("dy", "-0.2em")
        .attr("fill", "#999999");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", rgbaToString(beginBackground))
        .attr("x", 0)
        .attr("y", function(d){ return y(d.letter); })
        .attr("width", function(d){ return x(d.frequency);})
        .attr("height", y.bandwidth());

    d3.select("input").on("change", change);
    
    function change() {
        var y0 = y.domain(data.sort(this.checked
            ? function(a, b){ return b.frequency - a.frequency; }
            : function(a, b){ return d3.ascending(a.letter, b.letter); })
            .map(function(d){ return d.letter; }))
            .copy();

        svg.selectAll(".bar")
            .sort(function(a, b){ return y0(a.letter) - y0(b.letter); });

        var transition = svg.transition().duration(750);
        var delay = function(d, i){ return i * 50; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("y", function(d){return y0(d.letter); });

        transition.select(".axis.axis--y").call(d3.axisLeft(y));
    }

    window.onscroll = function() {
        changeBackground();
    };
    function changeBackground() {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        var percent = scrolled / (fullHeight - window.innerHeight);
        var red = beginBackground[0] + percent * (finalBackground[0] - beginBackground[0]);
        var green = beginBackground[1] + percent * (finalBackground[1] - beginBackground[1]);
        var blue = beginBackground[2] + percent * (finalBackground [2]- beginBackground[2]);
        d3.selectAll(".bar").attr("fill", rgbaToString([red, green, blue, 0.5]));
    }

    changeBackground();

});


function rgbaToString(arr) {
    return "rgba(" + Math.floor(arr[0])+ ", " + Math.floor(arr[1]) + ", " + Math.floor(arr[2]) + ", " + arr[3] + ")";
}
