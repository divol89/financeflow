const levels = {
  values: {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
  },
};

function createLogger(bindings = {}) {
  const logger = {
    trace: console.debug.bind(console),
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    fatal: console.error.bind(console),
    child(childBindings = {}) {
      return createLogger({ ...bindings, ...childBindings });
    },
    bindings() {
      return bindings;
    },
  };

  return logger;
}

function pino() {
  return createLogger();
}

pino.levels = levels;

module.exports = pino;
module.exports.default = pino;
module.exports.levels = levels;
