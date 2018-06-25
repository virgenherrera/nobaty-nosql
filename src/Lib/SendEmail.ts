import { URL, resolve } from 'url';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import Directories from './Directories';
import { isEmail } from './validators';

interface IMailAuth {
	user: string;
	pass: string;
}

interface IMailTransporter {
	service: string;
	host: string;
	port: number;
	auth: IMailAuth;
	logger: boolean;
	debug: boolean;
}

interface IMailOptions {
	from: string;
	subject: string;
	to: string;
	text: string;
	html: string;
}

export class SendEmail {

	private _transporter: IMailTransporter = {
		service: process.env.EMAIL_SERVICE,
		host: process.env.EMAIL_HOST,
		port: parseInt(process.env.EMAIL_PORT, 10),
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		logger: (process.env.NODE_ENV === 'development') ? true : false,
		debug: (process.env.NODE_ENV === 'development') ? true : false
	};
	private _mailOptions: IMailOptions = {
		from: process.env.EMAIL_SERVICE,
		subject: null,
		to: null,
		text: null,
		html: null,
	};
	private _emailTemplate: string = null;
	private _webHookPath: string = null;
	private _webHookGetParams: object = {};
	private emailRenderData: any = {};

	constructor(params: any) {
		const {
			service = null,
			host = null,
			port = null,
			authUserService = null,
			authPassService = null,
			logger = null,
			debug = null,
			sender = null,
			receiver = null,
			subject = null,
			text = null,
			emailTemplate = null,
			webHookPath = null,
			webHookGetParams = {},
			data = {},
		} = params;

		if (!emailTemplate) {
			throw { type: 500, msg: 'impossible to send email without a template' };
		} else if (!Directories.fileExists('emailTemplatesPath', emailTemplate)) {
			throw { type: 500, msg: 'impossible to send email to an non-existent template' };
		}

		if (service) { this.service = service; }
		if (host) { this.host = host; }
		if (port) { this.port = port; }
		if (authUserService) { this.authUserService = authUserService; }
		if (authPassService) { this.authPassService = authPassService; }
		if (logger) { this.logger = logger; }
		if (debug) { this.debug = debug; }
		if (sender) { this.sender = sender; }
		if (receiver) { this.receiver = receiver; }
		if (subject) { this.subject = subject; }
		if (text) { this.text = text; }
		if (emailTemplate) { this.emailTemplate = emailTemplate; }
		if (webHookPath) { this.webHookPath = webHookPath; }
		if (webHookGetParams) { this.webHookGetParams = webHookGetParams; }
		if (data) { this.emailRenderData = data; }

		switch (emailTemplate) {
			case 'forgotPass.html':
				this.prepareForgotEmailContent();
				break;

			default:
				this.prepareEmailContent();
				break;
		}
	}

	public static async SendEmail(params: any = {}): Promise<any> {
		const thisObject = new SendEmail(params);

		return await thisObject.send();
	}

	set service(v: string) {
		this._transporter.service = (v) ? v : this._transporter.service;
	}
	get service(): string {
		return this._transporter.service;
	}

	set host(v: string) {
		this._transporter.host = (v) ? v : this._transporter.host;
	}
	get host(): string {
		return this._transporter.host;
	}

	set port(v: number) {
		this._transporter.port = (v) ? v : this._transporter.port;
	}
	get port(): number {
		return this._transporter.port;
	}

	set authUserService(v: string) {
		this._transporter.auth.user = (v) ? v : this._transporter.auth.user;
	}
	get authUserService(): string {
		return this._transporter.auth.user;
	}

	set authPassService(v: string) {
		this._transporter.auth.pass = (v) ? v : this._transporter.auth.pass;
	}
	get authPassService(): string {
		return this._transporter.auth.pass;
	}

	set logger(v: boolean) {
		this._transporter.logger = (v) ? true : false;
	}
	get logger(): boolean {
		return this._transporter.logger;
	}

	set debug(v: boolean) {
		this._transporter.debug = (v) ? true : false;
	}
	get debug(): boolean {
		return this._transporter.debug;
	}

	set sender(v: string) {
		this._mailOptions.from = (isEmail(v)) ? v : this._mailOptions.from;
	}
	get sender(): string {
		return this._mailOptions.from;
	}

	set receiver(v: string) {
		this._mailOptions.to = (isEmail(v)) ? v : null;
	}
	get receiver(): string {
		return this._mailOptions.to;
	}

	set subject(v: string) {
		this._mailOptions.subject = (v) ? v : this._mailOptions.subject;
	}
	get subject(): string {
		return this._mailOptions.subject;
	}

	set text(v: string) {
		this._mailOptions.text = (v) ? v : null;
	}
	get text(): string {
		return this._mailOptions.text;
	}

	set html(v: string) {
		this._mailOptions.html = (v) ? v : null;
	}
	get html(): string {
		return this._mailOptions.html;
	}

	set webHookPath(v: string | null) {
		this._webHookPath = (v) ? v : null;
	}
	get webHookPath(): string | null {
		return this._webHookPath;
	}

	set webHookGetParams(params: object) {
		const data = {};

		for (const k in params) {
			if (params.hasOwnProperty(k)) {
				data[k] = params[k];
			}
		}

		this._webHookGetParams = data;
	}
	get webHookGetParams(): object {
		return this._webHookGetParams;
	}

	set emailTemplate(v: string) {
		const templatePath = Directories.getPathToFileIfExists('emailTemplatesPath', v);

		if (!templatePath) {
			throw { type: 500, msg: `Email template path: '${v}' does not exists.` };
		} else {
			this._emailTemplate = v;
		}
	}
	get emailTemplate(): string {
		return this._emailTemplate;
	}

	get sawappyWebDomain(): string {
		const { SAWAPPY_WEB_URL } = process.env;
		return SAWAPPY_WEB_URL;
	}

	private templateLoader() {
		const emailTemplatePath = Directories.getPathToFile('emailTemplatesPath', this.emailTemplate);
		return readFileSync(emailTemplatePath, 'utf-8').toString();
	}

	private buildWebHookLink() {
		const url = resolve(this.sawappyWebDomain, this.webHookPath);
		const hookUri = new URL(url);

		for (const k in this.webHookGetParams) {
			if (this.webHookGetParams.hasOwnProperty(k)) {
				hookUri.searchParams.append(k, this.webHookGetParams[k]);
			}
		}

		return hookUri.href;
	}

	public prepareEmailContent(): void {
		const sawappyDomainRegex = new RegExp('{{sawappyDomain}}', 'g');
		let emailStr = this.templateLoader().replace(sawappyDomainRegex, this.sawappyWebDomain);

		for (const k in this.emailRenderData) {
			if (this.emailRenderData.hasOwnProperty(k)) {
				const regEx = new RegExp(`{{${k}}}`, 'g');
				emailStr = emailStr.replace(regEx, this.emailRenderData[k]);
			}
		}

		this.html = emailStr;
	}


	public send() {
		return new Promise((Resolve, Reject) => {
			const transporter = nodemailer.createTransport(this._transporter);

			// send mail with defined transport object
			return transporter.sendMail(this._mailOptions, (error, info) => {
				return (error) ? Reject({ error, info }) : Resolve({ error, info });
			});
		});
	}
}
