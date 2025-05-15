import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { ERROR_MESSAGES } from '~/common/constants/error_messages';
export const multerConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error(ERROR_MESSAGES.invalidFileFormat), false);
    }
    cb(null, true);
  },
};
