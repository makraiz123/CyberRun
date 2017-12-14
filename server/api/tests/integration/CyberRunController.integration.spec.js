const Sails = require('sails');
const request = require('supertest');
const app = 'http://localhost:1337/1.0';
const testRequest = 'http://localhost:1337/_test'

describe('CyberRun Controller Integration Tests', () => {
  beforeEach((done) => {
    request(testRequest)
      .post('/execute')
      .send({
        sql: 'DELETE FROM cyberrun WHERE title LIKE "%crph"'
      })
      .end((err, res) => {
        done();
      });
  });

  afterAll((done) => {
    request(testRequest)
      .post('/execute')
      .send({
        sql: 'DELETE FROM cyberrun WHERE title LIKE "%crph"'
      })
      .end((err, res) => {
        done();
      });
  });

  it('CyberRun Post /Run, GET /Run, GET /Run/:cyberRunId, PUT /Run/:cyberRunId, DEL /Run/:cyberRunId', (done) => {
    let mockRun = {
      title: 'Cyber Run 1 crph',
      startDate: '2017-01-01',
      endDate: '2017-01-31',
      fee: 900
    };

    request(app)
      .post('/Run')
      .send({
        data: mockRun
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.title).toEqual(mockRun.title);
        mockRun.cyberRunId = res.body.data.cyberRunId;

        request(app)
          .get('/Run')
          .expect(200)
          .end((err, res) => {
            expect(res.body.data.length).toBeGreaterThan(0);

            request(app)
              .get('/Run/' + mockRun.cyberRunId)
              .expect(200)
              .end((err, res) => {
                expect(res.body.data.title).toEqual(mockRun.title);
                mockRun.fee = 1000;

                request(app)
                  .put('/Run/' + mockRun.cyberRunId)
                  .send({
                    data: mockRun
                  })
                  .expect(200)
                  .end((err, res) => {
                    expect(res.body.data.fee).toEqual(mockRun.fee);

                    request(app)
                      .del('/Run/' + mockRun.cyberRunId)
                      .expect(200)
                      .end((err, res) => {
                        expect(res.body.data.title).toEqual(mockRun.title);
                        done();
                      });
                  });
              });
          });
      });
  });

});