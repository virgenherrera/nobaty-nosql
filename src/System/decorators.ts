import { join } from 'path';
import { Router } from 'express';

// RestHandler Decorator
export function RestHandler(constructor: Function): any {
	const ignoredProperties = ['length', 'prototype', 'name'];
	const Endpoints = Object.getOwnPropertyNames(constructor).filter(v => ignoredProperties.indexOf(v) === -1);
	const name = constructor['name'];
	const router: Router = Router();

	// Assign Endpoints to router
	Endpoints.forEach(v => {
		const { methods = [], args = [] } = constructor[v] || {};

		methods.forEach(method => router[method](...args));
	});

	return { name, router };
}

// Endpoint Decorator
export function Endpoint(path: string, ...middlewareFunctions): any {
	return function (constructor: any, propertyName: string) {
		const availableMethods = ['head', 'options', 'get', 'post', 'put', 'patch', 'del', 'delete', 'all'];
		const methods = propertyName
			.split('_')
			.reduce((filtered, curr) => {
				curr = curr.toLocaleLowerCase();

				if (availableMethods.indexOf(curr) > -1) {
					filtered.push(curr);
				}

				return filtered;
			}, []);


		let value;

		if (methods.length === 0) {
			console.log(`omitting the endpoint Handler: '${propertyName}', because it does not match a valid Endpoint name.`);
		} else {
			value = {
				methods,
				args: [
					path, ...middlewareFunctions, constructor[propertyName]
				]
			};
		}

		return { value };
	};
}

// Property Decorators
export function basePath(overrideBase: string = null): any {
	return function (constructor: any, propName: string): PropertyDescriptor {
		const base = (overrideBase) ? overrideBase : constructor['BASE_PATH'];
		const value = join(base, constructor[propName]);

		return { value };
	};
}

export function apiV1Path(overrideBase: string = null) {
	return function (constructor: any, propName: string): any {
		const base = (overrideBase) ? overrideBase : constructor['API_V1_PATH'];
		const value = join(base, constructor[propName]);

		return { value };
	};
}
