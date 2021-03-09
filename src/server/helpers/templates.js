import fs from 'fs';
import path from 'path';
import pug from 'pug';

export const compileAll = (viewFolder) => {
  const sources = fs.readdirSync(path.join(process.cwd(), viewFolder));

  return sources
    .filter((file) => /.pug$/.test(file))
    .reduce((memo, file) => {
      const name = file.substring(0, file.indexOf('.'));
      const filePath = path.join(process.cwd(), viewFolder, file);

      return { ...memo, [name]: pug.compileFile(filePath) };
    }, {});
};

export default { compileAll };
