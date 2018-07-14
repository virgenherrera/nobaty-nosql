"use strict";

const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const parseCliArgs = require("./lib/parseCliArgs");
const stringTransformation = require('./lib/stringTransformation');
const pluralize = require('pluralize');
let { name = null, attributes = null } = parseCliArgs();

if (!name) {
    console.error(`Cannot create tests for no name module`);
    process.exit(1);
}

if (!attributes) {
    attributes = [
        ['demoAttr1', "string"],
        ['demoAttr2', "string"],
        ['demoAttr3', "string"],
    ];
}

function contentFixture(key, type = 'string') {
    let val;

    switch (type.toLowerCase()) {
        case 'number':
            val = parseInt(Math.random() * 1000, 10);
            break;
        case 'date':
            const start = new Date(2000, 1, 1);
            const end = new Date(2040, 12, 31);
            val = `'${new Date(+start + Math.random() * (end - start))}'`;
            break;
        case 'boolean':
            val = (Math.random() >= 0.5);
            break;

        default:
            val = `'${key} Value'`;
            break;
    }
    return val;
}

function preloadedFixtures(attr = [], loops = 1) {
    let res = '';

    for (let i = 0; i < loops; i++) {
        const content = attr.reduce((acc, curr) => {
            const [key, type] = curr;
            const val = contentFixture(key, type);

            acc += `		${key}: ${val},${'\n'}`;

            return acc;
        }, `		_id: '${stringTransformation.ObjectId()}',${'\n'}`);
        res += `	{${'\n'}${content}	},${'\n'}`;
    }

    return res;
}

function stagedFixtures(attr = [], loops = 1) {
    let res = '';

    for (let i = 0; i < loops; i++) {
        const content = attr.reduce((acc, curr) => {
            const [key, type] = curr;
            const val = contentFixture(key, type);

            acc += `		${key}: ${val},${'\n'}`;

            return acc;
        }, `		_id: '${stringTransformation.ObjectId()}',${'\n'}`);
        res += `	${name}${i+1}:	{${'\n'}${content}	},${'\n'}`;
    }

    return res;
}

const testOrigin = join(__dirname, './lib/templates/restTest.example');
const testDestiny = join(__dirname, `../test/api/${name}.test.ts`);
const fixtureOrigin = join(__dirname, './lib/templates/restFixture.example');
const fixtureDestiny = join(__dirname, `../test/fixtures/${name}.ts`);
let fileContent = readFileSync(testOrigin, 'utf-8').toString();
let fixtureContent = readFileSync(fixtureOrigin, 'utf-8').toString();
const replacers = {
    module: name,
    Module: stringTransformation.toCamelCase(name),
    pluralModule: pluralize(name),
};
const fixtureReplacers = {
    preloadedFixtures: preloadedFixtures(attributes, 7),
    stagedFixtures: stagedFixtures(attributes, 3),
};


for (const k in replacers) {
    if (replacers.hasOwnProperty(k)) {
        const regEx = new RegExp(`{{${k}}}`, 'g');
        fileContent = fileContent.replace(regEx, replacers[k])
    }
}

for (const k in fixtureReplacers) {
    if (fixtureReplacers.hasOwnProperty(k)) {
        const regEx = new RegExp(`{{${k}}}`, 'g');
        fixtureContent = fixtureContent.replace(regEx, fixtureReplacers[k])
    }
}

if (existsSync(testDestiny)) {
    console.error(`Cannot Overwrite!${"\n"}Test:	${testDestiny}${"\n"}Already Exists`);
    process.exit(1);
} else if (existsSync(fixtureDestiny)) {
    console.error(`Cannot Overwrite!${"\n"}Fixture:	${fixtureDestiny}${"\n"}Already Exists`);
    process.exit(1);
} else {
    writeFileSync(testDestiny, fileContent, {
        encoding: 'utf-8'
    });

    writeFileSync(fixtureDestiny, fixtureContent, {
        encoding: 'utf-8'
    });
}