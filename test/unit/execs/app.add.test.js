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
			describe("Bad State", () => {
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
						return expect(AppExec(AppNames.LIB_UI, addType.cmd, "request")).to.be.rejectedWith(Error, ErrorMessages.NOT_INSTALLED);
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
							expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
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

								const appPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["request"]);
								expect(appPackageJson.scripts).to.have.property("start");

							});
						});
						it("installs package and then updates an attached app with package as well", () => {
							expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
							expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

							expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
							expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");

							const rootConfig = TestHelper.getRootConfig();
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI))[addType.depType]).to.eql({});

							return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(() => {
								return addType.addCall(AppNames.LIB_UI, "request").then(() => {
									/**
									 * Make sure no node_modules in child paths
									 */
									expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
									expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

									/**
									 * Make sure added package got added to app
									 */
									const rootConfig = TestHelper.getRootConfig();
									expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql(["request"]);
									expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

									/**
									 * Makes sure package.jsons got strick version of packages for all deps from attached app
									 */
									const libAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["request"]);
									expect(libAppPackageJson.scripts).to.have.property("start");
									const timewatchAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["request"]);
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

							expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
							expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");

							const rootConfig = TestHelper.getRootConfig();
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_COMMON))[addType.depType]).to.eql({});
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI))[addType.depType]).to.eql({});

							return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(() => {
								return addType.addCall(AppNames.LIB_COMMON, "request").then(() => {

									/**
									 * Make sure added package got added to app
									 */
									const rootConfig = TestHelper.getRootConfig();
									expect(rootConfig.getApp(AppNames.LIB_COMMON).getConfig()[addType.packageType]).to.eql(["request"]);
									expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql([]);
									expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

									/**
									 * Makes sure package.jsons got strick version of packages for all deps from attached app
									 */
									addType.expectPackageJsonDepsCall(AppNames.LIB_COMMON, ["request"]);
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
									expect(rootConfig.getApp(AppNames.LIB_COMMON).getConfig()[addType.packageType]).to.eql(["request"]);
									expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql([]);
									expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

									/**
									 * Makes sure package.jsons got strick version of packages for all deps from attached app
									 */
									addType.expectPackageJsonDepsCall(AppNames.LIB_COMMON, ["request"]);
									addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["request"]);
									addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["request"]);

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
								.then(() => TestHelper.installPackage(['request@2.66.0']))
						});
						it("installs newer version and updates app", () => {

							let packageLockJson;
							expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
							expect(TestHelper.getRootConfigObject().packages.request).to.eql("2.66.0");

							const rootConfig = TestHelper.getRootConfig();
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI))[addType.depType]).to.eql({});
							expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI))[addType.depType]).to.eql({});

							return addType.addCall(AppNames.LIB_UI, "request").then(() => {
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
									expect(rootConfig.getApp(AppNames.LIB_UI).getConfig()[addType.packageType]).to.eql(["request"]);
									expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getConfig()[addType.packageType]).to.eql([]);

									/**
									 * Makes sure package.jsons got strick version of packages for all deps from attached app
									 */
									const libAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["request"]);
									expect(libAppPackageJson.scripts).to.have.property("start");
									expect(libAppPackageJson[addType.depType].request).to.eql("2.66.0");
									const timewatchAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["request"]);
									expect(timewatchAppPackageJson.scripts).to.have.property("start");
									expect(timewatchAppPackageJson[addType.depType].request).to.eql("2.66.0");

									/**
									 * Make sure package-locks are gen'd as well
									 */
									expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
									expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);
									packageLockJson = TestHelper.getJsonContents([TestHelper.getLibUiPath(), "package-lock.json"]);


								});
							}).then(() => {
								return TestHelper.installPackage(['request@2.88.0']).then(() => {

									const libAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.LIB_UI, ["request"]);
									expect(libAppPackageJson[addType.depType].request).to.eql("2.88.0");
									const timewatchAppPackageJson = addType.expectPackageJsonDepsCall(AppNames.TIMEWATCH_UI, ["request"]);
									expect(timewatchAppPackageJson[addType.depType].request).to.eql("2.88.0");

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
});