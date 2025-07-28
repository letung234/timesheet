export const CLOUDINARY_FOLDER = 'timesheet';
export const CLOUDINARY_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];
export const CLOUDINARY_TRANSFORMATION = [
  { width: 1000, height: 1000, crop: 'limit' },
  { quality: 'auto' },
  { fetch_format: 'auto' },
];
