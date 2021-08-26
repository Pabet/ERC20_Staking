import { HardhatUserConfig } from "hardhat/types";

import "@typechain/hardhat";
//import "hardhat-typechain";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";





const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: "0.8.0", settings: {} }],
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
};
export default config;
