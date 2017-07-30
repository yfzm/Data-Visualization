/**
 * Created by Li Hao on 2017/7/16.
 */

var WID = 600, HEI = 500;

var margin = { top: 50, bottom: 0, left: 120, right: 0 };
var width = WID - margin.left - margin.right,
    height = HEI - margin.top - margin.bottom;

var years = [2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
var months = [1,2,3,4,5,6,7,8,9,10,11,12];

var colors = {
    "中国": "#FF0000",
    "中国台北": "#FF66FF",
    "中华台北": "#FF66FF",
    "中国香港": "#FF66FF",
    "新加坡": "#003300",
    "日本": "#003300",
    "韩国": "#003300",
    "希腊": "#0000FF",
    "瑞典": "#0000FF",
    "葡萄牙": "#0000FF",
    "德国": "#0000FF"

};

var year = 2017, month = 7;

// ----------------------------------------------------------------

var body = d3.select("body");

body.append("h2").text("乒乓球员世界排名");

var buttonPlayAll = body.append("input")
    .attr("type", "button").attr("value", "播放全部")
    .attr("id", "button-playAll");

var buttonStop = body.append("input")
    .attr("type", "button").attr("value", "停止")
    .attr("id", "button-pause");

body.append("div")
    .attr("class", "clearFix");

var selectBoxYear = body.append("select");
var selectBoxMonth = body.append("select").attr("id", "select-month");

var optionsYear = selectBoxYear.selectAll("option")
    .data(years);

optionsYear.enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });

optionsYear[0][year - years[0]]["selected"] = "selected";

var optionsMonth = selectBoxMonth.selectAll("option")
    .data(months);

optionsMonth.enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });

optionsMonth[0][month - months[0]]["selected"] = "selected";

var buttonOK = body.append("input")
    .attr("type", "button").attr("value", "确定")
    .attr("id", "button-OK");

body.append("div")
    .attr("class", "clearFix");

