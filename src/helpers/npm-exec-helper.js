import {ErrorMessages} from "../error-messages";
import {FsHelper} from "./fs-helper";
import path from 'path';

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
	install(packages, asDev) {

		let cmd = `npm install ${asDev ? '--save-dev' : ''} `;
		if(packages) {
			cmd +=  packages.join(" ");
		}
		return NpmExecHelper.exec(cmd).then(msg => {
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
	},
	uninstall(packages, asDev) {
		const cmd = `npm uninstall ${asDev ? '--save-dev' : ''} ${packages.join(" ")}`;
		return NpmExecHelper.exec(cmd).then(msg => {
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
	},
	getInstalledVersion(pkgName, includePath) {
		return Promise.resolve().then(()=> {

			/**
			 * So we can ensure we're pulling proper versions
			 */

			try {
				const openPath = includePath
					? path.join(includePath, "node_modules", pkgName)
					: path.join("node_modules", pkgName);

				const pkgJson = FsHelper.openPackageJson(openPath);
				return pkgJson.version;
			} catch(e){
				throw e;
			}
		});
	},
	writePackageLock() {
		const cmd = `npm install --package-lock-only`;
		return NpmExecHelper.exec(cmd).catch(e =>{
			throw new Error(ErrorMessages.UNKNOWN_NPM_ERROR);
		});
	},
	ensureNodeModules(locPath) {
		/**
		 * This wont make a node modules if no packages exist but thats fine because this is only
		 * called when pulling package versions
		 */
		return Promise.resolve().then(()=>{
			if(FsHelper.exists([locPath, "node_modules"])) {
				return true;
			}

			const cwd = FsHelper.cwd();
			FsHelper.changeCwd(FsHelper.getPath(locPath));
			return this.exec('npm install').then(()=>{
				FsHelper.changeCwd(cwd);
			});


		})
	}

};