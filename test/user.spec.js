/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';

const backendUrl = 'localhost:4000';

chai.should();
chai.use(chaiHttp);

describe('POST /api/user', () => {
  it('Should return 201: user has been created', done => {
    chai
      .request(backendUrl)
      .post('/api/user')
      .send({
        email: 'unit_test@unit_test.org',
        password: 'qwerty1234',
        role: 'admin',
        username: 'unit_test'
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it('Should return 409: user already exist', done => {
    chai
      .request(backendUrl)
      .post('/api/user')
      .send({
        email: 'unit_test@unit_test.org',
        password: 'qwerty1234',
        role: 'admin',
        username: 'unit_test'
      })
      .end((err, res) => {
        res.should.have.status(409);
        done();
      });
  });
});
