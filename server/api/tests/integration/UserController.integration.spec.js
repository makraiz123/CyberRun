const Sails = require('sails');
const request = require('supertest');
const app = 'http://localhost:1337/1.0';
const testRequest = 'http://localhost:1337/_test'

describe('UserController Integration Tests', () => {

  beforeEach((done) => {
    request(testRequest)
      .post('/execute')
      .send({
        sql: 'DELETE FROM user WHERE email LIKE "%@crph.com"'
      })
      .end((err, res) => {
        done();
      });
  });

  afterAll((done) => {
    request(testRequest)
      .post('/execute')
      .send({
        sql: 'DELETE FROM user WHERE email LIKE "%@crph.com"'
      })
      .end((err, res) => {
        done();
      });
  });

  it('User POST /User GET /User GET /User/:userId PUT /User/:userId DEL /User/:userId  ', (done) => {
    let mockUser = {
      email: 'mark@crph.com',
      password: 'threeunder',
      firstName: 'Mark',
      lastName: 'Aldecimo',
      phone: '+6391787309921',
      shippingAddress: 'Paranaque City',
    }

    request(app)
      .post('/User')
      .send({
        data: mockUser
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.email).toEqual(mockUser.email);
        mockUser.userId = res.body.data.userId;
        request(app)
          .get('/User')
          .expect(200)
          .end((err, res) => {
            expect(res.body.data.length).toBeGreaterThan(0);
            request(app)
              .get('/User/' + mockUser.userId)
              .expect(200)
              .end((err, res) => {
                expect(res.body.data.email).toEqual(mockUser.email);
                mockUser.shippingAddress = 'Taguig';
                request(app)
                  .put('/User/' + mockUser.userId)
                  .send({
                    data: mockUser
                  })
                  .expect(200)
                  .end((err, res) => {
                    expect(res.body.data.shippingAddress).toEqual(mockUser.shippingAddress);
                    request(app)
                      .del('/User/' + mockUser.userId)
                      .expect(200)
                      .end((err, res) => {
                        expect(res.body.data.email).toEqual(mockUser.email);
                        done();
                      });
                  });
              });
          });
      });
  });

});