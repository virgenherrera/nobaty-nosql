#!/usr/bin/env node

"use strict";
const parseCliArgs = require("./lib/parseCliArgs");
const { mod = [] } = parseCliArgs();

mod.forEach(m => {

    if (m === 'rest-handler') {
        return require("./createRestHandler");
    }
    if (m === 'controller') {
        return require("./createController");
    }
    if (m === 'poco') {
        return require("./createPoco");
    }
    if (m === 'repository') {
        return require("./createMongooseRepository");
    }
    if (m === 'model') {
        return require('./createMongooseModel');
    }
    if (m === 'dto') {
        return require('./createDtoSchema');
    }
    if (m === 'rest-test') {
        return require('./createRestTest');
    }
});