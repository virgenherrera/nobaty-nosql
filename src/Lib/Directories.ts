import { join } from 'path';
import { existsSync } from 'fs';

const parentDir = join(__dirname, '../');
if (process.cwd() !== parentDir.slice(0, -1)) {
	// declare parent directory (src) as Current Work Directory
	process.chdir(parentDir);
}

class Directories {
	public srcPath: string = parentDir;
	public basePath: string = join(parentDir, '../');

	public configPath: string = join( this.srcPath, '/config' );
	public ControllerPath: string = join( this.srcPath, '/Controller' );
	public HandlerPath: string = join( this.srcPath, '/Handler' );
	public LibPath: string = join( this.srcPath, '/Lib' );
	public MiddlewarePath: string = join( this.srcPath, '/Middleware' );
	public ModelPath: string = join( this.srcPath, '/Model' );
	public PocoPath: string = join( this.srcPath, '/Poco' );
	public RepositoryPath: string = join( this.srcPath, '/Repository' );
	public ServicePath: string = join( this.srcPath, '/Service' );

	public examplesPath: string = join(this.basePath, '/examples');
	public logsPath: string = join(this.basePath, '/logs');
	public migrationsPath: string = join(this.basePath, '/migrations');
	public publicPath: string = join(this.basePath, '/public');
	public seedersPath: string = join(this.basePath, '/seeders');
	public tasksPath: string = join(this.basePath, '/tasks');
	public viewsPath: string = join(this.basePath, '/views');

	getPathToFile(dir: string, file: string|null): string {
		return ( dir in this ) ? join( this[ dir ] , file ) : null;
	}

	fileExists(dir: string, file: string|null): boolean {
		return ( existsSync( join( this[ dir ] , file ) ) ) ;
	}
}

export default new Directories;
