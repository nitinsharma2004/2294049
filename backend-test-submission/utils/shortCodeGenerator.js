const { nanoid } = require("nanoid");

function generateShortcode() {
  return nanoid(6);
}

module.exports = { generateShortcode };
