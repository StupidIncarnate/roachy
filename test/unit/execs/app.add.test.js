import {TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";

describe("cmd: app.add", () => {
	describe("Bad State", () => {
		describe("Bad Calls", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
				TestHelper.initLibUiApp();
			});
			it("errors if no packages supplied to install", ()=>{
				expect(()=>AppExec("lib-ui", "add")).to.throw(ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if a package passed is not installed", ()=>{
				expect(()=>AppExec("lib-ui", "add", "request")).to.throw(ErrorMessages.NOT_INSTALLED);
			});
		});
		describe("Good State", ()=>{
			describe("Installs non-existent package", ()=>{
				beforeEach(()=>{
					TestHelper.prepEnvironment();
					TestHelper.initEnvironment();
					TestHelper.initLibUiApp();
				});
				it("installs package to root and then adds to app", ()=>{
					expect(TestHelper.ensureFileExists("node_modules")).to.equal(false);
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);

					expect(TestHelper.getRootConfig().packages).to.eql({});
					return AppExec("lib-ui", "install", "request").then(()=>{
						expect(TestHelper.ensureFileExists(["node_modules", "request"])).to.equal(true);
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						const rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.packages).to.have.property("request");
						expect(rootConfig.packages.request).to.be.a("string");
					});
				});
				it("installs package and then updates an attached app with package as well", ()=>{

				});
				it("ensures to update the package.json of an app indirectly attached view parent", ()=>{

				});
			});
			describe("Installs existing package", ()=>{
				it("adds installed package to app", ()=>{

				});
				it("installs newer version and updates app", ()=>{

				});
			});
		});
	})
});