module.exports = class SessionCookie {
    constructor(username, sessionCookie, device) {
        this.username = username;
        this.sessionCookie = sessionCookie;
        this.device = device;
    }
}