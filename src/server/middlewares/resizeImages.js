import sharp from 'sharp';

const DEFAULT_QUALITY = 90;
const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 1200;

// Handle image file resizes for one or more fields, like:
//
// [
//    {
//      name: "headerImages",
//      width: 900,
//      height: 600,
//    },
//    {
//      name: "galleryImages",
//      width: 1200,
//    },
//    ...
// ]
export default function resizeImages(fields) {
  return async (req, res, next) => {
    if (!req.files) {
      return next();
    }

    await Promise.all(
      fields.reduce(async (acc, field) => {
        if (!(field.name in req.files)) {
          return acc;
        }

        const {
          quality = DEFAULT_QUALITY,
          width = DEFAULT_WIDTH,
          height = DEFAULT_HEIGHT,
        } = field;

        req.files.forEach(file => {
          const promise = sharp(file.buffer)
            .resize(width, height)
            .toFormat('JPEG')
            .jpeg({ quality })
            .toFile(file.path);

          acc.push(promise);
        });
      }, []),
    );

    next();
  };
}
