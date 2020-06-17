function resolveExposes(item) {
  let result;

  if (typeof item === 'string') {
    const splittedItem = item.split(' ');

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

export default getExposes;
