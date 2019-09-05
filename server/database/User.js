module.exports = class User {
    constructor(username, password, email, status, sessionCookie) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.status = status;
        this.sessionCookie = sessionCookie;
    }    
};