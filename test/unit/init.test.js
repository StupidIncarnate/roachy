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
	})
});