import * as chai from 'chai';
import * as request from 'supertest';
import { RoutePath } from '../../src/config/routePath';
import { UserModel as Model } from '../../src/Model/User';
import { User } from '../../src/Poco/User';
const { expect } = chai;

chai.should();

describe('User endpoints:', () => {
	const payload = {
		name: 'name',
		lastName: 'lastName',
		email: 'username@domain.com',
		password: 'º123456789',
		role: 'user',
	};
	let app = null;

	beforeEach(async () => {
		const widget = await import('../../src/app');

		app = widget.app;
	});

	afterEach((done) => {
		app = null;

		done();
	});

	after(async () => {
		await Model.remove({}).exec();
	});

	it('POST users/ should return 201', (done) => {
		const url = RoutePath.User;

		request(app)
			.post(url)
			.expect(201)
			.send(payload)
			.end((err, { body }) => {
				if (err) {
					return done(err);
				}

				expect(body).to.be.an('object');
				expect(body).to.have.all.keys('message', 'data');

				expect(body.message).to.be.equal('Resource created');

				expect(body.data).to.be.an('object');
				expect(body.data).to.have.all.keys(Object.keys(new User));

				expect(body.data.id).to.be.a('string');
				expect(body.data.name).to.be.a('string');
				expect(body.data.lastName).to.be.a('string');
				expect(body.data.email).to.be.a('string');
				expect(body.data.password).to.be.a('string');
				expect(body.data.role).to.be.a('string');
				expect(body.data.createdAt).to.be.a('string');
				expect(body.data.updatedAt).to.be.a('string');

				expect(body.data.name).to.be.equals(payload.name);
				expect(body.data.lastName).to.be.equals(payload.lastName);
				expect(body.data.email).to.be.equals(payload.email);
				expect(body.data.password).to.be.equals('private');
				expect(body.data.role).to.be.equals(payload.role);

				done();
			});
	});

	it('POST users/ should return 400 when trying to register same email twice', (done) => {
		const url = RoutePath.User;

		request(app)
			.post(url)
			.expect(400)
			.send(payload)
			.end((err, { body }) => {
				if (err) {
					return done(err);
				}

				expect(body).to.be.an('object');
				expect(body).to.have.all.keys('message', 'errors');

				done();
			});
	});
});
