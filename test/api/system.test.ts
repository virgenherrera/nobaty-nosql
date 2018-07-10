import * as chai from 'chai';
import * as request from 'supertest';
import { RoutePath } from '../../src/config/routePath';
const { expect } = chai;

chai.should();

describe('System endpoints:', () => {
	let app = null;

	beforeEach(async () => {
		const widget = await import('../../src/app');

		app = widget.app;
	});

	afterEach((done) => {
		app = null;
		done();
	});

	for (let index = 0; index < 7; index++) {
		it(`GET ${RoutePath.System_Health} attempt #${index + 1} should return 200`, (done) => {
			const url = RoutePath.System_Health;

			request(app)
				.get(url)
				.expect(200)
				.end((err, { body }) => {
					if (err) {
						return done(err);
					}

					expect(body).to.be.an('object');
					expect(body).to.have.all.keys('message', 'data');

					expect(body.message).to.be.equal('Resource found');

					expect(body.data).to.be.an('object');
					expect(body.data).to.have.all.keys('uptime', 'humanUptime', 'uptimeSince', 'environment');

					expect(body.data.uptime).to.be.a('number');
					expect(body.data.humanUptime).to.be.a('string');
					expect(body.data.uptimeSince).to.be.a('string');
					expect(body.data.environment).to.be.a('string');
					expect(body.data.environment).to.be.equals(process.env.NODE_ENV);

					done();
				});
		});
	}
});

