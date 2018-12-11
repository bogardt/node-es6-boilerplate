/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.should();
chai.use(chaiHttp);

describe('/GET me', () => {
  it('it should get a empty list of todos', done => {
    chai
      .request(server)
      .get('/api/me')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
