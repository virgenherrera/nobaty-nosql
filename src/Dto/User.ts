import * as Joi from 'joi';
import { registeredRoles } from '../config/roles';

export const newUserSchema = Joi.object().keys({
	name: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().required().email(),
	password: Joi.string().required().min(7),
	role: Joi.string().required().valid(registeredRoles),
});

export const updateUserSchema = Joi.object().keys({
	id: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
	name: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email(),
	password: Joi.string().min(7),
	role: Joi.string().valid(registeredRoles),
});
