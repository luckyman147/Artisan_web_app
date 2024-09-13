import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import User from '../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API', () => {
  let userToken;

  before(async () => {
    // Clean the database or add some test data if necessary
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      const newUser = {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Client'
      };

      chai.request(app)
        .post('/api/auth/register')
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', (done) => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      chai.request(app)
        .post('/api/auth/login')
        .send(credentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('token');
          userToken = res.body.token; // Save the token for later tests
          done();
        });
    });
  });

  describe('GET /api/auth/verify/:token', () => {
    it('should verify a user email', (done) => {
      // Assume the verification token has been received via email
      const verificationToken = 'someValidToken';

      chai.request(app)
        .get(`/api/auth/verify/${verificationToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });

  describe('POST /api/auth/forgotpassword', () => {
    it('should send a password reset email', (done) => {
      const email = { email: 'test@example.com' };

      chai.request(app)
        .post('/api/auth/forgotpassword')
        .send(email)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });

  describe('PUT /api/auth/resetpassword/:token', () => {
    it('should reset the user password', (done) => {
      const resetToken = 'someResetToken';
      const newPassword = { password: 'newpassword123' };

      chai.request(app)
        .put(`/api/auth/resetpassword/${resetToken}`)
        .send(newPassword)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should logout the user', (done) => {
      chai.request(app)
        .get('/api/auth/logout')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  after(async () => {
    // Clean up after tests, if needed
    await User.deleteMany({});
  });
});
