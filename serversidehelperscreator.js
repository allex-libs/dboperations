function createServerSideHelpers (execlib) {
  'use strict';

  var lib = execlib.lib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry;

  /*
  function copy (src, dest, fields) {
    fields.forEach(function (fld) {
      if (fld.name && fld.hasOwnProperty('default')) {
        if (!src.hasOwnProperty(fld.name) || src[fld.name] === null) {
          dest[fld.name] = fld.default;
        } else {
          dest[fld.name] = src[fld.name];
        }
      } else {
        dest[fld] = src[fld];
      }
    });
    src = null;
    dest = null;
  }
  */
  function copy (src, dest, fields) {
    fields.forEach(function (fld) {
      dest[fld] = src[fld];
    });
    src = null;
    dest = null;
  }

  function userHashProc (fields, userhash, defer, _userhash) {
    if (_userhash && _userhash.profile) {
      copy (_userhash.profile, userhash, fields);
      defer.resolve(userhash);
    } else {
      defer.reject(new lib.Error('CLIENT_DOES_NOT_EXIST', userhash.username));
    }
    fields = null;
    defer = null;
    userhash = null;
  }

  function dbResolverFetchMethodTemplate (usersink, fields, userhash, defer) {
    usersink.call('fetchUser', {username: userhash.username}).then(
      userHashProc.bind(null, fields, userhash, defer)
    );
  }

  function singleRecordFetcherFromSinkByFieldValue (fieldname) {
    return function (sink, fieldval, defer) {
      taskRegistry.run('readFromDataSink', {
        sink: sink,
        filter: {
          op: 'eq',
          field: fieldname,
          value: fieldval
        },
        singleshot: true,
        cb: defer.resolve.bind(defer),
        errorcb: defer.reject.bind(defer)
      });
    };
  };

  return {
    copy: copy,
    dbResolverFetchMethodTemplate: dbResolverFetchMethodTemplate,
    singleRecordFetcherFromSinkByFieldValue: singleRecordFetcherFromSinkByFieldValue
  };

}

module.exports = createServerSideHelpers;
