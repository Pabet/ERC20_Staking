import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { PBTToken } from "../typechain/PBTToken"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Token contract", function () {

  let hardhatToken : PBTToken;
  let owner : SignerWithAddress;
  let addr1 : SignerWithAddress;
  let addr2 : SignerWithAddress;

  // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        const tokenFactory = await ethers.getContractFactory("PBTToken");
        [owner, addr1, addr2] = await ethers.getSigners();

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        hardhatToken = (await tokenFactory.deploy(100000)) as PBTToken;
    });


    describe("Deployment", function() {
        it("Should set the right owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Deployment should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    });   

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
          const [owner, addr1, addr2] = await ethers.getSigners();
      
          const Token = await ethers.getContractFactory("PBTToken");
      
          const hardhatToken = await Token.deploy(100000);
      
          // Transfer 50 tokens from owner to addr1
          await hardhatToken.transfer(addr1.address, 50);
          expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
      
          // Transfer 50 tokens from addr1 to addr2
          await hardhatToken.connect(addr1).transfer(addr2.address, 50);
          expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      
            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
              hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      
            // Owner balance shouldn't have changed.
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(
              initialOwnerBalance
            );
        });
      
        it("Should update balances after transfers", async function () {
            let initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      
            // Transfer 100 tokens from owner to addr1.
            await hardhatToken.transfer(addr1.address, 100);
      
            // Transfer another 50 tokens from owner to addr2.
            await hardhatToken.transfer(addr2.address, 50);
      
            // Check balances.
            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
      
            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
      
            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
        
    });

    
});    


