import path from "node:path";

function getNewUserRequest(request) {
  const splittedRequest = request.split("!");
  const lastPartRequest = splittedRequest.pop().split("?", 2);
  const pathObject = path.parse(lastPartRequest[0]);

  pathObject.base = `${path.basename(pathObject.base, pathObject.ext)}-exposed${
    pathObject.ext
  }`;

  lastPartRequest[0] = path.format(pathObject);

  splittedRequest.push(lastPartRequest.join("?"));

  return splittedRequest.join("!");
}

function splitCommand(command) {
  const result = command.split("|").flatMap((item) => item.split(" "));

  for (const item of result) {
    if (!item) {
      throw new Error(
        `Invalid command "${item}" in "${command}" for expose. There must be only one separator: " ", or "|".`,
      );
    }
  }

  return result;
}

function parseBoolean(string, defaultValue = null) {
  if (typeof string === "undefined") {
    return defaultValue;
  }

  switch (string.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return defaultValue;
  }
}

function resolveExposes(item) {
  let result;

  if (typeof item === "string") {
    const splittedItem = splitCommand(item.trim());

    if (splittedItem.length > 3) {
      throw new Error(`Invalid "${item}" for exposes`);
    }

    result = {
      globalName: splittedItem[0],
      moduleLocalName: splittedItem[1],
      override:
        typeof splittedItem[2] !== "undefined"
          ? parseBoolean(splittedItem[2], false)
          : undefined,
    };
  } else {
    result = item;
  }

  const nestedGlobalName =
    typeof result.globalName === "string"
      ? result.globalName.split(".")
      : result.globalName;

  return { ...result, globalName: nestedGlobalName };
}

function getExposes(items) {
  const exposeItems =
    typeof items === "string" && items.includes(",") ? items.split(",") : items;

  const result =
    typeof exposeItems === "string"
      ? [resolveExposes(exposeItems)]
      : [exposeItems].flat().map((item) => resolveExposes(item));

  return result;
}

// TODO simplify for the next major release
function contextify(loaderContext, context, request) {
  if (
    typeof loaderContext.utils !== "undefined" &&
    typeof loaderContext.utils.contextify === "function"
  ) {
    return loaderContext.utils.contextify(loaderContext.context, request);
  }

  return request
    .split("!")
    .map((r) => {
      const splitPath = r.split("?");

      if (/^[a-zA-Z]:\\/.test(splitPath[0])) {
        splitPath[0] = path.win32.relative(context, splitPath[0]);

        if (!/^[a-zA-Z]:\\/.test(splitPath[0])) {
          splitPath[0] = splitPath[0].replaceAll("\\", "/");
        }
      }

      if (/^\//.test(splitPath[0])) {
        splitPath[0] = path.posix.relative(context, splitPath[0]);
      }

      if (!/^(\.\.\/|\/|[a-zA-Z]:\\)/.test(splitPath[0])) {
        splitPath[0] = `./${splitPath[0]}`;
      }

      return splitPath.join("?");
    })
    .join("!");
}

function isAbsolutePath(str) {
  return path.posix.isAbsolute(str) || path.win32.isAbsolute(str);
}

// TODO simplify for the next major release
function stringifyRequest(loaderContext, request) {
  if (
    typeof loaderContext.utils !== "undefined" &&
    typeof loaderContext.utils.contextify === "function"
  ) {
    return JSON.stringify(
      loaderContext.utils.contextify(loaderContext.context, request),
    );
  }

  const splitted = request.split("!");
  const context =
    loaderContext.context ||
    (loaderContext.options && loaderContext.options.context);

  return JSON.stringify(
    splitted
      .map((part) => {
        // First, separate singlePath from query, because the query might contain paths again
        const splittedPart = part.match(/^(.*?)(\?.*)/);
        const query = splittedPart ? splittedPart[2] : "";
        let singlePath = splittedPart ? splittedPart[1] : part;

        if (isAbsolutePath(singlePath) && context) {
          singlePath = path.relative(context, singlePath);
        }

        return singlePath.replaceAll("\\", "/") + query;
      })
      .join("!"),
  );
}

function interpolateName(loaderContext, filename) {
  let basename = "file";

  if (loaderContext.resourcePath) {
    const parsed = path.parse(loaderContext.resourcePath);

    if (parsed.dir) {
      basename = parsed.name;
    }
  }

  return filename.replaceAll(/\[name\]/gi, () => basename);
}

export {
  contextify,
  getExposes,
  getNewUserRequest,
  interpolateName,
  stringifyRequest,
};
