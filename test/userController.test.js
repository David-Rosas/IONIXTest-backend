const request = require('supertest');
const app = require('../server'); 

describe('POST /api/user/register', function() {
  it('should create a new user', function(done) {
    request(app)
      .post('/api/user/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        rol_id: 1,
        password: '123456'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
