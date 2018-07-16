import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../Poco/User';

export interface IHandler {
	readonly name: string;
	readonly path: string;
	router: Router;
}

export interface IGetAllHandler extends IHandler {
	getAllHandler(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export interface IGetOneHandler extends IHandler {
	getOneHandler(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export interface IPostHandler extends IHandler {
	postHandler(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export interface IPutHandler extends IHandler {
	putHandler(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export interface IDeleteHandler extends IHandler {
	deleteHandler(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export interface IRestFull extends
	IGetAllHandler,
	IGetOneHandler,
	IPostHandler,
	IPutHandler,
	IDeleteHandler { }


export interface ICreateAction {
	createAction(p: any): Promise<any>;
}

export interface IListAction {
	listAction(p: any): Promise<any>;
}

export interface IShowAction {
	showAction(p: any): Promise<any>;
}

export interface IEditAction {
	editAction(p: any): Promise<any>;
}

export interface IDeleteAction {
	deleteAction(p: any): Promise<any>;
}

export interface ICrudController extends
	ICreateAction,
	IListAction,
	IShowAction,
	IEditAction,
	IDeleteAction { }

export interface IGetById {
	GetById(p: any): Promise<any>;
}
export interface IFindOne {
	FindOne(p: any): Promise<any>;
}
export interface IFindBy {
	FindBy(p: any): Promise<any>;
}
export interface IGetAll {
	GetAll(p: any): Promise<any>;
}
export interface ICreate {
	Create(p: any): Promise<any>;
}
export interface IUpdate {
	Update(p: any): Promise<any>;
}
export interface IDelete {
	Delete(p: any): Promise<any>;
}


export interface IFullRepository extends
	IGetById,
	IFindOne,
	IFindBy,
	IGetAll,
	ICreate,
	IUpdate,
	IDelete { }

export interface IResDto {
	status: number;
	success: boolean;
	message: string;
	data?: any | any[];
	limit?: number;
	offset?: number;
	count?: number;
}

export interface ICredentials {
	token: string;
	decodedToken: any;
	user: User;
}
