/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

const data = {
  url: 'localhost:4000',
  admin: {
    email: 'admin@test.org',
    password: 'qwerty1234',
    bearer: ''
  },
  user: {
    email: 'user@test.org',
    password: 'qwerty1234',
    bearer: ''
  },
  notFound: {
    email: 'not_exist@test.org',
    password: 'qwerty1234'
  },
  lambda: {
    user: {
      email: 'lambda@test.org',
      password: 'qwerty1234'
    }
  }
};

before((done) => {
  chai
    .request(data.url)
    .post('/api/auth/login')
    .send({
      email: data.user.email,
      password: data.user.password
    })
    .end((err, res) => {
      data.user.bearer = JSON.parse(res.text).bearer;
      chai
        .request(data.url)
        .post('/api/auth/login')
        .send({
          email: data.admin.email,
          password: data.admin.password
        })
        // eslint-disable-next-line no-shadow
        .end((err, res) => {
          data.admin.bearer = JSON.parse(res.text).bearer;
          done();
        });
    });
});

describe('GET /api/user', () => {
  it('Should return 403: forbidden because using a bearer from a classic user', done => {
    chai
      .request(data.url)
      .get('/api/user?email=user_doesnt_exist@existing_is_nothing.org')
      .set('Authorization', `Bearer ${data.user.bearer}`)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
  it(`Should return 404: user '${data.notFound.email}' doesn't exist`, done => {
    chai
      .request(data.url)
      .get(`/api/user?email=${data.notFound.email}`)
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it(`Should return 200: user '${data.admin.email}' should exist`, done => {
    chai
      .request(data.url)
      .get('/api/user?email=admin@test.org')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('POST /api/user', () => {
  it(`Should return 403: forbidden because using a bearer from user : ${data.user.email}`, done => {
    chai
      .request(data.url)
      .post('/api/user')
      .set('Authorization', `Bearer ${data.user.bearer}`)
      .send({
        email: data.user.email,
        password: data.user.password,
        role: 'admin',
        username: 'whatever'
      })
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
  it('Should return 409: user already exist', done => {
    chai
      .request(data.url)
      .post('/api/user')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .send({
        email: data.admin.email,
        password: data.admin.password,
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
      .request(data.url)
      .post('/api/user')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .send({
        email: data.lambda.user.email,
        password: data.lambda.user.password,
        role: 'user',
        username: 'whatever'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});

describe('PUT /api/user', () => {
  it(`Should return 404: user '${data.notFound.email}' doesn't exist`, done => {
    chai
      .request(data.url)
      .put('/api/user')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .send({
        email: data.notFound.email,
        password: data.notFound.password,
        role: 'user',
        username: 'titi'
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it(`Should return 204: user '${data.lambda.user.email}' has been modified`, done => {
    chai
      .request(data.url)
      .put('/api/user')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .send({
        email: data.lambda.user.email,
        password: data.lambda.user.password,
        role: 'user',
        username: 'titi'
      })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });
});

describe('PATCH /api/user', () => {
  it(`Should return 404: user '${data.notFound.email}' doesn't exist`, done => {
    chai
      .request(data.url)
      .patch('/api/user')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .send({
        email: data.notFound.email,
        username: 'tutu'
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it(`Should return 204: user '${data.lambda.user.email}' has been modified`, done => {
    chai
      .request(data.url)
      .patch('/api/user')
      .set('Authorization', `Bearer ${data.admin.bearer}`)
      .send({
        email: data.lambda.user.email,
        username: 'tutu'
      })
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });
});
