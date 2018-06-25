import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';
import Directories from '../Lib/Directories';

// Create uploads directory if does not exist
if (!existsSync(Directories.uploadsPath)) {
	mkdirSync(Directories.uploadsPath);
}


function imageFilter(...args) {
	const [, file, cb] = args;
	// accept image only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(new Error('Only image files are allowed!'), false);
	}

	cb(null, true);
}

// function videoFilter(req, file, cb) {
// 	// accept video only
// 	if (!file.originalname.match(/\.(mp4|flv)$/)) {
// 		return cb(new Error('Only video files are allowed!'), false);
// 	}

// 	cb(null, true);
// }


export const imageUpload = multer({
	dest: Directories.uploadsPath,
	fileFilter: imageFilter
});

// export const videoUpload = multer({
// 	dest: Directories.uploadsPath,
// 	fileFilter: videoFilter
// });
