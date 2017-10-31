/*
*  This rule been automatically generated by auth0-authz-extension
*  Updated by kuba@parhelium.pl, 2017-10-31T13:12:31.673Z
 */
function (user, context, callback) {
  var _ = require('lodash');
  var EXTENSION_URL = "https://castandcrew.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201";

  var audience = '';
  audience = audience || (context.request && context.request.query && context.request.query.audience);
  if (audience === 'urn:auth0-authz-api') {
    return callback(new UnauthorizedError('no_end_users'));
  }

  audience = audience || (context.request && context.request.body && context.request.body.audience);
  if (audience === 'urn:auth0-authz-api') {
    return callback(new UnauthorizedError('no_end_users'));
  }

  getPolicy(user, context, function(err, res, data) {
    if (err) {
      console.log('Error from Authorization Extension:', err);
      return callback(new UnauthorizedError('Authorization Extension: ' + err.message));
    }

    if (res.statusCode !== 200) {
      console.log('Error from Authorization Extension:', res.body || res.statusCode);
      return callback(
        new UnauthorizedError('Authorization Extension: ' + ((res.body && (res.body.message || res.body) || res.statusCode)))
      );
    }

    // Update the user object.
    user.groups = mergeRecords(user.groups, data.groups);

    // Store this in the user profile (app_metadata).
    saveToMetadata(user, data.groups, data.roles, data.permissions, function(err) {
      return callback(err, user, context);
    });
  });

  // Get the policy for the user.
  function getPolicy(user, context, cb) {
    request.post({
      url: EXTENSION_URL + "/api/users/" + user.user_id + "/policy/" + context.clientID,
      headers: {
        "x-api-key": "fa79fa23a1acec4062dd29e9400c3c9c5e0c796a5b19153fd331481e80103b77"
      },
      json: {
        connectionName: context.connection || user.identities[0].connection,
        groups: user.groups
      },
      timeout: 5000
    }, cb);
  }

  // Store authorization data in the user profile so we can query it later.
  function saveToMetadata(user, groups, roles, permissions, cb) {
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.authorization = {
      groups: mergeRecords(user.groups, groups),
    };

    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function() {
        cb();
      })
      .catch(function(err){
        cb(err);
      });
  }

  // Merge the IdP records with the records of the extension.
  function mergeRecords(idpRecords, extensionRecords) {
    idpRecords = idpRecords || [ ];
    extensionRecords = extensionRecords || [ ];

    if (!Array.isArray(idpRecords)) {
      idpRecords = idpRecords.replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ');
    }

    return _.uniq(_.union(idpRecords, extensionRecords));
  }
}