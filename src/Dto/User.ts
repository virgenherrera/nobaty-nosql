import * as Joi from 'joi';

export const UserSchema = Joi.object().keys({
	id: Joi.string().regex(/^[a-f\d]{24}$/i),
	name: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string(),
	password: Joi.string(),
	role: Joi.string(),

	createdAt: Joi.date(),
	updatedAt: Joi.date(),
});
