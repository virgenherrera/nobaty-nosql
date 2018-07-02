import * as Joi from 'joi';
import { DEFAULT_PAGINATION } from '../config/config';

export const findEntitySchema = Joi.object().keys({
	id: Joi.string().hex().length(24),
});

export const listEntitySchema = Joi.object().keys({
	sort: Joi.string(),
	filter: Joi.string(),
	limit: Joi.number().default(DEFAULT_PAGINATION.limit).integer().positive(),
	offset: Joi.number().default(DEFAULT_PAGINATION.offset).integer().positive(),
});
