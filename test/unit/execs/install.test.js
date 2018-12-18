import {TestHelper} from "../../helpers/test-helper";
import {expect} from 'chai';
import chai from 'chai';
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import {ErrorMessages} from "../../../src/error-messages";
import {REF} from "../../../src/config";
import {InstallExec} from "../../../src/exec/app/install-cmd";

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
				TestHelper.initLibUiApp();
			});
			it("errors if nothing passed", () => {
				expect(() => InstallExec()).to.throw(ErrorMessages.APPS_REQUIRED);
			});
			it("errors if no apps were passed", ()=>{
				expect(() => InstallExec(["moment"])).to.throw(ErrorMessages.APPS_REQUIRED);
			});
			it("errors if no packages were passed", ()=>{
				expect(() => InstallExec(["lib-ui"])).to.throw(ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if package one package is not recognized", ()=>{
				return expect(InstallExec(["lib-ui", "jksdhkds"])).to.be.rejectedWith(Error, ErrorMessages.UNKNOWN_PACKAGE);
			});
		});

	});
	describe("Good State", () => {
		describe("General", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("adds an already installed package to another app", ()=>{

			});
		});
		describe("Single App Ref", () =>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("adds a package to an app", ()=>{
				 return InstallExec(["lib-ui", "request"]).then(()=>{
				 	expect(1).to.equal(1);
				 });
			});
			it("adds multi packages to an app", ()=>{

			});
		});
		describe("Multi App Ref", () =>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("adds a package to multiple apps", ()=>{

			});
			it("adds multi packages to multiple app", ()=>{

			});
		});
	});
});