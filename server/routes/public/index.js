const app = module.exports = require('express')();
const Security = require('../../service/Security');

app.get('/ping', (req, res) => {
    const pingLogic = (req, res) => {
        res.send({ msg: 'Server is up and running' });
    };

    Security.authorizeUserCredentialsViaCookie(req, res, pingLogic);
});

app.use('/admin', require('./admin/games'));
app.use('/games', require('./games/gameRetrieval'));
app.use('/games', require('./games/gameUpdater'));
app.use('/auth', require('./auth/auth'));
app.use('/predictions', require('./predictions/predictions'));
app.use('/leaderboards', require('./leaderboards/leaderboards'));
app.use('/blog', require('./blog/blog'));
app.use('/comments', require('./comments/comments'));

// the catch all route
app.all('*', (req, res) => {
	res.status(404).send({ errorMsg: 'not found' });
});