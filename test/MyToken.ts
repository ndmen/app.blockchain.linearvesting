import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { describe } from "mocha";

let myToken: Contract;
let linearVesting: Contract;

const _totalSupply = 1000; // total token supply
const _decimals = 18; // token decimals
const _vestingDuration = 600; // duration for which token will get dispersed(in seconds)
const _value = 50**18;
const _releaseRate = 83333333333333333; // token to get released per second for above token supply, beneficiary, and vesting duration

async function deployContract(name: string, ...args: any) {
    const Contract = await ethers.getContractFactory(name);
    const contract = await Contract.deploy(...args);
    await contract.deployed();

    return contract;
}

describe("My Token", () => {
    before(async function () {
        myToken = await deployContract("MyToken", _totalSupply);
    })

    describe("#constructor()", () => {
        it("should check whether the decimals value is 18", async function () {
            expect(await myToken.decimals()).to.equal(_decimals);
        })

        it("should check the initial token supply", async function () {
            expect((await myToken.totalSupply()) / 10 ** _decimals).to.equal(_totalSupply);
        })
    })

    describe("#addBenificiar()", () => {
        it("should return true if benificiar was added", async function () {
            expect(await myToken.addBenificiar("0xe2cdfDAE0144F1AE8396e65c263F1b744771a574", "50")).to.equal(true);
        })
    })

    describe("#addLinearVesting()", function () {
        it("should return true if linear vesting was started", async function () {
            expect(await myToken.addLinearVesting(_vestingDuration)).to.equal(true);
        })
    })

    describe("#claim()", function () {
        it("should return true if linear value was added to calimed value", async function () {
            expect(await myToken.claim(0)).to.equal(true);
        })
    })


    describe("#withdraw()", function () {
        it("should return true if value was withdraw", async function () {
            expect(await myToken.withdraw(1000)).to.equal(true);
        })
    })
});

describe("Linear Vesting", () => {
    before(async function () {
        linearVesting = await deployContract("LinearVesting");
    })

    describe("#setReleaseRate()", function () {
        it("should return release rate in 1 second", async function () {
            expect(await linearVesting.setReleaseRate(_vestingDuration, _value)).to.equal(_releaseRate);
        })
    })
});