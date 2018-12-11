/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.should();
chai.use(chaiHttp);

describe('/GET me', () => {
  it('it should get return 401 because no bearer are set', done => {
    chai
      .request(server)
      .get('/api/users/me')
      .set('Authorization', 'Bearer ')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
