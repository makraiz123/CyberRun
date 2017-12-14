const promise = require('bluebird');
const RegistrationController = require('../../controllers/RegistrationController');

describe('RegistrationController Unit Tests', () => {
  let mockReq = null;
  let mockRes = null;

  beforeEach(() => {
    mockReq = {
      params: {},
      param: (name) => {
        return mockReq.params[name];
      }
    }
    mockRes = jasmine.createSpyObj('mockRes', ['ok', 'error']);

    global.Registration = jasmine.createSpyObj('Registration', ['create', 'find', 'findOne', 'update', 'destroy']);
  });

  describe('Post Registration', () => {
    it('should pass params to Registration.create', (done) => {

      mockReq.params = {
        data: {
          shirtSize: 'M',
          user: 1,
          cyberRun: 1
        }
      };

      global.Registration.create.and.callFake((params) => {
        expect(params).toEqual(mockReq.params.data);
        done();
        return promise.resolve({});
      });

      RegistrationController.postRegistration(mockReq, mockRes);
    });

    describe('Happy Path', () => {
      it('should call res.ok with registration', (done) => {
        mockReq.params = {
          data: {
            shirtSize: 'M',
            user: 1,
            cyberRun: 1
          }
        };

        global.Registration.create.and.callFake((params) => {
          return promise.resolve(mockReq.params.data);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockReq.params.data);
          done();
        });
  
        RegistrationController.postRegistration(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When unhandled error occurred', () => {
        it('should call res.error with index 0', (done) => {
          mockReq.params = {
            data: {
              shirtSize: 'M',
              user: 1,
              cyberRun: 1
            }
          };
  
          global.Registration.create.and.callFake((params) => {
            return promise.reject({});
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });
    
          RegistrationController.postRegistration(mockReq, mockRes);
        });
      });

      describe('When serId is not valid', () => {

      });

      describe('When cyberRunId is not valid', () => {

      });
    });
  });
});