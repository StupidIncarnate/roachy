import {AppNames, TestHelper} from "../../helpers/test-helper";
import {expect} from 'chai';
import chai from 'chai';
chai.use(require("chai-string"));
import {ErrorMessages} from "../../../src/error-messages";
import {AddExec} from "../../../src/exec/add-exec";
import {FsHelper} from "../../../src/helpers/fs-helper";
import {NpmExecHelper} from "../../../src/helpers/npm-exec-helper";

describe("cmd: add", () => {
	describe("Bad State", () => {
		describe("Not Init Yet", ()=> {
			beforeEach(()=> {
				TestHelper.prepEnvironment();
			});
			it("errors if not init'd", () => {
				expect(()=> AddExec()).to.throw(ErrorMessages.ROOT_NOT_INIT);
			});
		});
		describe("After Init", ()=> {
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("errors if appName not passed", () => {
				expect(() => AddExec()).to.throw(ErrorMessages.APP_NAME_REQUIRED);
			});
			it("errors if location not passed", ()=>{
				expect(() => AddExec("app-name")).to.throw(ErrorMessages.APP_LOCATION_REQUIRED);
			});
			it("errors if location does not exist", ()=>{
				expect(() => AddExec("app-name", "app-loc")).to.throw(ErrorMessages.APP_LOCATION_INVALID);
				expect(() => AddExec("app-name", "src/app-loc")).to.throw(ErrorMessages.APP_LOCATION_INVALID);
			});
			it("errors if app name has capitals", ()=>{
				expect(() => AddExec("appName","src/app-loc")).to.throw(ErrorMessages.APP_NAME_INVALID);
			});
			it("errors if app name has space", ()=>{
				expect(() => AddExec("app name", "src/app-loc")).to.throw(ErrorMessages.APP_NAME_INVALID);
			});
		});

	});
	describe("Good State", () => {
		describe("Basic Add", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("adds an app to config", ()=>{
				const appName = "lib-ui";
				const appLoc = "src/lib/lib-ui";
				return AddExec(appName, appLoc).then(()=>{
					expect(TestHelper.getRootConfigObject()).to.have.property("apps").and.to.eql({
						[appName]: {
							path: appLoc,
							attachedApps: [],
							packages: [],
							devPackages: []
						}
					});
				});
			});
		});
		describe("Without package.json", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("adds app and adds package.json", ()=>{

				/**
				 * Clear out package.json
				 */
				TestHelper.deletePath([TestHelper.getLibUiPath(), "package.json"]);
				expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package.json"])).to.equal(false);

				/**
				 * Run add command
				 */
				return AddExec("lib-ui", TestHelper.getLibUiPath()).then(()=>{
					/**
					 * Check that package.json was added
					 */
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package.json"])).to.equal(true);
					const pkgJson = FsHelper.openPackageJson(TestHelper.formatPath(TestHelper.getLibUiPath()));
					expect(pkgJson).to.have.property("name");
				});

			});
		});
		describe("With package.json", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			afterEach(()=>{
				FsHelper.changeCwd(TestHelper.getTestArea());
			});
			it("Fails: if package version collides with something already installed", ()=>{
				return TestHelper.installPackage(['request@2.66.0']).then(()=>{
					FsHelper.changeCwd(TestHelper.getLibUiPath());
					return NpmExecHelper.install(["request"]).then(()=>{
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(true);
						let pkgJson = FsHelper.openPackageJson(TestHelper.formatPath(TestHelper.getLibUiPath()));
						expect(pkgJson.dependencies).to.have.property("request");
						expect(pkgJson.dependencies.request).to.startsWith("^");

						let rootPkgJson = FsHelper.openPackageJson(TestHelper.formatPath());
						expect(rootPkgJson.devDependencies).to.have.property("request");
						expect(rootPkgJson.devDependencies.request).to.startsWith("^");

						return expect(AddExec("lib-ui", TestHelper.getLibUiPath())).to.be.rejectedWith(Error, ErrorMessages.APP_ROOT_VERSION_MISMATCH);
					});
				});
			});
			it("adds app, adds packages to root, deletes node_modules", ()=>{
				FsHelper.changeCwd(TestHelper.getLibUiPath());
				return NpmExecHelper.install(["request"]).then(()=>{
					return NpmExecHelper.install(["chai"], true).then(()=> {
						/**
						 * Ensure node_modules and package.json has what it needs
						 */
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(true);
						let pkgJson = FsHelper.openPackageJson(TestHelper.formatPath(TestHelper.getLibUiPath()));
						expect(pkgJson.dependencies).to.have.property("request");
						expect(pkgJson.dependencies.request).to.startsWith("^");

						expect(pkgJson.devDependencies).to.have.property("chai");
						expect(pkgJson.devDependencies.chai).to.startsWith("^");

						/**
						 * Ensure root is proper
						 */
						let rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.getAppNames()).to.eql([]);
						expect(rootConfig.getPackages()).to.eql({});

						return AddExec("lib-ui", TestHelper.getLibUiPath()).then(() => {
							/**
							 * Ensure app state got changed properly
							 */
							expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
							pkgJson = FsHelper.openPackageJson(TestHelper.formatPath(TestHelper.getLibUiPath()));
							expect(pkgJson.dependencies).to.have.property("request");
							expect(pkgJson.dependencies.request).to.not.startsWith("^");

							expect(pkgJson.devDependencies).to.have.property("chai");
							expect(pkgJson.devDependencies.chai).to.not.startsWith("^");

							/**
							 * Ensure root packagejson install packages
							 */
							pkgJson = FsHelper.openPackageJson(TestHelper.formatPath());
							expect(pkgJson.devDependencies).to.have.property("request");
							expect(pkgJson.devDependencies.request).to.startsWith("^");

							expect(pkgJson.devDependencies).to.have.property("chai");
							expect(pkgJson.devDependencies.chai).to.startsWith("^");


							/**
							 * Ensure root state got changed properly
							 */
							rootConfig = TestHelper.getRootConfig();
							expect(rootConfig.getAppNames()).to.eql(["lib-ui"]);
							expect(rootConfig.getPackages()).to.have.property("request");
							expect(rootConfig.getPackages()).to.have.property("chai");

							const appConfig = rootConfig.getApp("lib-ui");
							expect(appConfig.getPackages()).to.eql(["request"]);
							expect(appConfig.getDevPackages()).to.eql(["chai"]);
						});
					});
				});
			});
		});
	});
});