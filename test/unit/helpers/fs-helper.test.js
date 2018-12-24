import path from 'path';
const expect = require('chai').expect;
import {TestHelper} from "../../helpers/test-helper";
import {FsHelper} from "../../../src/helpers/fs-helper";
import {ErrorMessages} from "../../../src/error-messages";

describe("helper/fs-helper", ()=>{
	beforeEach(()=>{
		TestHelper.prepEnvironment();
		return TestHelper.initEnvironment();
	});

	it("finds root config in current dir", ()=>{
		expect(FsHelper.getRootPath(TestHelper.getTestArea())).to.be.a("string").and.to.equal(TestHelper.getTestArea());
	});
	it("crawls up to find root config", ()=> {
		const subTestDir = path.join(TestHelper.getTestArea(), "src", "lib");
		expect(FsHelper.getRootPath(subTestDir)).to.be.a("string").and.to.equal(TestHelper.getTestArea());
	});
	it("throws error if can't find root config", ()=>{
		expect(()=> FsHelper.getRootPath(path.join(TestHelper.getTestArea(), "..", ".."))).to.throw(ErrorMessages.ROOT_NOT_FOUND);
	});
});