const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const saveImage = (model, imageEncoded) => {
  if (imageEncoded == null) return;
  const image = JSON.parse(imageEncoded);
  if (image != null && imageMimeTypes.includes(image.type)) {
    model.image = new Buffer.from(image.data, "base64");
    model.imageType = image.type;
  }
};

module.exports = saveImage;
