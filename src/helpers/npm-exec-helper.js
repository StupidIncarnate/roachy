import {ErrorMessages} from "../error-messages";
import npa from 'npm-package-arg';

const exec = require('child_process').execSync;

export const NpmExecHelper = {
	exec(cmd) {
		return new Promise((resolve, reject)=>{
			try {
				const result = exec(cmd).toString();
				resolve(result);
			} catch(error) {
				reject(error.message);
			}
		});
	},
	install(packages) {
		return NpmExecHelper.exec(`npm install ${packages.join(" ")}`).then(msg => {
			return true;
		}).catch(e =>{

			switch(true) {
				case e.indexOf("E404") > -1:
					throw new Error(ErrorMessages.UNKNOWN_PACKAGE);
					break;
				default:
					throw new Error(ErrorMessages.UNKNOWN_NPM_ERROR);
			}
		});
	}
};