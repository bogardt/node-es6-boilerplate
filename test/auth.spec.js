/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

const data = {
  url: 'localhost:4000',
  user: {
    email: 'toto@auth.fr',
    password: 'qwerty1234',
    username: 'toto'
  },
  bearer: ''
};

describe('POST /api/auth/register', () => {
  it('Should return 201: user created', done => {
    chai
      .request(data.url)
      .post('/api/auth/register')
      .send(data.user)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it('Should return 409: user already exist', done => {
    chai
      .request(data.url)
      .post('/api/auth/register')
      .send(data.user)
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
});

describe('POST /api/auth/login', () => {
  it('Should return 201: user logged', done => {
    chai
      .request(data.url)
      .post('/api/auth/login')
      .send({
        email: data.user.email,
        password: data.user.password
      })
      .end((err, res) => {
        data.bearer = JSON.parse(res.text).bearer;
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 404: wrong email/password', done => {
    chai
      .request(data.url)
      .post('/api/auth/login')
      .send({
        email: data.user.email,
        password: 'bad_password'
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});

describe('GET /api/auth/me', () => {
  it('Should return 200: user infos from bearer', done => {
    chai
      .request(data.url)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${data.bearer}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 401: no bearer has been passed in headers', done => {
    chai
      .request(data.url)
      .get('/api/auth/me')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe('PATCH /api/auth/change_password', () => {
  it('Should return 409: you can\'t use the same password', done => {
    chai
      .request(data.url)
      .patch('/api/auth/change_password')
      .set('Authorization', `Bearer ${data.bearer}`)
      .send({
        password: data.user.password
      })
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
  it('Should return 204: change password', done => {
    chai
      .request(data.url)
      .patch('/api/auth/change_password')
      .set('Authorization', `Bearer ${data.bearer}`)
      .send({
        password: 'newpassword1234'
      })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });
});