var svg = body.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeBands([0, height], 0.2, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

function keys(d) {
    return d.name;
}

// ----------------------------------------------------------------

d3.csv("data.csv", function (error, data) {

    var duration = 500;
    var playInterval;
    var play_year;
    var play_month;

    var rankDataYear = data.filter(function(element) { return Number(element.year) === year; });
    var rankDataMonth = rankDataYear.filter(function(element) { return Number(element.month) === month; });

    x.domain([d3.min(rankDataYear, function(element) { return element.score * 0.75; }),
        d3.max(rankDataYear, function(element) { return element.score; })]);

    y.domain(rankDataMonth.map(function (element) { return "第" + element.rank + "名"; }));

    var barGroup = svg.append("g")
        .attr("class", "bar");

    var tagGroup = svg.append("g")
        .attr("class", "tag");

    var bars = barGroup.selectAll("rect")
        .data(rankDataMonth, keys)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", function (d) { return y("第" + d.rank + "名"); })
        .attr("width", function(d) { return x(d.score); })
        .attr("height", y.rangeBand())
        .attr("fill", function(d) { return colors[d.country]; });

    var tags = tagGroup.selectAll(".tag_text")
        .data(rankDataMonth, keys)
        .enter().append("text")
        .attr("class", "tag_text")
        .attr("x", function(d) { return x(d.score) - 10; })
        .attr("y", function(d) { return y("第" + d.rank + "名") + 25; })
        .text(function(d) { return d.country + " " + d.name; });

    var tooltip = body.append("div")
        .attr("class","tooltip")
        .style("opacity",0.0);

    function addActivity(ele) {
        ele.on("mouseover", function (d) {
            tooltip.html(d.name + " " + d.score)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity",1.0);
        })
            .on("mousemove", function (d) {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.style("opacity", 0.0)
            });
    }

    addActivity(bars);
    addActivity(tags);
    
    var xTag = svg.append("g")
        .call(xAxis)
        .attr("class", "x axis");

    svg.append("g")
        .call(yAxis)
        .attr("class", "y axis");


    buttonOK.on("click", function () {
        var sYear = selectBoxYear.property("selectedIndex") + years[0];
        var sMonth = selectBoxMonth.property("selectedIndex") + months[0];

        if (sYear === 2017 && sMonth > 7)
            return;

        update(sYear, sMonth);
    });

    buttonPlayAll.on("click", function () {
        play_year = 2001;
        play_month = 1;

        clearInterval(playInterval);

        playInterval = setInterval(function () {
            update(play_year, play_month);

            if (play_month !== 12)
                play_month++;
            else {
                play_month = 1;
                play_year++;
            }

            if (play_year >= 2017 && play_month >= 8) {
                clearInterval(playInterval);
            }
        }, 1000);
    });

    buttonStop.on("click", function () {
       clearInterval(playInterval);
    });

    function update(ny, nm) {
        if (ny === year && nm === month) return;

        optionsYear[0][ny - years[0]]["selected"] = "selected";
        optionsMonth[0][nm - months[0]]["selected"] = "selected";

        month = nm;
        if (year === ny) {
            rankDataMonth = rankDataYear.filter(function(element) { return Number(element.month) === month; });
            if (ny === 2010) {
                x.domain([d3.min(rankDataMonth, function(element) { return element.score * 0.75; }),
                    d3.max(rankDataMonth, function(element) { return element.score; }) * (1 + Math.random() * 0.05)]);
                xTag.call(xAxis);
            }

        }
        else {
            year = ny;
            rankDataYear = data.filter(function(element) { return Number(element.year) === year; });
            rankDataMonth = rankDataYear.filter(function(element) { return Number(element.month) === month; });

            if (ny === 2010){
                x.domain([d3.min(rankDataMonth, function(element) { return element.score * 0.75; }),
                    d3.max(rankDataMonth, function(element) { return element.score; }) * (1 + Math.random() * 0.05)]);
                xTag.call(xAxis);
            }
            else {
                x.domain([d3.min(rankDataYear, function(element) { return element.score * 0.75; }),
                    d3.max(rankDataYear, function(element) { return element.score; })]);
                xTag.call(xAxis);
            }

        }

        bars = barGroup.selectAll("rect").data(rankDataMonth, keys);

        bars.enter().append("rect")
            .attr("x", 0)
            .attr("y", y("第10名") + y("第2名"))
            .attr("width", function(d) { return x(d.score); })
            .attr("height", y.rangeBand())
            .attr("fill", function(d) { return colors[d.country]; })
            .transition()
            .duration(duration)
            .attr("y", function (d) { return y("第"+ d.rank + "名"); });

        bars.exit()
            .transition()
            .duration(duration)
            .attr("y", function (d) { return y("第10名") + y("第2名"); })
            .remove();

        bars.transition()
            .duration(duration)
            .attr("width", function(d) { return x(d.score); })
            .attr("y", function (d) { return y("第"+ d.rank + "名"); });


        tags = tagGroup.selectAll(".tag_text").data(rankDataMonth, keys);

        tags.enter().append("text")
            .attr("class", "tag_text")
            .attr("x", function(d) { return x(d.score) - 10; })
            .attr("y", y("第10名") + y("第2名") + 25)
            .text(function(d) { return d.country + " " + d.name; })
            .transition()
            .duration(duration)
            .attr("y", function(d) { return y("第" + d.rank + "名") + 25; });

        tags.exit()
            .transition()
            .duration(duration)
            .attr("y", y("第10名") + y("第2名") + 25)
            //.style("opacity", 0.0)
            .remove();

        tags.transition()
            .duration(duration)
            .attr("x", function(d) { return x(d.score) - 10; })
            .attr("y", function(d) { return y("第" + d.rank + "名") + 25; });

        addActivity(bars);
        addActivity(tags);

    }
});


