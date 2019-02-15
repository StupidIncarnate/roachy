import {AppNames, TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import chai from 'chai';
chai.use(require("chai-as-promised"));
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";
import {FsHelper} from "../../../src/helpers/fs-helper";
import {PACKAGE_TYPES} from "../../../src/models/root-app-config.model";

describe("cmd: app.add/add-dev", () => {
	const addTypes = [
		{
			cmd: "add",
			packageType: PACKAGE_TYPES.PACKAGES,
			depType: "dependencies",
			addCall: (...args)=> TestHelper.addPackageToApp(...args),
			expectPackageJsonDepsCall: (...args)=> TestHelper.expectAppPackageJsonDeps(...args)
		},
		{
			cmd: "add-dev",
			packageType: PACKAGE_TYPES.DEV_PACKAGES,
			depType: "devDependencies",
			addCall: (...args)=> TestHelper.addDevPackageToApp(...args),
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
				it("errors if a package passed is not installed", () => {
					return expect(AppExec(AppNames.LIB_UI, addType.cmd, "roachy-stub")).to.be.rejectedWith(Error, ErrorMessages.NOT_INSTALLED);
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
							.then(() => TestHelper.installPackage(['roachy-stub']))
					});
					it("adds pkg to root", () => {
						expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						expect(TestHelper.getRootConfigObject().packages).eql({"roachy-stub": "0.0.3"});
						const rootConfig = TestHelper.getRootConfig();
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
						return addType.addCall(AppNames.LIB_UI, "roachy-stub").then(() => {
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
							const rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getPackages()).to.eql({"roachy-stub": "0.0.3"});

							const appPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["roachy-stub"]);
							expect(appPackageJson.scripts).to.have.property("start");

						});
					});
					it("installs package and then updates an attached app with package as well", () => {
						expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

						expect(TestHelper.getRootConfigObject().packages).to.eql({"roachy-stub": "0.0.3"});

						const rootConfig = TestHelper.getRootConfig();
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI))[addType.depType]).to.eql({});

						return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(() => {
							return addType.addCall(AppNames.LIB_UI, "roachy-stub").then(() => {
								/**
								 * Make sure no node_modules in child paths
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

								/**
								 * Make sure added package got added to app
								 */
								const rootConfig = TestHelper.getRootConfig();
								expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql(["roachy-stub"]);
								expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

								/**
								 * Makes sure package.jsons got strick version of packages for all deps from attached app
								 */
								const libAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["roachy-stub"]);
								expect(libAppPackageJson.scripts).to.have.property("start");
								const timewatchAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["roachy-stub"]);
								expect(timewatchAppPackageJson.scripts).to.have.property("start");

								/**
								 * Make sure package-locks are gen'd as well
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);


							});
						});


					});
					it("ensures pkgs added to nth level dep gets bubbled up to an app", () => {
						expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
						expect(TestHelper.ensureFileExists([TestHelper.getLibCommonPath(), "node_modules"])).to.equal(false);
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

						expect(TestHelper.getRootConfigObject().packages).to.eql({"roachy-stub": "0.0.3"});

						const rootConfig = TestHelper.getRootConfig();
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_COMMON))[addType.depType]).to.eql({});
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI))[addType.depType]).to.eql({});

						return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(() => {
							return addType.addCall(AppNames.LIB_COMMON, "roachy-stub").then(() => {

								/**
								 * Make sure added package got added to app
								 */
								const rootConfig = TestHelper.getRootConfig();
								expect(rootConfig.getApp(AppNames.LIB_COMMON).getConfig()[addType.packageType]).to.eql(["roachy-stub"]);
								expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql([]);
								expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

								/**
								 * Makes sure package.jsons got strick version of packages for all deps from attached app
								 */
								addType.expectPackageJsonDepsCall(AppNames.LIB_COMMON, ["roachy-stub"]);
								addType.expectPackageJsonDepsCall(AppNames.LIB_UI, []);
								addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, []);

								/**
								 * Make sure package-locks are gen'd as well
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibCommonPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);

							});
						}).then(() => {
							/**
							 * On attach of lib-common, it should bubble request up through all package.jsons
							 */
							return TestHelper.attachApp(AppNames.LIB_UI, AppNames.LIB_COMMON).then(() => {
								/**
								 * Make sure added package got added to app
								 */
								const rootConfig = TestHelper.getRootConfig();
								expect(rootConfig.getApp(AppNames.LIB_COMMON).getConfig()[addType.packageType]).to.eql(["roachy-stub"]);
								expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql([]);
								expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

								/**
								 * Makes sure package.jsons got strick version of packages for all deps from attached app
								 */
								addType.expectPackageJsonDepsCall(AppNames.LIB_COMMON, ["roachy-stub"]);
								addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["roachy-stub"]);
								addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["roachy-stub"]);

								/**
								 * Make sure package-locks are gen'd as well
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibCommonPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);
							});
						});
					});
				});
				describe("Installs existing package", () => {
					beforeEach(() => {
						TestHelper.prepEnvironment();
						return TestHelper.initEnvironment()
							.then(() => TestHelper.initLibUiApp())
							.then(() => TestHelper.initTimewatcherUiLibUiApp())
							.then(() => TestHelper.installPackage(['roachy-stub@0.0.1']))
					});
					it("installs newer version and updates app", () => {

						let packageLockJson;
						expect(TestHelper.getRootConfigObject().packages).to.eql({"roachy-stub": "0.0.1"});

						const rootConfig = TestHelper.getRootConfig();
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
						expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI))[addType.depType]).to.eql({});

						return addType.addCall(AppNames.LIB_UI, "roachy-stub").then(() => {
							return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(() => {

								/**
								 * Make sure no node_modules in child paths
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

								/**
								 * Make sure added package got added to app
								 */
								const rootConfig = TestHelper.getRootConfig();
								expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql(["roachy-stub"]);
								expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

								/**
								 * Makes sure package.jsons got strick version of packages for all deps from attached app
								 */
								const libAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["roachy-stub"]);
								expect(libAppPackageJson.scripts).to.have.property("start");
								expect(libAppPackageJson[addType.depType]).to.eql({"roachy-stub": "0.0.1"});
								const timewatchAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["roachy-stub"]);
								expect(timewatchAppPackageJson[addType.depType]).to.eql({"roachy-stub": "0.0.1"});

								/**
								 * Make sure package-locks are gen'd as well
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);
								packageLockJson = TestHelper.getJsonContents([TestHelper.getLibUiPath(), "package-lock.json"]);


							});
						}).then(() => {
							return TestHelper.installPackage(['roachy-stub@0.0.2']).then(() => {

								const libAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["roachy-stub"]);
								expect(libAppPackageJson[addType.depType]).to.eql({"roachy-stub": "0.0.2"});
								const timewatchAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["roachy-stub"]);
								expect(timewatchAppPackageJson[addType.depType]).to.eql({"roachy-stub": "0.0.2"});

								/**
								 * Make sure package-locks are gen'd as well
								 */
								expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);
								expect(TestHelper.getJsonContents([TestHelper.getLibUiPath(), "package-lock.json"])).to.not.eql(packageLockJson);

							})
						});

					});
				});
			});
		});
	});

});