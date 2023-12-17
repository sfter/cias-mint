require('dotenv').config();
const fs = require('fs');
const bip39 = require("bip39");
const { crypto } = require("cosmos-lib");
const {DirectSecp256k1Wallet} = require("@cosmjs/proto-signing");

async function generateCosmosWallets() {
    let walletData = [];
    let walletsFile  = process.env.WALLET_JSON_FILE
    if (fs.existsSync(walletsFile)) {
        const existingData = JSON.parse(fs.readFileSync(walletsFile, 'utf8'));
        walletData = [...existingData];
    }
    for (let i = 0; i < process.env.NUM_OF_WALLETS; i++) {
        const mnemonic = bip39.generateMnemonic();
        const keys = crypto.getKeysFromMnemonic(mnemonic);
        const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(keys.privateKey), "celestia");
        const [account] = await wallet.getAccounts();
        const walletAddress = account.address;
        walletData.push({
            address: walletAddress,
            mnemonic: mnemonic,
            privateKey: keys.privateKey.toString('hex')
        });
    }

    fs.writeFileSync(walletsFile, JSON.stringify(walletData, null, 4));
}

generateCosmosWallets().then(() => {
    console.log(`Wallets generated and saved to ${ process.env.WALLET_JSON_FILE}`);
});
