/*
* ---------------------------------------------------
* Config Routes file
* ---------------------------------------------------
*	-	This file lets you define what handlers this application are using
*
* ---------------------------------------------------
*	Notice:
* ---------------------------------------------------
*	-	Every handler included here must to implement one of these
*	-	"iHandler" or "iRestHandler" Interfaces
*/

export { default as rendered_main } from '../Handler/Rendered/main';
export { default as rendered_login } from '../Handler/Rendered/login';
export { default as rendered_logout } from '../Handler/Rendered/logout';
export { default as api_user } from '../Handler/Restful/user';
export { default as api_login } from '../Handler/Restful/login';
