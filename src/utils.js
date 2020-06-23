import path from 'path';

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

function resolveExposes(item) {
  let result;

  if (typeof item === 'string') {
    const splittedItem = splitCommand(item.trim());

    if (splittedItem.length > 2) {
      throw new Error(`Invalid "${item}" for exposes`);
    }

    result = {
      globalName: splittedItem[0],
      moduleLocalName: splittedItem[1],
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


function modifyUserRequest(request) {
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

export { getExposes, contextify, modifyUserRequest };
