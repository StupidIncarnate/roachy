import {AppNames, TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import chai from 'chai';
chai.use(require("chai-as-promised"));
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";
import {FsHelper} from "../../../src/helpers/fs-helper";
import {PACKAGE_TYPES} from "../../../src/models/root-app-config.model";

describe("cmd: app.remove/remove-dev", () => {
	const addTypes = [
		{
			cmd: "remove",
			packageType: PACKAGE_TYPES.PACKAGES,
			depType: "dependencies",
			addCall: (...args)=> TestHelper.addPackageToApp(...args),
			removeCall: (...args)=> TestHelper.removePackageToApp(...args),
			expectPackageJsonDepsCall: (...args)=> TestHelper.expectAppPackageJsonDeps(...args)
		},
		{
			cmd: "remove-dev",
			packageType: PACKAGE_TYPES.DEV_PACKAGES,
			depType: "devDependencies",
			addCall: (...args)=> TestHelper.addDevPackageToApp(...args),
			removeCall: (...args)=> TestHelper.removeDevPackageToApp(...args),
			expectPackageJsonDepsCall: (...args)=> TestHelper.expectAppPackageJsonDevDeps(...args)
		}
	];
	addTypes.forEach(addType => {
		describe(`AddType: ${addType.cmd}`, ()=>{
			describe("Bad Calls", () => {
				beforeEach(() => {
					TestHelper.prepEnvironment();
					return TestHelper.initEnvironment()
						.then(() => TestHelper.initLibUiApp());
				});
				it("errors if no packages supplied to install", () => {
					return expect(AppExec(AppNames.LIB_UI, addType.cmd)).to.be.rejectedWith(Error, ErrorMessages.PACKAGES_REQUIRED);
				});
			});
			describe("Good State", () => {
				describe("Adds package to roachy", () => {
					beforeEach(() => {
						TestHelper.prepEnvironment();
						return TestHelper.initEnvironment()
							.then(() => TestHelper.initLibCommonApp())
							.then(() => TestHelper.initLibUiApp())
							.then(() => TestHelper.initTimewatcherUiLibUiApp())
							.then(() => TestHelper.installPackage(['request']))
					});
					it("adds pkg to root", () => {
						expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
						expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");

						const rootConfig = TestHelper.getRootConfig();
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
						return addType.addCall(AppNames.LIB_UI, "request").then(() => {
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
							const rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getPackages()).to.have.property("request");
							expect(rootConfig.getPackages().request).to.be.a("string");
							TestHelper.expectStaticVersions(rootConfig.packages);

							expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql(["request"]);
							addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["request"]);

						}).then(()=>{
							return addType.removeCall(AppNames.LIB_UI, "request").then(() => {
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
								const rootConfig = TestHelper.getRootConfig();
								expect(rootConfig.getPackages()).to.have.property("request");
								expect(rootConfig.getPackages().request).to.be.a("string");
								TestHelper.expectStaticVersions(rootConfig.packages);

								addType.expectPackageJsonDepsCall(AppNames.LIB_UI, []);
								expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql([]);


							})
						});
					});
				});
			});
		});
	});
});
