import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";
import {RootConfigHelper} from "../../helpers/root-config-helper";
import {NpmExecHelper} from "../../helpers/npm-exec-helper";

export const InstallExec = (packages) => {
	/**
	 * Args can be any number of apps and packages
	 */
	packages = packages || [];

	const rootConfig = FsHelper.getRootConfig();
	const registeredApps = RootConfigHelper.getAppNames(rootConfig);

	if(packages.length === 0) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED);
	}

	FsHelper.ensureRootPath();

	return NpmExecHelper.install(packages);
};