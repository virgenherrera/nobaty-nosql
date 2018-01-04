const { trace } = console;

export function dump(...args) {
	console.log(`\n//*------- start Data dumping...`);
	for ( const arg in args ) {
		if ( args.hasOwnProperty(arg) ) {
			// Notify about which arg are dumping
			console.log(`\n\t...for argument:{${arg}}\n`);
			// print type
			console.log(`Type: ${typeof args[arg]}`);
			// print length if exists
			if ( args[arg] && Array.isArray(args[arg]) ) {
				console.log(`Length: ${args[arg].length}`);
			}

			if ( args[arg] && typeof args[arg] === 'object' && !Array.isArray(args[arg]) ) {
				const keys = Object.keys( args[arg] ).join(`','`);
				if ( keys ) {
					console.log(`Keys: '${keys}'`);
				}
			}
			// print Value
			if (typeof args[arg] === 'string' || typeof args[arg] === 'number' ) {
				console.log( 'Value: ', args[ arg ] );
			} else {
				console.log( 'Value: ');
				console.dir( args[ arg ] );
			}
		}
	}
	console.log('\n\t\tData dump done! -------*//\n');
}

export function die() {
	console.log('\n\n\nnow Process will die\n\n');
	trace();
	process.exit();
}

export function dd(...args) {
	dump.apply( this, args );
	die();
}
