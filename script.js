import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
class Lit {
  litNodeClient;
  chain;

  constructor(chain) {
    this.chain = chain;
  }

  async connect() {
    this.litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "datil-dev",
    });
    await this.litNodeClient.connect();
  }

  async transferFunds(sender, recipient, provider, amount) {
    const senderSigner = new ethers.Wallet(sender.privateKey, provider);
    const tx = await senderSigner.sendTransaction({
      to: recipient.address,
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
    console.log(`Transferred ${amount} ETH from ${sender.address} to ${recipient.address}`);
  }
}

// Main logic
(async () => {
  const chain = "baseSepolia";
  const myLit = new Lit(chain);
  await myLit.connect();

  const provider = new ethers.providers.JsonRpcProvider(
    "https://base-sepolia.g.alchemy.com/v2/2Zt9ztwHmD4Ny5EnsJwcwTC5AhgOdhko"
  );

  // Wallet A and Wallet B information
  const walletA = {
    address: "0x3Ca334C7d7655f801166c77AF38E235b872E062E",
    privateKey:  process.env.PRIVATE_KEY_A, // Replace with Wallet A's private key
  };
  const walletB = {
    address: "0x00c06d82A69cca3b6fE0AA48bdbb94cdD672E773",
    privateKey:  process.env.PRIVATE_KEY_B, // Replace with Wallet B's private key
  };

  // Collecting choice (Heads/Tails) from A
  const choiceA = "heads"; // Replace this with actual input logic if required
  console.log(`Wallet A chose ${choiceA}`);

  // Randomly determining the result
  const outcome = Math.random() < 0.5 ? "heads" : "tails";
  console.log(`Random outcome is ${outcome}`);

  const amount = "0.01"; // Amount to transfer (in ETH)

  // Determine transfer based on outcome
  if (choiceA === outcome) {
    console.log("Wallet A wins!");
    await myLit.transferFunds(walletB, walletA, provider, amount);
  } else {
    console.log("Wallet B wins!");
    await myLit.transferFunds(walletA, walletB, provider, amount);
  }
})();
