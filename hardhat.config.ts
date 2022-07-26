import 'dotenv/config';
import "@nomiclabs/hardhat-waffle";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: process.env.YOUR_ALCHEMY_API_URL,
      accounts: [process.env.YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY],
    }
  }
};