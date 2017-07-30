/**
 * Created by 42594 on 2017/7/30.
 */

d3 = require("d3");

d3.csv("../data.csv", function (error, data) {

    var rankDataYear = data.filter(function(element) { return Number(element.year) === 2005; });
    var rankDataMonth = rankDataYear.filter(function(element) { return Number(element.month) === 7; });

    module.exports(rankDataMonth);

});