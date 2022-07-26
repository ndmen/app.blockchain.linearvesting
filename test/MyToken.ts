import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { describe } from "mocha";

let myToken: Contract;
let linearVesting: Contract;

const _totalSupply = 1000; // total token supply
const _decimals = 18; // token decimals
const _totalBeneficiaries = 10; // number of addresses that will recieve token
const _vestingDuration = 31536000; // duration for which token will get dispersed(in seconds)
const _releaseRate = 19.025875190258752; // token to get released per minute for above token supply, beneficiary, and vesting duration

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

    describe("#addBeneficiaries()", () => {
        it("should check beneficiaries added succesfully", async function () {
            await myToken.addBenificiaries([
                "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
            ]);
            const b = (await myToken.beneficiaries())[0];
            expect(b.toLowerCase()).to.equal("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
        })
    })

    describe("#addTokenVesting()", function () {
        it("should check the release rate", async function () {
            await myToken.enableTokenVesting(_vestingDuration);
            expect((await myToken.releaseRate()) / 10 ** _decimals).to.equal((_totalSupply * 60) / _vestingDuration);
        })

        it("should fail at enabling token vesting as it alreay started", async function () {
            let e: any;
            try {
                await myToken.enableTokenVesting(_vestingDuration);
            }
            catch (err) {
                e = err;
            }
            expect(e.message.includes("Token vesting already started!")).to.equal(true);
        })
    })

    describe("#getVestedAmount()", function () {
        it("should return token vested equal to 0 for time elapsed equal to 0 minute", async function () {
            expect((await myToken.getVestedAmount()) / 10 ** 18).to.equal(0);
        })
    })


    describe("#getReleasedAmount()", function () {
        it("should return the amount of token released for a benificiary", async function () {
            expect(await myToken.getReleasedAmount("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199")).to.equal(0);
        })
    })

    describe("#releaseToken()", function () {
        it("should fail to release token as called by account not a beneficiary", async function () {
            let e: any;
            try {
                await myToken.releaseToken();
            } catch (err) {
                e = err
            }
            expect(e.message.includes("You are not a benificiary!")).to.equal(true);
        })

        it("should fail to release token saying NO TOKEN TO RELEASE", async function () {
            let e: any;
            try {
                await myToken.addBenificiaries([
                    "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                ]);
                // await myToken.enableTokenVesting(_vestingDuration);
                await myToken.releaseToken();
            } catch (err) {
                e = err;
            }
            expect(e.message.includes("No tokens to release")).to.equal(true);
        })
    })
});

describe("Linear Vesting", () => {
    before(async function () {
        linearVesting = await deployContract("LinearVesting");
    })

    describe("#setAmount()", function () {
        it("should assign value to the variable _amount", async function () {
            await linearVesting.setAmount(_totalSupply, _totalBeneficiaries);
            expect(await linearVesting.amount()).to.equal(_totalSupply / _totalBeneficiaries);
        })

        it("should fail at assigning value to the variable _amount", async function () {
            let e: any;
            try {
                await linearVesting.setAmount(_totalSupply, _totalBeneficiaries);
            } catch (err) {
                e = err;
            }
            expect(e.message.includes("_amount: Already Initialized!")).to.equal(true);
        })
    })

    describe("#setReleaseRate()", function () {
        it("should assign value to the variable _releaseRate", async function () {
            await linearVesting.setReleaseRate(_vestingDuration);
            expect(await linearVesting.releaseRate()).to.equal(19);
        })

        it("should fail at assigning value to the variable _releaseRate", async function () {
            let e: any;
            try {
                await linearVesting.setReleaseRate(_vestingDuration);
            } catch (err) {
                e = err;
            }
            expect(e.message.includes("_releaseRate: Already Initialized!")).to.equal(true);
        })
    })

    describe("#tokenReleased()", function () {
        it("should return the amount of token released for a beneficiary", async function () {
            expect((await linearVesting.tokenReleased("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"))).to.equal(0);
        })
    })
});