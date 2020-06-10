export async function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject();
    };

    reader.onabort = () => {
      reject();
    };

    reader.readAsDataURL(file);
  });
}

export async function imagesToBase64(files) {
  return Promise.all(
    [...files].map((file) => {
      return imageToBase64(file);
    }),
  );
}
