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
	[key: string]: any

	constructor() {
		this.mapPathToThis(this.basePath);
		this.mapPathToThis(this.srcPath);
		console.log(
			this
		);
	}

	private mapPathToThis(Path: string): void {
		const pathsToIgnore = ['.git', '.vscode'];
		fs
			.readdirSync(Path)
			.forEach((element) => {
				const elPath = path.join(Path, element);

				if (pathsToIgnore.indexOf(element) === -1 && fs.lstatSync(elPath).isDirectory()) {
					this[`${element}Path`] = elPath;
				}
			});
	}

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
