const s3 = new S3Client({ region: process.env.AWS_REGION });

const S3_CONFIG = {
  bucket: process.env.S3_IMAGES_BUCKET_NAME,
  region: process.env.AWS_REGION,
  baseUrls: {
    products: 'products',
    categories: 'categories', 
    restaurants: 'restaurants',
    processed: 'processed',
    sizes: 'sizes'
  }
};

const getS3Url = (key) => {
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
};

const getS3Key = (type, filename) => {
  return `${S3_CONFIG.baseUrls[type]}/${filename}`;
};

module.exports = {
  s3,
  S3_CONFIG,
  getS3Url,
  getS3Key
};
