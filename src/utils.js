function resolveExposes(item) {
  let result;

  if (typeof item === 'string') {
    const splittedItem = item.split(' ');

    if (splittedItem.length > 2) {
      throw new Error(`Invalid "${item}" for expose`);
    }

    result = {
      globalName: splittedItem[0],
      packageName: splittedItem[1],
    };
  }

  return result;
}

function getExposes(items) {
  let result = [];

  if (typeof imports === 'string') {
    result.push(resolveExposes(items));
  } else {
    result = [].concat(items).map((item) => resolveExposes(item));
  }

  return result;
}

export default getExposes;
