import path from 'path';

function getNewUserRequest(request) {
  const splittedRequest = request.split('!');
  const lastPartRequest = splittedRequest.pop().split('?', 2);
  const pathObject = path.parse(lastPartRequest[0]);

  pathObject.base = `${path.basename(pathObject.base, pathObject.ext)}-exposed${
    pathObject.ext
  }`;

  lastPartRequest[0] = path.format(pathObject);

  splittedRequest.push(lastPartRequest.join('?'));

  return splittedRequest.join('!');
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

function parseBoolean(string, defaultValue = null) {
  if (typeof string === 'undefined') {
    return defaultValue;
  }

  switch (string.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return defaultValue;
  }
}

function resolveExposes(item) {
  let result;

  if (typeof item === 'string') {
    const splittedItem = splitCommand(item.trim());

    if (splittedItem.length > 3) {
      throw new Error(`Invalid "${item}" for exposes`);
    }

    result = {
      globalName: splittedItem[0],
      moduleLocalName: splittedItem[1],
      override: parseBoolean(splittedItem[2], false),
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

function contextify(context, request) {
  return request
    .split('!')
    .map((r) => {
      const splitPath = r.split('?', 2);

      if (/^[a-zA-Z]:\\/.test(splitPath[0])) {
        splitPath[0] = path.win32.relative(context, splitPath[0]);

        if (!/^[a-zA-Z]:\\/.test(splitPath[0])) {
          splitPath[0] = splitPath[0].replace(/\\/g, '/');
        }
      }

      if (/^\//.test(splitPath[0])) {
        splitPath[0] = path.posix.relative(context, splitPath[0]);
      }

      if (!/^(\.\.\/|\/|[a-zA-Z]:\\)/.test(splitPath[0])) {
        splitPath[0] = `./${splitPath[0]}`;
      }

      return splitPath.join('?');
    })
    .join('!');
}

export { getNewUserRequest, getExposes, contextify };
