function ResponseError (message, code = 500, originalError = null) {
    this.message = message;
    this.name = 'ResponseError';
    this.code = code;
    this.originalError = originalError;
}

ResponseError.prototype = Error.prototype;

ResponseError.prototype.toString = function () {
    return this.name + ' ' + this.code + ': ' + this.message;
}

module.exports = ResponseError;
