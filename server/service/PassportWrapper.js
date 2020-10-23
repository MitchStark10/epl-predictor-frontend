module.exports = {
  getUserEmail: (req) => {
    if (req 
      && req.session 
      && req.session.passport 
      && req.session.passport.user 
      && req.session.passport.user.emails 
      && req.session.passport.user.emails[0] 
      && req.session.passport.user.emails[0].value) {

      return req.session.passport.user.emails[0].value;
    }

    return null;
  }
};