import {AppNames, TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import chai from 'chai';
chai.use(require("chai-as-promised"));
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";
import {FsHelper} from "../../../src/helpers/fs-helper";

describe("cmd: app.add", () => {
	describe("Bad State", () => {
		describe("Bad Calls", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				return TestHelper.initEnvironment()
					.then(()=> TestHelper.initLibUiApp());
			});
			it("errors if no packages supplied to install", ()=>{
				return expect(AppExec(AppNames.LIB_UI, "add")).to.be.rejectedWith(Error, ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if a package passed is not installed", ()=>{
				return expect(AppExec(AppNames.LIB_UI, "add", "request")).to.be.rejectedWith(Error, ErrorMessages.NOT_INSTALLED);
			});
		});
		describe("Good State", ()=>{
			describe("Adds package to roachy", ()=>{
				beforeEach(()=>{
					TestHelper.prepEnvironment();
					return TestHelper.initEnvironment()
						.then(()=> TestHelper.initLibCommonApp())
						.then(()=> TestHelper.initLibUiApp())
						.then(()=> TestHelper.initTimewatcherUiLibUiApp())
						.then(()=> TestHelper.installPackage(['request']))
				});
				it("adds pkg to root", ()=>{
					expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
					expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
					expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");
					const rootConfig = TestHelper.getRootConfig();
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI)).dependencies).to.eql({});
					return TestHelper.addPackageToApp(AppNames.LIB_UI, "request").then(()=>{
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						const rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.getPackages()).to.have.property("request");
						expect(rootConfig.getPackages().request).to.be.a("string");
						TestHelper.expectStaticVersions(rootConfig.packages);

						const appPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
						expect(appPackageJson.scripts).to.have.property("start");

					});
				});
				it("installs package and then updates an attached app with package as well", ()=>{
					expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
					expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

					expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
					expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");

					const rootConfig = TestHelper.getRootConfig();
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI)).dependencies).to.eql({});
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI)).dependencies).to.eql({});

					return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(()=>{
						return TestHelper.addPackageToApp(AppNames.LIB_UI, "request").then(()=>{
							/**
							 * Make sure no node_modules in child paths
							 */
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
							expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

							/**
							 * Make sure added package got added to app
							 */
							const rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql(["request"]);
							expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getPackages()).to.eql([]);

							/**
							 * Makes sure package.jsons got strick version of packages for all deps from attached app
							 */
							const libAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
							expect(libAppPackageJson.scripts).to.have.property("start");
							const timewatchAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, ["request"]);
							expect(timewatchAppPackageJson.scripts).to.have.property("start");

							/**
							 * Make sure package-locks are gen'd as well
							 */
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
							expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);


						});
					});


				});
				it("ensures pkgs added to nth level dep gets bubbled up to an app", ()=>{
					expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
					expect(TestHelper.ensureFileExists([TestHelper.getLibCommonPath(), "node_modules"])).to.equal(false);
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
					expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

					expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
					expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");

					const rootConfig = TestHelper.getRootConfig();
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_COMMON)).dependencies).to.eql({});
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI)).dependencies).to.eql({});
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI)).dependencies).to.eql({});

					return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(()=>{
						return TestHelper.addPackageToApp(AppNames.LIB_COMMON, "request").then(()=>{

							/**
							 * Make sure added package got added to app
							 */
							const rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getApp(AppNames.LIB_COMMON).getPackages()).to.eql(["request"]);
							expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql([]);
							expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getPackages()).to.eql([]);

							/**
							 * Makes sure package.jsons got strick version of packages for all deps from attached app
							 */
							TestHelper.expectAppPackageJsonDeps(AppNames.LIB_COMMON, ["request"]);
							TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, []);
							TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, []);

							/**
							 * Make sure package-locks are gen'd as well
							 */
							expect(TestHelper.ensureFileExists([TestHelper.getLibCommonPath(), "package-lock.json"])).to.equal(true);
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
							expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);

						});
					}).then(()=>{
						/**
						 * On attach of lib-common, it should bubble request up through all package.jsons
						 */
						return TestHelper.attachApp(AppNames.LIB_UI, AppNames.LIB_COMMON).then(()=>{
							/**
							 * Make sure added package got added to app
							 */
							const rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getApp(AppNames.LIB_COMMON).getPackages()).to.eql(["request"]);
							expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql([]);
							expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getPackages()).to.eql([]);

							/**
							 * Makes sure package.jsons got strick version of packages for all deps from attached app
							 */
							TestHelper.expectAppPackageJsonDeps(AppNames.LIB_COMMON, ["request"]);
							TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
							TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, ["request"]);

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
			describe("Installs existing package", ()=>{
				beforeEach(()=>{
					TestHelper.prepEnvironment();
					return TestHelper.initEnvironment()
						.then(()=> TestHelper.initLibUiApp())
						.then(()=> TestHelper.initTimewatcherUiLibUiApp())
						.then(()=> TestHelper.installPackage(['request@2.66.0']))
				});
				it("installs newer version and updates app", ()=>{

					let packageLockJson;
					expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
					expect(TestHelper.getRootConfigObject().packages.request).to.eql("2.66.0");

					const rootConfig = TestHelper.getRootConfig();
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.LIB_UI)).dependencies).to.eql({});
					expect(FsHelper.getAppPackageJson(rootConfig.getApp(AppNames.TIMEWATCH_UI)).dependencies).to.eql({});

					return TestHelper.addPackageToApp(AppNames.LIB_UI, "request").then(()=>{
						return TestHelper.attachApp(AppNames.TIMEWATCH_UI, AppNames.LIB_UI).then(()=>{

							/**
							 * Make sure no node_modules in child paths
							 */
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
							expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "node_modules"])).to.equal(false);

							/**
							 * Make sure added package got added to app
							 */
							const rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql(["request"]);
							expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getPackages()).to.eql([]);

							/**
							 * Makes sure package.jsons got strick version of packages for all deps from attached app
							 */
							const libAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
							expect(libAppPackageJson.scripts).to.have.property("start");
							expect(libAppPackageJson.dependencies.request).to.eql("2.66.0");
							const timewatchAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, ["request"]);
							expect(timewatchAppPackageJson.scripts).to.have.property("start");
							expect(timewatchAppPackageJson.dependencies.request).to.eql("2.66.0");

							/**
							 * Make sure package-locks are gen'd as well
							 */
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
							expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);
							packageLockJson = TestHelper.getJsonContents([TestHelper.getLibUiPath(), "package-lock.json"]);


						});
					}).then(()=>{
						return TestHelper.installPackage(['request@2.88.0']).then(()=>{

							const libAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
							expect(libAppPackageJson.dependencies.request).to.eql("2.88.0");
							const timewatchAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, ["request"]);
							expect(timewatchAppPackageJson.dependencies.request).to.eql("2.88.0");

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
	})
});