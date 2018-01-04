import { IO } from '../../Service/RealTimeService';


export function onHi(name: string): any {
	if ( !IO ) {
		return;
	}

	// Emit hi to all clients on default namespace
	return IO.of('/').emit('hi', `Hi there ${name}!`);
}
