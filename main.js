const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
var application = express();

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

var storage = {
    users: [{ email: 'admin', password: 'qwer1234' }],
    sessionId: 0,
    sessions: []
};


application.use(cookieParser());
application.use(bodyParser.urlencoded());

application.use((request, response, next) => {
    if (request.cookies.session !== undefined) {
        var sessionId = parseInt(request.cookies.session);
        var user = storage.sessions[sessionId];

        if (!user) {
            response.locals.user = { isAuthenticated: false };
        }
        else {
            response.locals.user = { isAuthenticated: true };
        }
    } else {
        response.locals.user = { isAuthenticated: false };
    }

    next();
});

application.get('/', (request, response) => {
    response.render('signin');
});

application.get('/index', (request, response) => {
    response.render('index');

});

application.get('/signin', (request, response) => {
    request.render('signin');
});

application.post('/signin', (request, response) => {

    var email = request.body.email;
    var password = request.body.password;
    var user = storage.users.find(user => { return user.email === email && user.password === password });
    

    if (!user) {
        response.render('signin');
        
    } else {
        var sessionId = storage.sessionId;
        storage.sessionId++;
        storage.sessions.push(user);

        response.cookie('session', sessionId);

        response.render('index', user);
    }
    storage.users.push(user);
    });
    
application.listen(3000);