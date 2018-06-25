import * as path from 'path';
import * as fs from 'fs';

const parentDir = path.join(__dirname, '../');
if (process.cwd() !== parentDir.slice(0, -1)) {
	// declare parent directory (src) as Current Work Directory
	process.chdir(parentDir);
}

class Directories {
	public srcPath: string = parentDir;
	public basePath: string = path.join(parentDir, '../');

	public configPath: string = path.join(this.srcPath, '/config');
	public ControllerPath: string = path.join(this.srcPath, '/Controller');
	public HandlerPath: string = path.join(this.srcPath, '/Handler');
	public LibPath: string = path.join(this.srcPath, '/Lib');
	public MiddlewarePath: string = path.join(this.srcPath, '/Middleware');
	public ModelPath: string = path.join(this.srcPath, '/Model');
	public PocoPath: string = path.join(this.srcPath, '/Poco');
	public RepositoryPath: string = path.join(this.srcPath, '/Repository');
	public ServicePath: string = path.join(this.srcPath, '/Service');

	public emailTemplatesPath: string = path.join(this.basePath, '/emailTemplates');
	public logsPath: string = path.join(this.basePath, '/logs');
	public publicPath: string = path.join(this.basePath, '/public');
	public seedersPath: string = path.join(this.basePath, '/seeders');
	public tasksPath: string = path.join(this.basePath, '/tasks');
	public uploadsPath: string = path.join(this.basePath, '/uploads');
	public viewsPath: string = path.join(this.basePath, '/views');
	public certsPath: string = path.join(this.basePath, '/certs');

	public publicLogoStoresPath: string = path.join(this.basePath, '/public/assets/img/logo/store');
	public publicPromoImagesPath: string = path.join(this.basePath, '/public/assets/img/promo/');
	public publicUserAvatarPath: string = path.join(this.basePath, '/public/assets/img/avatar/user');

	getPathToFile(dir: string, file: string | null): string {
		return (dir in this) ? path.join(this[dir], file) : null;
	}

	fileExists(dir: string, file: string | null): boolean {
		return (fs.existsSync(path.join(this[dir], file)));
	}

	getPathToFileIfExists(dir: string, file: string): string | null {
		if (!this.hasOwnProperty(dir) || !this.fileExists(dir, file)) {
			return null;
		}

		return this.getPathToFile(dir, file);
	}

	getJsonFile(dirOrFullPath: string, file: string = null): any {
		try {
			const data = this.getFileContents(dirOrFullPath, file);
			return JSON.parse(data);
		} catch (E) {
			throw { type: 500, msg: E };
		}
	}

	getFileContents(dirOrFullPath: string, file: string = null): string {
		let filePath;
		let data;

		if (dirOrFullPath && file) {
			filePath = path.join(this[dirOrFullPath], file);
		} else if (dirOrFullPath && !file) {
			filePath = dirOrFullPath;
		} else {
			throw { type: 500, msg: `Impossible to fetch file without provide any parameters.` };
		}

		if (!fs.existsSync(filePath)) {
			throw { type: 500, msg: `'${filePath}' No such file or directory.` };
		}

		try {
			data = fs.readFileSync(filePath, { encoding: 'utf-8' });
			return `${data}`;
		} catch (E) {
			throw { type: 500, msg: E };
		}
	}

	readDir(dir: string, cropFileExtension: boolean = false): string[] {
		if (this.hasOwnProperty(dir)) {
			dir = this[dir];
		} else if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
			dir = path.resolve(dir);
		} else {
			throw { type: 500, msg: `'${dir}' No such file or directory.` };
		}

		return fs
			.readdirSync(dir)
			.map(file => (cropFileExtension) ? path.parse(file).name : file);
	}
}

const Dirs = new Directories;

export default Object.freeze(Dirs);
