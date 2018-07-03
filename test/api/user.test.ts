import * as chai from 'chai';
import * as request from 'supertest';
import { RoutePath } from '../../src/config/routePath';
import { UserModel as Model } from '../../src/Model/User';
import { User } from '../../src/Poco/User';
import { preloadedFixtures, stagedFixtures } from '../fixtures/userFixtures';
import { generateUserToken } from '../helpers';
const { expect } = chai;

chai.should();

describe('User endpoints:', () => {
	let app = null;

	before(async () => {
		// ensure Collection is empty
		await Model.remove({}).exec();

		// fill initial fixtures
		await Model.insertMany(preloadedFixtures);
	});

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
		const payload = stagedFixtures.user1;

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
		const payload = stagedFixtures.user1;

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

	it('GET users/:id should return 200 for a registered user', (done) => {
		const [selUser] = preloadedFixtures;
		const url = RoutePath.User_Id.replace(':id', selUser._id);
		const token = generateUserToken(selUser._id, selUser.role);
		const dummyPoco = new User;
		delete dummyPoco.password;

		request(app)
			.get(url)
			.set('Authorization', token)
			.expect(200)
			.end((err, { body }) => {
				if (err) {
					return done(err);
				}

				expect(body).to.be.an('object');
				expect(body).to.have.all.keys('message', 'data');

				expect(body.message).to.be.equal('Resource found');

				expect(body.data).to.be.an('object');
				expect(body.data).to.have.all.keys(Object.keys(dummyPoco));

				expect(body.data.id).to.be.a('string');
				expect(body.data.name).to.be.a('string');
				expect(body.data.lastName).to.be.a('string');
				expect(body.data.email).to.be.a('string');
				expect(body.data.role).to.be.a('string');
				expect(body.data.createdAt).to.be.a('string');
				expect(body.data.updatedAt).to.be.a('string');

				expect(body.data.name).to.be.equals(selUser.name);
				expect(body.data.lastName).to.be.equals(selUser.lastName);
				expect(body.data.email).to.be.equals(selUser.email);
				expect(body.data.role).to.be.equals(selUser.role);

				done();
			});
	});

	it('GET users/:id should return 200 for List users', (done) => {
		const [selUser] = preloadedFixtures;
		const url = RoutePath.User;
		const token = generateUserToken(selUser._id, selUser.role);
		const dummyPoco = new User;
		delete dummyPoco.password;

		request(app)
			.get(url)
			.set('Authorization', token)
			.expect(200)
			.end((err, { body }) => {
				if (err) {
					return done(err);
				}

				expect(body).to.be.an('object');
				expect(body).to.have.all.keys('message', 'data', 'paging');

				expect(body.message).to.be.equal('Resource found');
				expect(body.data).to.be.an('array');
				expect(body.paging).to.be.an('object');

				body.data.forEach(row => {
					expect(row).to.have.all.keys(Object.keys(dummyPoco));
					expect(row.id).to.be.a('string');
					expect(row.name).to.be.a('string');
					expect(row.lastName).to.be.a('string');
					expect(row.email).to.be.a('string');
					expect(row.role).to.be.a('string');
					expect(row.createdAt).to.be.a('string');
					expect(row.updatedAt).to.be.a('string');
				});

				expect(body.paging).to.have.all.keys('count', 'prev', 'next');
				expect(body.paging.count).to.be.a('number');
				expect(body.paging.prev).to.be.oneOf(['string', null]);
				expect(body.paging.next).to.be.oneOf(['string', null]);

				done();
			});
	});

	it('PUT users/ should return 200', (done) => {
		const [storedUser] = preloadedFixtures;
		const url = RoutePath.User_Id.replace(':id', storedUser._id);
		const token = generateUserToken(storedUser._id, storedUser.role);
		const payload = stagedFixtures.user2;

		request(app)
			.put(url)
			.expect(200)
			.set('Authorization', token)
			.send(payload)
			.end((err, { body }) => {
				if (err) {
					return done(err);
				}

				expect(body).to.be.an('object');
				expect(body).to.have.all.keys('message', 'data');

				expect(body.message).to.be.equal('Resource updated');

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

	it('DELETE users/:id should return 200', (done) => {
		const [, , selUser] = preloadedFixtures;
		const url = RoutePath.User_Id.replace(':id', selUser._id);
		const token = generateUserToken(selUser._id, selUser.role);
		const dummyPoco = new User;
		delete dummyPoco.password;

		request(app)
			.delete(url)
			.set('Authorization', token)
			.expect(200)
			.end((err, { body }) => {
				if (err) {
					return done(err);
				}

				expect(body).to.be.an('object');
				expect(body).to.have.all.keys('message', 'data');

				expect(body.message).to.be.equal('Resource deleted');

				expect(body.data).to.be.an('object');
				expect(body.data).to.have.all.keys(Object.keys(dummyPoco));

				expect(body.data.id).to.be.a('string');
				expect(body.data.name).to.be.a('string');
				expect(body.data.lastName).to.be.a('string');
				expect(body.data.email).to.be.a('string');
				expect(body.data.role).to.be.a('string');
				expect(body.data.createdAt).to.be.a('string');
				expect(body.data.updatedAt).to.be.a('string');

				expect(body.data.name).to.be.equals(selUser.name);
				expect(body.data.lastName).to.be.equals(selUser.lastName);
				expect(body.data.email).to.be.equals(selUser.email);
				expect(body.data.role).to.be.equals(selUser.role);

				done();
			});
	});
});
