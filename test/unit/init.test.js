import {TestHelper} from "../helpers/test-helper";
const expect = require('chai').expect;

import initExec from "../../src/exec/init";

describe("cmd: init", ()=>{
	beforeEach(()=> {
		TestHelper.prepEnvironment();
	});
	it("creates init folder", ()=>{
		initExec();
		expect(TestHelper.ensureFileExists("roachy.config.json"), "Expect config.json").to.be.true;
		const configJson = TestHelper.getJsonContents("roachy.config.json");
		expect(configJson).to.have.property("version", 0.1);
		expect(configJson).to.have.property("projects").and.to.be.an("array");
		expect(configJson).to.have.property("projectDependencies").and.to.be.an("object");
		expect(configJson).to.have.property("packages").and.to.be.an("object");

	})
});