module.exports = {
  generateEmail: function (userContext, events, done) {
    const email = `test${Math.floor(Math.random() * 100000)}@teste.com`;
    userContext.vars.generatedEmail = email;
    return done();
  }
};
