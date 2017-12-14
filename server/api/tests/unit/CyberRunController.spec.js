const promise = require('bluebird');
const CyberRunController = require('../../controllers/CyberRunController');

describe('CyberRunController Unit Tests', () => {
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

    global.CyberRun = jasmine.createSpyObj('CyberRun', ['create', 'find', 'findOne', 'update', 'destroy']);
  });

  describe('Post CyberRun', () => {
    it('should pass params to CyberRun.create', (done) => {
      mockReq.params = {
        data: {
          title: 'markaldecimo@outlook.com',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        }
      };

      global.CyberRun.create.and.callFake((run) => {
        expect(run).toEqual(mockReq.params.data);
        done();
        return promise.resolve();
      });

      CyberRunController.postCyberRun(mockReq, mockRes);
    });

    describe('Happy Path', () => {
      it('it should call res.ok with new run data', (done) => {
        mockReq.params = {
          data: {
            title: 'markaldecimo@outlook.com',
            startDate: '2017-01-01',
            endDate: '2017-01-31',
            fee: 900
          }
        };
  
        global.CyberRun.create.and.callFake((run) => {
          return promise.resolve(run);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockReq.params.data);
          done();
        });
  
        CyberRunController.postCyberRun(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When unhandled error occurred', () => {
        it('should call response error with index 0', (done) => {
          const error = {};

          global.CyberRun.create.and.callFake((user) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          CyberRunController.postCyberRun(mockReq, mockRes);
        });
      });
    });
  });

  describe('Get CyberRuns', () => {
    it('should call CyberRun.find', () => {
      global.CyberRun.find.and.callFake((run) => {
        return promise.resolve([]);
      });

      CyberRunController.getCyberRuns(mockReq, mockRes);
    });

    describe('Happy Path', () => {
      it('should call res.ok with runs', (done) => {
        const mockRuns = [{
          cyberRunId: 1,
          title: 'Cyber Run 1',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        },
        {
          cyberRunId: 2,
          title: 'Cyber Run 2',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        }];

        global.CyberRun.find.and.callFake((run) => {
          return promise.resolve(mockRuns);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data[0]).toEqual(mockRuns[0]);
          expect(data[1]).toEqual(mockRuns[1]);
          done();
        });

        CyberRunController.getCyberRuns(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When no runs found', () => {
        it('should call response error with index 5', (done) => {
          const mockRuns = [];
  
          global.CyberRun.find.and.callFake((run) => {
            return promise.resolve(mockRuns);
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });
  
          CyberRunController.getCyberRuns(mockReq, mockRes);
        });
      });

      describe('When unhandled exception occurs', () => {
        it('should call response error with index 0', (done) => {
          const error = {};
          
          global.CyberRun.find.and.callFake((run) => {
            return promise.reject(error);
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });
  
          CyberRunController.getCyberRuns(mockReq, mockRes);
        });
      });
    });
  });

  describe('Get CyberRun', () => {
    it('should pass params to CyberRun.findOne', (done) => {
      mockReq.params = {
        cyberRunId: 1
      };

      global.CyberRun.findOne.and.callFake((data) => {
        expect(data).toEqual(mockReq.params);
        done();
        return promise.resolve({});
      });

      CyberRunController.getCyberRun(mockReq, mockRes);

    });

    describe('Happy Path', () => {
      beforeEach(() => {
        mockReq.params = {
          cyberRunId: 1
        };
      });

      it('should call res.ok with run', (done) => {
       
        const mockRun = {
          cyberRunId: 1,
          title: 'Cyber Run 1',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        };
  
        global.CyberRun.findOne.and.callFake((data) => {
          return promise.resolve(mockRun);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockRun);
          done();
        });
  
        CyberRunController.getCyberRun(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When no run found', () => {
        it('should call response error with index 5', (done) => {

          global.CyberRun.findOne.and.callFake((data) => {
            return promise.resolve(undefined);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });

          CyberRunController.getCyberRun(mockReq, mockRes);

        });
      });

      describe('When unhandled error occurred', () => {
        it('should call res.error with index 0', (done) => {

          const error = {};

          global.CyberRun.findOne.and.callFake((data) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          CyberRunController.getCyberRun(mockReq, mockRes);
          
        });
      });
    });
  });

  describe('Put CyberRun', () => {
    beforeEach(() => {
      mockReq.params = {
        cyberRunId: 1,
        data: {
          title: 'Cyber Run 1',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        }
      };
    });

    it('should pass params to CyberRun.update', (done) => {
      global.CyberRun.update.and.callFake((criteria, data) => {
        expect(criteria).toEqual({
          cyberRunId: mockReq.params.cyberRunId
        });
        expect(data).toEqual(mockReq.params.data);
        done();
        return promise.resolve([]);
      });

      CyberRunController.putCyberRun(mockReq, mockRes);
    });

    describe('Happy Path', () => {
      it('should call res.ok with data', (done) => {
        const mockRun = {
          cyberRunId: 1,
          title: 'Cyber Run 1',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        };

        global.CyberRun.update.and.callFake((criteria, data) => {
          return promise.resolve([mockRun]);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockRun);
          done();
        });

        CyberRunController.putCyberRun(mockReq, mockRes);
        
      });
    });

    describe('Non Happy Path', () => {
      describe('When no run found', () => {
        it('should call res.error with index 5', (done) => {
          global.CyberRun.update.and.callFake((criteria, data) => {
            return promise.resolve([]);
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });
  
          CyberRunController.putCyberRun(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call res.error with index 0', (done) => {
          global.CyberRun.update.and.callFake((criteria, data) => {
            return promise.reject({});
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });
  
          CyberRunController.putCyberRun(mockReq, mockRes);
        });
      });
    });
  });

  describe('Del CyberRun', () => {
    beforeEach(() => {
      mockReq.params = {
        cyberRunId: 1
      };
    });

    it('should pass params to CyberRun.destroy', (done) => {
      global.CyberRun.destroy.and.callFake((params) => {
        expect(params.cyberRunId).toEqual(mockReq.params.cyberRunId);
        done();
        return promise.resolve([]);
      });

      CyberRunController.deleteCyberRun(mockReq, mockRes);
    });

    describe('Happy Path', () => {
      it('should pass deleted run to res.ok', (done) => {
        const mockRun = {
          cyberRunId: 1,
          title: 'Cyber Run 1',
          startDate: '2017-01-01',
          endDate: '2017-01-31',
          fee: 900
        };

        global.CyberRun.destroy.and.callFake((params) => {
          return promise.resolve([mockRun]);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockRun);
          done();
        });

        CyberRunController.deleteCyberRun(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When no run found', () => {
        it('should call res.error with index 5', (done) => {
          global.CyberRun.destroy.and.callFake((params) => {
            return promise.resolve([]);
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });
  
          CyberRunController.deleteCyberRun(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call res.error with index 0', (done) => {
          global.CyberRun.destroy.and.callFake((params) => {
            return promise.reject({});
          });
  
          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });
  
          CyberRunController.deleteCyberRun(mockReq, mockRes);
        });
      });
    });
  });
});