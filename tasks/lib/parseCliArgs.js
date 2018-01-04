#!/usr/bin/env node
const { argv } = require('yargs');

module.exports = function(){
	let {
		name=null,
		attributes=null
	} = argv;

	if( name ){
		// normalize name
		name = name
		.replace(/\W/g, '')
		.replace(/\d/g,'')
		.toLowerCase();
	}

	if(attributes){
		// normalize attributes
		attributes = attributes
		.split(',')
		.map(row=>{
			let [ attr=null,value=null ] = row.split(':');

			return ( attr && value ) ? [attr,value] : null;
		})
		.filter( v => (v) );
	}

	return {name,attributes};
}
