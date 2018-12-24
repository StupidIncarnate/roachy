import {TestHelper} from "../../helpers/test-helper";
import {expect} from 'chai';
import chai from 'chai';
chai.use(require("chai-as-promised"));

import {ErrorMessages} from "../../../src/error-messages";
import {InstallExec} from "../../../src/exec/install-exec";
import {PackageHelper} from "../../../src/helpers/package-helper";

describe("cmd: install", () => {
	describe("Bad State", () => {
		describe("Not Init Yet", ()=> {
			beforeEach(()=> {
				TestHelper.prepEnvironment();
			});
			it("errors if not init'd", () => {
				expect(()=> InstallExec()).to.throw(ErrorMessages.ROOT_NOT_INIT);
			});
		});
		describe("After Init", ()=> {
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
				return TestHelper.initLibUiApp();
			});
			it("errors if nothing passed", () => {
				expect(() => InstallExec([])).to.throw(ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if package one package is not recognized", ()=>{
				return expect(InstallExec(["jksdhkds"])).to.be.rejectedWith(Error, ErrorMessages.UNKNOWN_PACKAGE);
			});
			it("errors when one package is not valid",()=>{
				const rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getPackages()).to.eql({});
				return expect(InstallExec(["request","jksdhkds"])).to.be.rejected
					.then(err =>{
						expect(err).to.be.an.instanceOf(Error, ErrorMessages.UNKNOWN_PACKAGE);
						const rootConfig = TestHelper.getRootConfig();
						expect(Object.keys(rootConfig.getPackages())).to.eql([]);
					});
			});
		});

	});
	describe("Good State", () => {
		describe("General", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("installs multiple packages", ()=>{
				const rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getPackages()).to.eql({});
				return InstallExec(["request","npm-package-arg"])
					.then(data =>{
						const rootConfig = TestHelper.getRootConfig();
						expect(Object.keys(rootConfig.getPackages())).to.eql(["npm-package-arg", "request"]);
						TestHelper.expectStaticVersions(rootConfig.getPackages());

						const rootPackage = TestHelper.getRootPackage();
						expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql(["moment", "npm-package-arg", "request"]);

					});
			});

		});
	});
});