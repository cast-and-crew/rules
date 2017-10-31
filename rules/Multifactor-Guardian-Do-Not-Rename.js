function (user, context, callback) {

  var CLIENTS_WITHOUT_MFA = ['NVhNbvUy38qQAZyVw1ZoYtMdHDJv3QSg'];
  // run only if client has disabled mfa

  if (CLIENTS_WITHOUT_MFA.indexOf(context.clientID) === -1) {
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
        provider: 'guardian', //required

        // optional, defaults to true. Set to false to force Guardian authentication every time.
        // See https://auth0.com/docs/multifactor-authentication/custom#change-the-frequency-of-authentication-requests for details
        allowRememberBrowser: false
      };
    }
  }

  callback(null, user, context);
}