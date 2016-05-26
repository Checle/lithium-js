var record = new function () {

  function NotImplementedError() { }
  NotImplementedError.prototype = new Error('Not implemented');
  
  this.open = function (path, flags, mode, callback) {
    throw new NotImplementedError;
  };
  this.close = function (fd, callback) {
    throw new NotImplementedError;
  };
  this.exec = function (path, callback) {
    throw new NotImplementedError;
  };

}