function readLine(str) {
  for (var i = 0; i < str.length; i++) {
    if (str[k] == '\n') {
      // Execute portion left of the separator
      try { this(str.substr(0, k)); }
      catch (e) { continue; } // Add next line on error

      // Line has been a valid atomic record
      return [str[k], str.substr(k+1)];
      // Eq.: return this(str[k])(str.substr(k+1));
    }
  }
  this(str); // Equivalent: return str;
}

function readArg(arg) {
  this(arg);
  return Array.prototype.slice.call(arguments, 1);
}
