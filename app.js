var express = require('express');
var app = express();

const pug = require('pug');
const compiledFunction = pug.compileFile('template.pug');

