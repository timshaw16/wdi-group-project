const { api, expect } = require('../spec_helper');
const User            = require('../../models/user');

let jsonToken;

describe('Users Controller Test', () => {
  // This is testing the users index
  describe('GET /api/users', () => {

    // This gets rid of the duplicate error, which comes because of username having to be unique
    beforeEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This creates dummy data for the tests to run against in the API
    // beforeEach(done => {
    //   User
    //   .create({
    //     username: 'alexyeates',
    //     name: 'alex',
    //     email: 'alex@alex.com',
    //     password: 'password',
    //     passwordConfirmation: 'password',
    //     age: 23,
    //     gender: 'male',
    //     image: 'https://www.fillmurray.com/600/400',
    //     location: 'Aldgate',
    //     postcode: 'E1 7PT',
    //     locationCoords: { lat: 51.5152149, lng: 0.0745205 },
    //     about: 'lorem'
    //     // groups: [{ type: mongoose.Schema.ObjectId, ref: 'Group'}]
    //   })
    //   .then(user => {
    //     console.log('user after User.create:', user);
    //     done();
    //   })
    //   .catch(done);
    // }); // shuts: beforeEach(...)

    beforeEach(done => {
      api
        .post('/api/register')
        .set('Accept', 'application/json')
        .send({
          username: 'alexyeates',
          name: 'alex',
          email: 'alex@alex.com',
          age: 23,
          gender: 'male',
          image: 'https://www.fillmurray.com/600/400',
          location: 'Aldgate',
          postcode: 'E1 7PT',
          locationCoords: { lat: 51.5152149, lng: 0.0745205 },
          about: 'lorem',
          password: 'password',
          passwordConfirmation: 'password'
        })
        .then(data => {
          jsonToken = JSON.parse(data.text).token;
          // console.log('jsonData in beforeEach .post(/api/register):', jsonData);
          console.log('jsonData.token in beforeEach .post(/api/register):', jsonToken);
          done();
        })
        .catch(done);
    });



    // This ensures that the unique dummy data is not re-used
    afterEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This test is checking that a request to our API is connecting to a link
    it('should return a 200 response', function (done) {
      // this.skip();
      api
      .get('/api/users')
      .set('Authorization', 'Bearer ' + jsonToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.status).to.be.eq(200);
        done();
      }); // shuts: .end((err, res)..)
    }); // shuts: it('should return a 200 response'...)
    // This test is checking that the request to our API returns an arary
    it('should return an array', function (done) {
      // this.skip();
      api
      .get('/api/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.body).to.be.an('array');
        done();
      }); // shuts: .end((err, res)...)
    }); // shuts: it('should return an array'...)
    // This test is checking that the request to our API returns JSON
    it('should return a JSON object', function (done) {
      // this.skip();
      api
      .get('/api/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.header['content-type'])
        .to.be.eq('application/json; charset=utf-8');
        done();
      }); // shuts: .end((err, res)...)
    }); // shuts: it('should return a JSON object'...)
    // This test is ensuring the required parts of the model are there
    it('should return a user-like object with the required fields as the first item in the array', function(done) {
      // this.skip();
      api
      .get('/api/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.body)
        .to.have.property(0)
        .and.to.include.keys([
          'username',
          'age',
          'email',
          'location',
          'postcode',
          '_id',
          'updatedAt',
          'createdAt'
        ]);
        done();
      }); // shuts: .end((err, res)..)
    }); // shuts: it('should return ...)
    // This test will check that the request is returning all of the fields specified in the model
    it('should return a user-like object with all fields as the first item in the array', function(done) {
      // this.skip();
      api
      .get('/api/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.body)
        .to.have.property(0)
        .and.to.have.all.keys([
          '_id',
          'updatedAt',
          'createdAt',
          'username',
          'email',
          'age',
          'location',
          'postcode',
          'image',
          'name',
          'gender',
          'locationCoords',
          'about',
          'groups'
        ]);
        done();
      }); // shuts: .end((err, res)..)
    }); // shuts: it('should return...')
  }); // shuts: describe('GET /api/users'...)

  // This is testing the users show
  describe('GET /api/users/:id', () => {

    // This gets rid of the duplicate error, which comes because of username having to be unique
    beforeEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This ensures that the unique dummy data is not re-used
    afterEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This test should test that there is a connection when trying to view a user page
    it('should return a 200 response', function(done) {
      // this.skip();
      User
      .create({
        username: 'alexyeates',
        name: 'alex',
        email: 'alex@alex.com',
        age: 23,
        gender: 'male',
        image: 'https://www.fillmurray.com/600/400',
        location: 'Aldgate',
        postcode: 'E1 7PT',
        locationCoords: { lat: 51.5152149, lng: 0.0745205 },
        about: 'lorem',
        password: 'password',
        passwordConfirmation: 'password'
        // groups: [{ type: mongoose.Schema.ObjectId, ref: 'Group'}]
      })
      .then(user => {
        api
        .get(`/api/users/${user._id}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status)
          .to.eq(200);
          done();
        });
      })
      .catch(done);
    }); // shuts: it('should return'...)

    // This test ensures the show is using a correct id for the user
    it('should not return a user if the id is wrong', function(done) {
      // this.skip();
      api
      .get(`/api/users/5917156c02a7b9cde5e2fa21`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.status)
        .to.eq(404);
        done();
      }); // shuts: .end((err, res)...)
    }); // shuts: it('should return'...)
  }); // shuts: describe('GET /api/users/:id'...)

  // This is testing the users create
  describe('POST /api/users', () => {

    // This ensures that what is being added to the database fits the model
    it('should return a 201 response', function(done) {
      // this.skip();
      api
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'alexyeates',
        name: 'alex',
        email: 'alex@alex.com',
        age: 23,
        gender: 'male',
        image: 'https://www.fillmurray.com/600/400',
        location: 'Aldgate',
        postcode: 'E1 7PT',
        locationCoords: { lat: 51.5152149, lng: 0.0745205 },
        about: 'lorem',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.status)
        .to.eq(201);
        done();
      }); // shuts: .end((err, res)...)
    }); // shuts: it('should return...)
  }); // shuts: describe('POST /api/users'...)

  // This is testing the users update
  describe('PUT /api/users/:id', () => {

    // This gets rid of the duplicate error, which comes because of username having to be unique
    beforeEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This ensures that the unique dummy data is not re-used
    afterEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This test ensures a connection and that the 'name' is updated for example
    it('should return a 200 response and update name', function(done) {
      // this.skip();
      User
      .create({
        username: 'alexyeates',
        name: 'alex',
        email: 'alex@alex.com',
        age: 23,
        gender: 'male',
        image: 'https://www.fillmurray.com/600/400',
        location: 'Aldgate',
        postcode: 'E1 7PT',
        locationCoords: { lat: 51.5152149, lng: 0.0745205 },
        about: 'lorem',
        password: 'password',
        passwordConfirmation: 'password'
        // groups: [{ type: mongoose.Schema.ObjectId, ref: 'Group'}]
      })
      .then(user => {
        api
        .put(`/api/users/${user._id}`)
        .set('Accept', 'application/json')
        .send({
          name: 'Joe'
        })
        .end((err, res) => {
          if (err) console.log(err);
          expect(res.status)
          .to.eq(200);

          expect(res.body)
          .to.have.property('name');

          expect(res.body.name)
          .to.eq('Joe');
          done();
        }); // shuts: .end((err, res)...)
      })
      .catch(done);
    }); // shuts: it('should return...)
  }); // shuts: describe('PUT /api/users/:id'...)

  // This is testing the users delete
  describe('DELETE /api/users/:id', () => {

    // This gets rid of the duplicate error, which comes because of username having to be unique
    beforeEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This ensures that the unique dummy data is not re-used
    afterEach(done => {
      User
      .remove()
      .then(() => done())
      .catch(done);
    });

    // This test will ensure that the server has processed the reponse and is no longer producing the deleted user
    it('should return a 204 response', function(done) {
      // this.skip();
      User
      .create({
        username: 'alexyeates',
        name: 'alex',
        email: 'alex@alex.com',
        age: 23,
        gender: 'male',
        image: 'https://www.fillmurray.com/600/400',
        location: 'Aldgate',
        postcode: 'E1 7PT',
        locationCoords: { lat: 51.5152149, lng: 0.0745205 },
        about: 'lorem',
        password: 'password',
        passwordConfirmation: 'password'
        // groups: [{ type: mongoose.Schema.ObjectId, ref: 'Group'}]
      })
      .then(user => {
        api
        .delete(`/api/users/${user._id}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) console.log(err);
          expect(res.status)
          .to.eq(204);
          done();
        }); // shuts: .end((err, res) => {
      }) // shuts: .then(user => {
          .catch(done);
    }); // shuts: it('should return...)
  }); // shuts: describe('DELETE /api/users/:id'...)
}); // shuts: describe('Users Controller Test'...)
