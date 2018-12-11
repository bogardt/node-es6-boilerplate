// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Entity user', () => {
  describe('Route /api/users/register', () => {
    it('should get all students record', async done => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
