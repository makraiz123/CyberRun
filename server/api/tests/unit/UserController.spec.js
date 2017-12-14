const promise = require('bluebird');
const UserController = require('../../controllers/UserController');

describe('UserController Unit Tests', () => {
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

    global.User = jasmine.createSpyObj('User', ['create', 'find', 'findOne', 'update', 'destroy']);
    global.EncryptionService = jasmine.createSpyObj('EncryptionService', ['encryptPassword']);
  });

  describe('Post User', () => {

    it('should pass params with encrypted Password to User.create', (done) => {
      mockReq.params = {
        data: {
          email: 'markaldecimo@outlook.com',
          password: 'threeunder',
          firstName: 'Mark',
          lastName: 'Aldecimo',
          phone: '+639178730822',
          shippingAddress: 'Paranaque City',
        }
      };

      global.User.create.and.callFake((user) => {
        expect(user).toEqual(mockReq.params.data);
        expect(mockReq.params.data.password).toEqual('passwordHash');
        done();
        return promise.resolve();
      });

      global.EncryptionService.encryptPassword.and.callFake((hash) => {
        return promise.resolve('passwordHash');
      });

      UserController.postUser(mockReq, mockRes);
    });

    describe('Happy Path', () => {
      beforeEach(() => {
        global.User.create.and.callFake((user) => {
          return promise.resolve(mockReq.params.data);
        });

        global.EncryptionService.encryptPassword.and.callFake((hash) => {
          return promise.resolve('passwordHash');
        });
      });

      it('should call res.ok with new user data', (done) => {
        mockReq.params = {
          data: {
            email: 'markaldecimo@outlook.com',
            password: 'threeunder',
            firstName: 'Mark',
            lastName: 'Aldecimo',
            phone: '+639178730822',
            shippingAddress: 'Paranaque City',
          }
        };

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockReq.params.data);
          done();
        });

        UserController.postUser(mockReq, mockRes);
      });
    });

    describe('Non-Happy Path', () => {
      beforeEach(() => {
        mockReq.params = {
          data: {
            email: 'markaldecimo@outlook.com',
            password: 'threeunder',
            firstName: 'Mark',
            lastName: 'Aldecimo',
            phone: '+639178730822',
            shippingAddress: 'Paranaque City',
          }
        };

        global.EncryptionService.encryptPassword.and.callFake((hash) => {
          return promise.resolve('passwordHash');
        });
      });
      describe('When email already exists', () => {
        it('should call response error with index 1', (done) => {
          const error = {
            invalidAttributes: {
              email: true
            }
          };

          global.User.create.and.callFake((user) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(1);
            done();
          });

          UserController.postUser(mockReq, mockRes);
        });
      });

      describe('When phone already exists', () => {
        it('should call response error with index 2', (done) => {
          const error = {
            invalidAttributes: {
              phone: true
            }
          };
          global.User.create.and.callFake((user) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(2);
            done();
          });

          UserController.postUser(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call response error with index 0', (done) => {
          const error = {
            invalidAttributes: {
            }
          };
          global.User.create.and.callFake((user) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          UserController.postUser(mockReq, mockRes);
        });
      });

      describe('When email is invalid', () => {
        it('should call response error with index 3', () => {
          mockReq.params = {
            data: {
              email: 'markaldec',
              password: 'threeunder',
              firstName: 'Mark',
              lastName: 'Aldecimo',
              phone: '+639178730822',
              shippingAddress: 'Paranaque City',
            }
          };

          global.User.create.and.callFake((user) => {
            return promise.resolve();
          });

          UserController.postUser(mockReq, mockRes);

          expect(mockRes.error).toHaveBeenCalledWith(3);
        });
      });

      describe('When password is less than 4 characters', () => {
        it('should call response error with index 4', () => {
          mockReq.params = {
            data: {
              email: 'markaldecimo@outlook.com',
              password: 'thr',
              firstName: 'Mark',
              lastName: 'Aldecimo',
              phone: '+639178730822',
              shippingAddress: 'Paranaque City',
            }
          };

          global.User.create.and.callFake((user) => {
            return promise.resolve();
          });

          UserController.postUser(mockReq, mockRes);

          expect(mockRes.error).toHaveBeenCalledWith(4);
        });
      });

      describe('When password is greater than 20 characters', () => {
        it('should call response error with index 4', () => {
          mockReq.params = {
            data: {
              email: 'markaldecimo@outlook.com',
              password: '123456789012345678901',
              firstName: 'Mark',
              lastName: 'Aldecimo',
              phone: '+639178730822',
              shippingAddress: 'Paranaque City',
            }
          };

          global.User.create.and.callFake((user) => {
            return promise.resolve();
          });

          UserController.postUser(mockReq, mockRes);

          expect(mockRes.error).toHaveBeenCalledWith(4);
        });
      });
    });
  });

  describe('Get Users', () => {

    it('should call User.find', () => {
      global.User.find.and.callFake((user) => {
        return promise.resolve();
      });

      UserController.getUsers(mockReq, mockRes);

      expect(global.User.find).toHaveBeenCalled();
    });

    describe('Happy Path', () => {
      it('should call res.ok with users', (done) => {
        const mockUsers = [{
          email: 'm@m.com'
        }, {
          email: 'd@d.com'
        }];

        global.User.find.and.callFake((user) => {
          return promise.resolve(mockUsers);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockUsers);
          done();
        });

        UserController.getUsers(mockReq, mockRes);

      });
    });

    describe('Non-Happy Path', () => {

      describe('When no user found', () => {
        it('should call response error with index 5', (done) => {
          const mockUsers = [];

          global.User.find.and.callFake((user) => {
            return promise.resolve(mockUsers);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });

          UserController.getUsers(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call response error with index 0', (done) => {
          const mockError = {
            error: true
          };

          global.User.find.and.callFake((user) => {
            return promise.reject(mockError);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          UserController.getUsers(mockReq, mockRes);
        });
      });
    });
  });

  describe('Get User', () => {

    beforeEach(() => {
      mockReq.params = {
        userId: 1
      };
    });

    it('should call User.findOne with userId', () => {

      global.User.findOne.and.callFake((user) => {
        return promise.resolve();
      });

      UserController.getUser(mockReq, mockRes);

      expect(global.User.findOne).toHaveBeenCalledWith({ userId: mockReq.params.userId });

    });

    describe('Happy Path', () => {
      it('should call res.ok with user', (done) => {
        const mockUser = {
          userId: 1,
          email: 'markaldecimo@outlook.com'
        };

        global.User.findOne.and.callFake((user) => {
          return promise.resolve(mockUser);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockUser);
          done();
        });

        UserController.getUser(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When no user found', () => {
        it('should call res.error with index 5', (done) => {
          const mockUser = undefined;

          global.User.findOne.and.callFake((user) => {
            return promise.resolve(mockUser);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });

          UserController.getUser(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call response error with index 0', (done) => {
          const mockError = {
            error: 500
          };

          global.User.findOne.and.callFake((user) => {
            return promise.reject(mockError);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          UserController.getUser(mockReq, mockRes);
        });
      });
    });
  });

  describe('Put User', () => {

    beforeEach(() => {
      mockReq.params = {
        data: {
          email: 'markaldecimo@outlook.com',
          password: 'threeunder',
          firstName: 'Mark',
          lastName: 'Aldecimo',
          phone: '+639178730822',
          shippingAddress: 'Paranaque City',
        },
        userId: 1
      };

      global.EncryptionService.encryptPassword.and.callFake((hash) => {
        return promise.resolve('passwordHash');
      });
    });

    it('should call User.update with userId and updated user info with encrypted password', (done) => {
      global.User.update.and.callFake((criteria, updatedRecord) => {
        expect(criteria).toEqual({ userId: mockReq.params.userId });
        expect(updatedRecord).toEqual(mockReq.params.data);
        expect(mockReq.params.data.password).toEqual('passwordHash');
        done();
        return promise.resolve();
      });

      UserController.putUser(mockReq, mockRes);
    });

    describe('Happy Path', () => {

      it('should call res.ok with first user', (done) => {
        const mockUser = {
          email: 'mark@yahoo.com'
        };

        global.User.update.and.callFake((criteria, updatedRecord) => {
          return promise.resolve([mockUser]);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockUser);
          done();
        });

        UserController.putUser(mockReq, mockRes);
      });

    });

    describe('Non Happy Path', () => {
      describe('When no user updated', () => {
        it('should call res.error with index 6', (done) => {

          global.User.update.and.callFake((criteria, updatedRecord) => {
            return promise.resolve([]);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(6);
            done();
          });

          UserController.putUser(mockReq, mockRes);
        });
      });

      describe('When email already exists', () => {
        it('should call response error with index 1', (done) => {
          const error = {
            invalidAttributes: {
              email: true
            }
          };

          global.User.update.and.callFake((criteria, updatedRecord) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(1);
            done();
          });

          UserController.putUser(mockReq, mockRes);
        });
      });

      describe('When phone already exists', () => {
        it('should call response error with index 2', (done) => {
          const error = {
            invalidAttributes: {
              phone: true
            }
          };

          global.User.update.and.callFake((criteria, updatedRecord) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(2);
            done();
          });

          UserController.putUser(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call response error with index 0', (done) => {
          const error = {
            invalidAttributes: {
            }
          };

          global.User.update.and.callFake((user) => {
            return promise.reject(error);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          UserController.putUser(mockReq, mockRes);
        });
      });

      describe('When email is invalid', () => {
        it('should call response error with index 3', () => {
          mockReq.params = {
            data: {
              email: 'markaldec',
              password: 'threeunder',
              firstName: 'Mark',
              lastName: 'Aldecimo',
              phone: '+639178730822',
              shippingAddress: 'Paranaque City',
            },
            userId: 1
          };

          global.User.update.and.callFake((user) => {
            return promise.resolve();
          });

          UserController.putUser(mockReq, mockRes);

          expect(mockRes.error).toHaveBeenCalledWith(3);
        });
      });

      describe('When password is less than 4 characters', () => {
        it('should call response error with index 4', () => {
          mockReq.params = {
            data: {
              email: 'markaldecimo@outlook.com',
              password: 'thr',
              firstName: 'Mark',
              lastName: 'Aldecimo',
              phone: '+639178730822',
              shippingAddress: 'Paranaque City',
            }
          };

          global.User.update.and.callFake((user) => {
            return promise.resolve();
          });

          UserController.putUser(mockReq, mockRes);

          expect(mockRes.error).toHaveBeenCalledWith(4);
        });
      });

      describe('When password is greater than 20 characters', () => {
        it('should call response error with index 4', () => {
          mockReq.params = {
            data: {
              email: 'markaldecimo@outlook.com',
              password: '123456789012345678901',
              firstName: 'Mark',
              lastName: 'Aldecimo',
              phone: '+639178730822',
              shippingAddress: 'Paranaque City',
            }
          };

          global.User.update.and.callFake((user) => {
            return promise.resolve();
          });

          UserController.putUser(mockReq, mockRes);

          expect(mockRes.error).toHaveBeenCalledWith(4);
        });
      });
    });

  });

  describe('Delete User', () => {
    beforeEach(() => {
      mockReq.params = {
        userId: 1
      };
    });

    it('should call User.destroy with userId', () => {

      const mockUser = {
        userId: 1,
        email: 'markaldecimo@outlook.com'
      };

      global.User.destroy.and.callFake((user) => {
        return promise.resolve([mockUser]);
      });

      UserController.deleteUser(mockReq, mockRes);

      expect(global.User.destroy).toHaveBeenCalledWith({ userId: mockReq.params.userId });

    });

    describe('Happy Path', () => {
      it('should call res.ok with first delete user', (done) => {
        const mockUser = {
          userId: 1,
          email: 'markaldecimo@outlook.com'
        };

        global.User.destroy.and.callFake((user) => {
          return promise.resolve([mockUser]);
        });

        mockRes.ok.and.callFake((data) => {
          expect(data).toEqual(mockUser);
          done();
        });

        UserController.deleteUser(mockReq, mockRes);
      });
    });

    describe('Non Happy Path', () => {
      describe('When no user found', () => {
        it('should call res.error with index 5', (done) => {

          global.User.destroy.and.callFake((users) => {
            return promise.resolve([]);
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(5);
            done();
          });

          UserController.deleteUser(mockReq, mockRes);
        });
      });

      describe('When unhandled error occurred', () => {
        it('should call res.error with index 0', (done) => {

          global.User.destroy.and.callFake((users) => {
            return promise.reject();
          });

          mockRes.error.and.callFake((index) => {
            expect(index).toEqual(0);
            done();
          });

          UserController.deleteUser(mockReq, mockRes);
        });
      });

    });
  });
});
