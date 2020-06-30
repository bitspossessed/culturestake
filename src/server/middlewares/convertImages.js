import sharp from 'sharp';

const DEFAULT_QUALITY = 90;
const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 1200;
const DEFAULT_SUFFIX = 'default';

const THRESHOLD = 128;

// Handle image file resizes for one or more fields, like:
//
// [
//    {
//      name: "headerImages",
//      versions: [{
//        width: 900,
//        height: 600,
//        isThreshold: true,
//      }],
//    },
//    {
//      name: "galleryImages",
//      versions: [{
//        suffix: 'sm',
//        width: 900,
//        height: 600,
//      }, {
//        width: 1600,
//        height: 1600,
//      }],
//    },
//    ...
// ]
export default function convertImages(fields) {
  return async (req, res, next) => {
    if (!req.files) {
      return next();
    }

    try {
      const operations = fields.reduce((acc, field) => {
        if (!(field.name in req.files)) {
          return acc;
        }

        field.versions.forEach((version) => {
          const {
            quality = DEFAULT_QUALITY,
            width = DEFAULT_WIDTH,
            height = DEFAULT_HEIGHT,
            suffix = DEFAULT_SUFFIX,
            isThreshold = false,
          } = version;

          req.files[field.name].forEach((file, index) => {
            const fileType = isThreshold ? 'png' : 'jpeg';
            const fileTypeExt = fileType === 'jpeg' ? 'jpg' : fileType;

            // Rename file based on version suffix
            const originalFileName = file.filename;
            const originalFileNameBase = originalFileName.split('.')[0];
            const newFileName = `${originalFileNameBase}-${suffix}.${fileTypeExt}`;
            const newPath = `${file.destination}/${newFileName}`;

            const promise = new Promise((resolve, reject) => {
              const operation = sharp(file.path);

              // 1. Resize image
              operation.resize(width, height, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy,
                withoutEnlargement: true,
              });

              // 2. Compute threshold, extract alpha channel
              const postProcessing = new Promise((resolve, reject) => {
                if (isThreshold) {
                  operation
                    .toFormat('png')
                    .threshold(THRESHOLD)
                    .extractChannel(0)
                    .toColorspace('b-w')
                    .negate()
                    .toBuffer((error, data, { width, height }) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve(
                          sharp({
                            create: {
                              width,
                              height,
                              channels: 3,
                              background: { r: 0, g: 0, b: 0 },
                            },
                          }).joinChannel(data),
                        );
                      }
                    });
                } else {
                  resolve(operation);
                }
              });

              // 3. Convert to target file format and store it
              postProcessing.then((finalImage) => {
                finalImage
                  .toFormat(fileType, { quality })
                  .toFile(newPath, (error) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve({
                        index,
                        fieldname: field.name,
                        originalFileName,
                        fileName: newFileName,
                        fileType,
                        path: newPath,
                        version,
                      });
                    }
                  });
              });
            });

            acc.push(promise);
          });
        });

        return acc;
      }, []);

      const results = await Promise.all(operations);

      // Group versions by original image
      req.locals.images = results.reduce(
        (acc, { index, fieldname, ...rest }) => {
          if (!acc[fieldname]) {
            acc[fieldname] = [];
          }

          if (!acc[fieldname][index]) {
            acc[fieldname][index] = [];
          }

          acc[fieldname][index].push(rest);

          return acc;
        },
        {},
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}
