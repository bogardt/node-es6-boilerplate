/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';

const backendUrl = 'localhost:4000';
const adminEmail = 'admin@test.org';
const adminPassword = '1234';
const userEmail = 'user@test.org';
const userPassword = '1234';
const userUnitTestEmail = 'unit_test@test.org';
const userUnitTestPassword = 'qwerty1234';

chai.should();
chai.use(chaiHttp);

let userBearer = '';
let adminBearer = '';
before((done) => {
  chai
    .request(backendUrl)
    .post('/api/auth/login')
    .send({
      email: userEmail,
      password: userPassword
    })
    .end((err, res) => {
      userBearer = JSON.parse(res.text).bearer;
      chai
        .request(backendUrl)
        .post('/api/auth/login')
        .send({
          email: adminEmail,
          password: adminPassword
        })
        // eslint-disable-next-line no-shadow
        .end((err, res) => {
          adminBearer = JSON.parse(res.text).bearer;
          done();
        });
    });
});

describe('GET /api/user', () => {
  it('Should return 403: forbidden because using a bearer from a classic user', done => {
    chai
      .request(backendUrl)
      .get('/api/user?email=user_doesnt_exist@existing_is_nothing.org')
      .set('Authorization', `Bearer ${userBearer}`)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
  it('Should return 404: user "user_doesnt_exist@existing_is_nothing.org" doesn\'t exist', done => {
    chai
      .request(backendUrl)
      .get('/api/user?email=user_doesnt_exist@existing_is_nothing.org')
      .set('Authorization', `Bearer ${adminBearer}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it('Should return 200: user "admin@test.org" should exist', done => {
    chai
      .request(backendUrl)
      .get('/api/user?email=admin@test.org')
      .set('Authorization', `Bearer ${adminBearer}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('POST /api/user', () => {
  it('Should return 403: forbidden because using a bearer from a classic user', done => {
    chai
      .request(backendUrl)
      .post('/api/user')
      .set('Authorization', `Bearer ${userBearer}`)
      .send({
        email: 'unit_test@unit_test.org',
        password: 'qwerty1234',
        role: 'admin',
        username: 'unit_test'
      })
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
  it('Should return 409: user already exist', done => {
    chai
      .request(backendUrl)
      .post('/api/user')
      .set('Authorization', `Bearer ${adminBearer}`)
      .send({
        email: 'admin@test.org',
        password: 'qwerty1234',
        role: 'admin',
        username: 'whatever'
      })
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
  it('Should return 201: user has been created', done => {
    chai
      .request(backendUrl)
      .post('/api/user')
      .set('Authorization', `Bearer ${adminBearer}`)
      .send({
        email: 'unittest@test.org',
        password: 'qwerty1234',
        role: 'user',
        username: 'unittest'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});

// describe('PATCH /api/user', () => {

// });
