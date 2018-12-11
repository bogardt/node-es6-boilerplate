/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';

const backendUrl = 'localhost:4200';

chai.should();
chai.use(chaiHttp);
chai.request(backendUrl)
  .delete('/api/users?email=toto@toto.fr')
  .end(() => {});

describe('POST /api/users/register', () => {
  it('Should return 201: user created', done => {
    chai
      .request(backendUrl)
      .post('/api/users/register')
      .send({
        email: 'toto@toto.fr',
        password: 'toto1234',
        username: 'toto',
        role: 'user'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it('Should return 409: user already exist', done => {
    chai
      .request(backendUrl)
      .post('/api/users/register')
      .send({
        email: 'toto@toto.fr',
        password: 'toto1234',
        username: 'toto',
        role: 'user'
      })
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
});

let bearer = '';

describe('POST /api/users/login', () => {
  it('Should return 201: user logged', done => {
    chai
      .request(backendUrl)
      .post('/api/users/login')
      .send({
        email: 'toto@toto.fr',
        password: 'toto1234'
      })
      .end((err, res) => {
        bearer = JSON.parse(res.text).bearer;
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 404: wrong email/password', done => {
    chai
      .request(backendUrl)
      .post('/api/users/login')
      .send({
        email: 'toto@toto.fr',
        password: 'toto1234123'
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});

describe('GET /api/users/me', () => {
  it('Should return 200: user infos from bearer', done => {
    chai
      .request(backendUrl)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${bearer}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 401: no bearer has been passed in headers', done => {
    chai
      .request(backendUrl)
      .get('/api/users/me')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

