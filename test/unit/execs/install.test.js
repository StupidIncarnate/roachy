import {TestHelper} from "../../helpers/test-helper";
import {expect} from 'chai';
import chai from 'chai';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import {ErrorMessages} from "../../../src/error-messages";
import {REF} from "../../../src/config";
import {RootConfigHelper} from "../../../src/helpers/root-config-helper";
import {InstallExec} from "../../../src/exec/install-exec";
import {PackageHelper} from "../../../src/helpers/package-helper";

describe.only("cmd: install", () => {
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
				TestHelper.initLibUiApp();
			});
			it("errors if nothing passed", () => {
				expect(() => InstallExec([])).to.throw(ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if package one package is not recognized", ()=>{
				return expect(InstallExec(["jksdhkds"])).to.be.rejectedWith(Error, ErrorMessages.UNKNOWN_PACKAGE);
			});
			it("errors when one package is not valid",()=>{
				const rootConfig = TestHelper.getRootConfig();
				expect(RootConfigHelper.getPackages(rootConfig)).to.eql({});
				return expect(InstallExec(["request","jksdhkds"])).to.be.rejected
					.then(err =>{
						expect(err).to.be.an.instanceOf(Error, ErrorMessages.UNKNOWN_PACKAGE);
						const rootConfig = TestHelper.getRootConfig();
						expect(Object.keys(RootConfigHelper.getPackages(rootConfig))).to.eql([]);
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
				expect(RootConfigHelper.getPackages(rootConfig)).to.eql({});
				return InstallExec(["request","npm-package-arg"])
					.then(data =>{
						const rootConfig = TestHelper.getRootConfig();
						expect(Object.keys(RootConfigHelper.getPackages(rootConfig))).to.eql(["npm-package-arg", "request"]);
						const rootPackage = TestHelper.getRootPackage();
						expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql(["moment", "npm-package-arg", "request"]);

					});
			});

		});
	});
});