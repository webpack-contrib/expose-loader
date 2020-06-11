import path from 'path';

export default (asset, compiler, stats) => {
  const usedFs = compiler.outputFileSystem;
  const outputPath = stats.compilation.outputOptions.path;

  let data = '';
  let targetFile = asset;

  const queryStringIdx = targetFile.indexOf('?');

  if (queryStringIdx >= 0) {
    targetFile = targetFile.substring(0, queryStringIdx + 1);
  }

  try {
    data = usedFs.readFileSync(path.join(outputPath, targetFile)).toString();
  } catch (error) {
    data = error.toString();
  }

  return data;
};
