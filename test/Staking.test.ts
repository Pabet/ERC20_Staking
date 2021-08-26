const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { provider, MockProvider, deployContract, deployMockContract } = waffle;

const Staking = require("../artifacts/contracts/Staking.sol/Staking.json");
const Token = require("../artifacts/contracts/PBTToken.sol/PBTToken.json");

describe("Staking contract", function () {

    let sender;
    let receiver;
    let mockERC20;
    let stakingFactory;
    let stakingContract;


    beforeEach(async function () {
        [sender, receiver] = await ethers.getSigners();
        mockERC20 = await deployMockContract(sender, Token.abi);
        stakingFactory = await ethers.getContractFactory("Staking");
        stakingContract = await stakingFactory.deploy(mockERC20.address);
    });

    describe("Deployment", function() {
        it("Should be deployed with the correct token", async function () {
            //expect(await stakingContract.).to.equal("PBTToken");
        });
    });   

    describe("Staking", function () {
        it("Should transfer tokens between accounts", async function () {

        });    
    });
});    
