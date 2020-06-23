function resolveExposes(item) {
  let result;

  if (typeof item === 'string') {
    const splittedItem = splitCommand(item.trim());

    if (splittedItem.length > 2) {
      throw new Error(`Invalid "${item}" for expose`);
    }

    result = {
      globalName: splittedItem[0],
      localName: splittedItem[1],
    };
  } else {
    result = item;
  }

  const nestedGlobalName =
    typeof result.globalName === 'string'
      ? result.globalName.split('.')
      : result.globalName;

  return { ...result, globalName: nestedGlobalName };
}

function getExposes(items) {
  let result = [];

  if (typeof items === 'string') {
    result.push(resolveExposes(items));
  } else {
    result = [].concat(items).map((item) => resolveExposes(item));
  }

  return result;
}

function splitCommand(command) {
  const result = command
    .split('|')
    .map((item) => item.split(' '))
    .reduce((acc, val) => acc.concat(val), []);

  for (const item of result) {
    if (!item) {
      throw new Error(
        `Invalid command "${item}" in "${command}" for expose. There must be only one separator: " ", or "|".`
      );
    }
  }

  return result;
}

export default getExposes;
