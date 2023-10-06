function predicateValidatorGenerator(
  getValuesHook,
  aName,
  bName,
  predicate,
  optionalErrorMessage
) {
  const [a, b] = getValuesHook([aName, bName]);
  if (!a || !b) {
    return true;
  }

  if (!predicate(a, b)) {
    return optionalErrorMessage || false;
  }
  return true;
}

function equalValidatorGenerator(
  getValuesHook,
  aName,
  bName,
  optionalErrorMessage
) {
  const [a, b] = getValuesHook([aName, bName]);
  if (!a || !b) {
    return true;
  }
  if (a !== b) {
    return optionalErrorMessage || false;
  }
  return true;
}

function lowerOrEqualNumberValidatorGenerator(
  getValuesHook,
  aName,
  bName,
  optionalErrorMessage
) {
  const [a, b] = getValuesHook([aName, bName]);
  if (!a || !b) {
    return true;
  }
  if (!(Number(a) <= Number(b))) {
    return optionalErrorMessage || false;
  }
  return true;
}

function lowerDateValidatorGenerator(
  getValuesHook,
  aName,
  bName,
  optionalErrorMessage
) {
  const [a, b] = getValuesHook([aName, bName]);
  if (!a || !b) {
    return true;
  }

  const dateA = new Date(a);
  const dateB = new Date(b);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(dateA) || isNaN(dateB)) {
    return true;
  }

  if (!(a.getTime() < b.getTime())) {
    return optionalErrorMessage || false;
  }
  return true;
}

function fieldCountValidatorGenerator(
  fields,
  minimum,
  maximum,
  optionalErrorMessage
) {
  if (!Array.isArray(fields)) {
    return false;
  }
  if (typeof minimum === 'number') {
    if (fields.length < minimum) {
      return optionalErrorMessage || false;
    }
  }
  if (typeof maximum === 'number') {
    if (fields.length > maximum) {
      return optionalErrorMessage || false;
    }
  }
  return true;
}

function wrap(func) {
  return (...args) =>
    () =>
      func(...args);
}

const predicateValidator = wrap(predicateValidatorGenerator);
const equalValidator = wrap(equalValidatorGenerator);
const lowerOrEqualNumberValidator = wrap(lowerOrEqualNumberValidatorGenerator);
const lowerDateValidator = wrap(lowerDateValidatorGenerator);
const fieldCountValidator = wrap(fieldCountValidatorGenerator);

export {
  predicateValidator,
  equalValidator,
  lowerOrEqualNumberValidator,
  lowerDateValidator,
  fieldCountValidator,
};
