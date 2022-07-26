import "@nomiclabs/hardhat-ethers";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const _totalSupply = 1000; // total token supply
const _decimals = 18; // token decimals

async function deployContract() {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(_totalSupply);
    await myToken.deployed();
    return myToken;
}

async function printContractInfo(myToken: Contract) {
    console.log("Token deployed to: ", myToken.address);
    console.log("Token deployed by: ", await myToken.owner());
    console.log("Total supply: ", (await myToken.totalSupply()) / 10 ** _decimals);
    console.log("Decimals: ", await myToken.decimals())
}

deployContract().then(printContractInfo);