import {TestHelper} from "../helpers/test-helper";
const expect = require('chai').expect;

import {InitExec} from "../../src/exec/init-exec";

describe("cmd: init", ()=>{
	beforeEach(()=> {
		TestHelper.prepEnvironment();
	});
	it("creates init folder", ()=>{
		InitExec();
		expect(TestHelper.ensureFileExists("roachy.config.json"), "Expect config.json").to.be.true;
		const configJson = TestHelper.getJsonContents("roachy.config.json");
		expect(configJson).to.have.property("version", 0.1);
		expect(configJson).to.have.property("apps").and.to.be.an("object");
		expect(configJson).to.have.property("appDependencies").and.to.be.an("object");
		expect(configJson).to.have.property("packages").and.to.be.an("object");
		expect(configJson).to.have.property("devPackages").and.to.be.an("object");

	})
});