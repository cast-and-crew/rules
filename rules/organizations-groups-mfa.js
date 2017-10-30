function (user, context, callback) {
  // skip authorization guardian if user doesn't have any application methadata
  if (!user.app_metadata || !user.app_metadata.authorization ||
    !Array.isArray(user.app_metadata.authorization.groups)) {
    return callback(null, user, context);
  }

  var groups = user.app_metadata.authorization.groups;

  // check if user belong to any group acitve in Authorization Extension
  var needsMFA = !!groups.length > 0;

  if (needsMFA){
    context.multifactor = {
      // required
      provider: 'guardian', //required

      // optional, defaults to true. Set to false to force Guardian authentication every time.
      // See https://auth0.com/docs/multifactor-authentication/custom#change-the-frequency-of-authentication-requests for details
      allowRememberBrowser: false
    };
  }

  callback(null, user, context);
}