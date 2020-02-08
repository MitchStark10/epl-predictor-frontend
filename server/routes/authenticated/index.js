const app = module.exports = require('express')();
const Security = require('../../service/Security');

app.get('/ping', (req, res) => {
    const pingLogic = (req, res) => {
        res.send({ msg: 'Server is up and running' });
    };

    Security.authorizeUserCredentialsViaCookie(req, res, pingLogic);
});

//TODO: Add in authenticated routes

// the catch all route
app.all('*', (req, res) => {
	res.status(404).send({ errorMsg: 'not found' });
});