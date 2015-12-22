var assert = require('assert');
var origindb = require('../index');
var fs = require('fs');
var rimraf = require('rimraf');

function readJSON(cb) {
  'use strict';

  setTimeout(() => {
    var data = JSON.parse(fs.readFileSync('db/foo.json'));
    cb(data);
  }, 20);
}

describe('database', () => {
  'use strict';

  var db;

  beforeEach(() => {
    rimraf.sync('db');
  });

  after(() => {
    rimraf.sync('db');
  });

  describe('CRUD', () => {

    beforeEach(() => {
      db = origindb('db');
    });

    it('creates', done => {
      db('foo').set('bar', 1);
      assert.deepEqual(db('foo').object(), {bar: 1});
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('reads', done => {
      db('foo').set('bar', 1);
      assert.equal(db('foo').get('bar'), 1);
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('updates', done => {
      db('foo').set('bar', 1);
      readJSON(data => {
        assert.deepEqual(data, {bar: 1});
        db('foo').set('bar', db('foo').get('bar') + 1);
        readJSON(data => {
          assert.deepEqual(data, {bar: 2});
          assert.equal(db('foo').get('bar'), 2);
          assert.equal(Object.keys(db('foo').object()).length, 1);
          done();
        });
      });
    });

    it('deletes', (done) => {
      db('foo').set('bar', 1);
      readJSON((data) => {
        assert.deepEqual(data, {bar: 1});
        delete db('foo').object().bar;
        db.save();
        readJSON(data => {
          assert.deepEqual(data, {});
          assert.deepEqual(db('foo').object(), {});
          assert.equal(Object.keys(db('foo').object()).length, 0);
          done();
        });
      });
    });

  });

});
