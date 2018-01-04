import { defaultRole, registeredRoles } from '../config/roles';

export function roleValidator(val: string): string {
	return (registeredRoles.indexOf(val) === -1) ? defaultRole : val;
}
