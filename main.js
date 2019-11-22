const {connect_start} = require('./utilities/connect.js')

const { Scanner, Utils, R2D2 } = require('spherov2.js');

const r2d2 = connect_start(Scanner, R2D2, "D2-609B", 10000);
