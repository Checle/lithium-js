function Client(machine) {
  this.machine = machine;
  this.object = machine;
}
Client.prototype = {
  object: null,
  machine: function () { },
  push: function (input) {
    var output = this.machine.exec(this.object, input);
    if (output instanceof Object) this.object = output;
    if (typeof output == 'function') this.machine = output;
  }
};

function State() {
  this.apps = [];
}
State.prototype = {
  value: null,
  machine: null,
  apps: null,
  qualify: function (input) {
    if (typeof input == 'function') return false;
    if (input <= this.value || input === this.value) return false;
  },
  branch: function () {
    this.apps.push();
  },
  push: function (input) {
    if (typeof input == 'function') return this.branch();
    if (!this.qualify(input)) return;
    try { var output = this.machine.call(this.object, input); }
    catch (e) { return; }
    this.value = input;
    if (typeof output == 'function') this.machine = output;
    if (output instanceof Object) this.object = output;
  }
};

var client = new Client(confirm);

function confirm(input) {
  var confirmation = JSON.parse(input), children = confirmation.children;
  for (var prop in children) if (children.hasOwnProperty(prop)) {
    this(children[prop]); // Verify child
  }
  return true;
}
