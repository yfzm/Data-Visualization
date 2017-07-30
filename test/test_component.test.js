/**
 * Created by 42594 on 2017/7/30.
 */

var expect = require('chai').expect;
var data_month = require("./test_component.js");

describe('数据条数的测试', function() {
    it('数据一共10条', function() {
        expect(data_month.length).to.be.equal(10);
    });
});