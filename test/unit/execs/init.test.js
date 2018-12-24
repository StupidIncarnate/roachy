import {TestHelper} from "../../helpers/test-helper";
const expect = require('chai').expect;

import {InitExec} from "../../../src/exec/init-exec";
import {NpmExecHelper} from "../../../src/helpers/npm-exec-helper";
import {PackageHelper} from "../../../src/helpers/package-helper";

describe("cmd: init", ()=>{
	beforeEach(()=> {
		TestHelper.prepEnvironment();
	});
	it("creates init folder", ()=>{
		return InitExec().then(()=>{
			expect(TestHelper.ensureFileExists("roachy.config.json"), "Expect config.json").to.be.true;
			const configJson = TestHelper.getJsonContents("roachy.config.json");
			expect(configJson).to.have.property("version", 0.1);
			expect(configJson).to.have.property("apps").and.to.be.an("object");
			expect(configJson).to.have.property("packages").and.to.be.an("object");
		});
	});
	it("creates package.json if one doesn't exist", ()=>{
		TestHelper.deletePath(["package.json"]);
		expect(TestHelper.ensureFileExists(["package.json"])).to.equal(false);
		return InitExec().then(()=>{
			expect(TestHelper.ensureFileExists(["package.json"])).to.equal(true);
			expect(TestHelper.ensureFileExists("roachy.config.json"), "Expect config.json").to.be.true;
			const configJson = TestHelper.getJsonContents("roachy.config.json");
			expect(configJson).to.have.property("version", 0.1);
			expect(configJson).to.have.property("apps").and.to.be.an("object");
			expect(configJson).to.have.property("packages").and.to.be.an("object");
		});
	});
	it("registers any installed packages on init", ()=>{
		return NpmExecHelper.install(["chai"]).then(()=>{
			let rootPackageJson = TestHelper.getRootPackage();
			expect(PackageHelper.getInstalled(rootPackageJson)).to.have.property("chai");
			expect(PackageHelper.getDevInstalled(rootPackageJson)).to.have.property("moment");

			return InitExec().then(()=>{
				let rootPackageJson = TestHelper.getRootPackage();
				expect(PackageHelper.getDevInstalled(rootPackageJson)).to.have.property("chai");
				expect(PackageHelper.getDevInstalled(rootPackageJson)).to.have.property("moment");

				expect(PackageHelper.getInstalled(rootPackageJson)).to.eql({});
				let rootConfig = TestHelper.getRootConfig();
				expect(Object.keys(rootConfig.getPackages())).to.eql([
					"chai",
					"moment"
				]);

				TestHelper.expectStaticVersions(rootConfig.getPackages());
			});
		});
	});
});