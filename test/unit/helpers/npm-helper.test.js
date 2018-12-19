import path from 'path';
import {expect} from 'chai';
import chai from 'chai';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
import {TestHelper} from "../../helpers/test-helper";
import {ErrorMessages} from "../../../src/error-messages";
import {NpmExecHelper} from "../../../src/helpers/npm-exec-helper";
import {FsHelper} from "../../../src/helpers/fs-helper";
import {PackageHelper} from "../../../src/helpers/package-helper";

describe("helper/npm-helper", ()=>{
	describe("Install", ()=>{
		beforeEach(()=>{
			TestHelper.prepEnvironment();
			TestHelper.initEnvironment();
		});
		it("errors on unknown package", ()=> {
			return expect(NpmExecHelper.install(["jsdkjsd"]))
				.to.be.rejectedWith(Error, ErrorMessages.UNKNOWN_PACKAGE);
		});
		it("installs single npm package without version", ()=>{
			let rootPackage = FsHelper.openJson(TestHelper.getTestArea());
			let deps = PackageHelper.getInstalled(rootPackage);
			expect(deps).to.not.have.property("request");
			return NpmExecHelper.install(["request"]).then(()=>{
				let rootPackage = FsHelper.openJson(TestHelper.getTestArea());
				expect(PackageHelper.getInstalled(rootPackage)).to.have.property("request");
				expect(PackageHelper.getInstalled(rootPackage).request).to.be.a("string");
			});
		});
		it("installs multiple npm packages", ()=> {
			let rootPackage = FsHelper.openJson(TestHelper.getTestArea());
			let deps = PackageHelper.getInstalled(rootPackage);
			expect(deps).to.not.have.property("request");
			expect(deps).to.not.have.property("chai");
			return NpmExecHelper.install(["request", "chai"]).then(()=>{
				let rootPackage = FsHelper.openJson(TestHelper.getTestArea());
				expect(PackageHelper.getInstalled(rootPackage)).to.have.property("request");
				expect(PackageHelper.getInstalled(rootPackage).request).to.be.a("string");
				expect(PackageHelper.getInstalled(rootPackage)).to.have.property("chai");
				expect(PackageHelper.getInstalled(rootPackage).chai).to.be.a("string");
			});
		});
	});
});