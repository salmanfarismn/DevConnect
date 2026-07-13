class ExpressError extends Error {
    constructor(error, status) {
        super();
        this.error = error;
        this.status = status;
    }
}

module.exports = ExpressError;