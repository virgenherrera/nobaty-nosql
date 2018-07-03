import * as Joi from 'joi';
import { DEFAULT_PAGINATION } from '../config/config';

export const findEntitySchema = Joi.object().keys({
	id: Joi.string().hex().length(24),
});

export const listEntitySchema = Joi.object().keys({
	sort: Joi.string(),
	filter: Joi.string(),
	page: Joi.number().default(DEFAULT_PAGINATION.page).integer().positive(),
	per_page: Joi.number().default(DEFAULT_PAGINATION.per_page).integer().positive(),
});
