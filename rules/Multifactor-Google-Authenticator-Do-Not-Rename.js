function (user, context, callback) {

  // whitelist of users which never use mfa - justin@parhelium.pl
  var USERS_WITHOUT_MFA = ['auth0|5935bb343dc3ba3329dd1fbb', 'auth0|59faf2efd9c0c536bf4c2508', 'auth0|59faff32d1f459141120579a', 'auth0|59e9ac167d667a240b095bf4'];
  // whitelist of clients which never use mfa - for iOS
  var CLIENTS_WITHOUT_MFA = ['NVhNbvUy38qQAZyVw1ZoYtMdHDJv3QSg'];

  // run only if client has enabled mfa
  if (!(CLIENTS_WITHOUT_MFA.indexOf(context.clientID) > -1 || USERS_WITHOUT_MFA.indexOf(user.user_id) > -1)) {
    if (!user.app_metadata || !user.app_metadata.authorization ||
      !Array.isArray(user.app_metadata.authorization.groups)) {
      return callback(null, user, context);
    }

    var groups = user.app_metadata.authorization.groups;

    // check if user belong to any group acitve in Authorization Extension
    var needsMFA = groups && groups.length > 0;

    if (needsMFA){
      context.multifactor = {
        // required
        provider: 'google-authenticator', //required

        // optional, defaults to true. Set to false to force Guardian authentication every time.
        // See https://auth0.com/docs/multifactor-authentication/custom#change-the-frequency-of-authentication-requests for details
        allowRememberBrowser: false
      };
    }
  }

  callback(null, user, context);
}