let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index'); //express server app
//call actions just like server listing to request 
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Department Resource', () => {
  describe('GET /departments', () => {
      it('it should fetch all data from neighborhood', (done) => {
        chai.request(server)
          .get('/v1/departments')
          .query({
            '_t' : 'QcG6kP3yDnUHD67hWAAQyqrDdFm4gBPW'
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.to.be.an('object');
            expect(res.body.status).to.equal('success');
            expect(res.body.content).to.be.a('array');
            done();
          });
      });
  });
});