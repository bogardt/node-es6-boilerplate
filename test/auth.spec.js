/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';

const backendUrl = 'localhost:4000';

chai.should();
chai.use(chaiHttp);
chai.request(backendUrl)
  .delete('/api/auth?email=toto@toto.fr')
  .end(() => {});

describe('POST /api/auth/register', () => {
  it('Should return 201: user created', done => {
    chai
      .request(backendUrl)
      .post('/api/auth/register')
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
      .post('/api/auth/register')
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

describe('POST /api/auth/login', () => {
  it('Should return 201: user logged', done => {
    chai
      .request(backendUrl)
      .post('/api/auth/login')
      .send({
        email: 'toto@toto.fr',
        password: 'toto1234'
      })
      .end((err, res) => {
        // eslint-disable-next-line prefer-destructuring
        bearer = JSON.parse(res.text).bearer;
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 404: wrong email/password', done => {
    chai
      .request(backendUrl)
      .post('/api/auth/login')
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

describe('GET /api/auth/me', () => {
  it('Should return 200: user infos from bearer', done => {
    chai
      .request(backendUrl)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${bearer}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 401: no bearer has been passed in headers', done => {
    chai
      .request(backendUrl)
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
      .request(backendUrl)
      .patch('/api/auth/change_password')
      .set('Authorization', `Bearer ${bearer}`)
      .send({
        password: 'toto1234'
      })
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
  it('Should return 204: change password', done => {
    chai
      .request(backendUrl)
      .patch('/api/auth/change_password')
      .set('Authorization', `Bearer ${bearer}`)
      .send({
        password: 'toto12345'
      })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });
});

describe('DELETE /api/auth?email=toto@toto.fr', () => {
  it('Should return 200: user has been deleted', done => {
    chai
      .request(backendUrl)
      .delete('/api/auth?email=toto@toto.fr')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should return 404: user doesn\'t exist', done => {
    chai
      .request(backendUrl)
      .delete('/api/auth?email=tutu@tutu.fr')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
