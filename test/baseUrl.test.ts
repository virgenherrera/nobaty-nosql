import * as chai from 'chai';
import * as request from 'supertest';
import { app } from '../src/app';
const { expect } = chai;

chai.should();

describe('baseRoute', () => {
	it('should return 404', (done) => {
		request(app)
			.get('/')
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				const { body } = res;
				expect(body).to.be.an('object');
				expect(body).to.have.property('message');

				done();
			});
	});
});
