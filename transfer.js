require('dotenv').config();
const { SigningStargateClient, GasPrice, coins } = require("@cosmjs/stargate");
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const {readFileSync} = require("fs");

async function main() {
    const denom = process.env.TOKEN_DENOM;
    const chain = process.env.CHAIN_SYMBOL;
    const walletsFile = process.env.WALLET_JSON_FILE;
    const tokenDecimal = parseInt(process.env.TOKEN_DECIMAL);
    const rpcEndpoint = process.env.NODE_URL;
    const privateKey = process.env.PRIVATE_KEY; //主账户私钥
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex"), chain);
    const [account] = await wallet.getAccounts();
    const gasPrice = GasPrice.fromString(`0.025${denom}`); // no need
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: gasPrice });
    const balance = await client.getBalance(account.address, denom);
    // const balance = await client.getBalance('celestia1x8pl6xa3sxj49du4758cf8mutk4cu7uha04eyc', denom);
    console.log(`主账户地址: ${account.address} 余额: ${  balance.amount / tokenDecimal }`);
    const wallets = JSON.parse(readFileSync(walletsFile, 'utf-8'));
    const recipients = wallets.map(wallet => wallet.address);

    const amount = coins(parseInt(parseFloat(process.env.TOKEN_TRANSFER_AMOUNT) * tokenDecimal) ,denom);
    for (const recipient of recipients) {
        try {
            const fee = {
                amount: coins(process.env.GAS_PRICE, denom),
                gas: process.env.GAS_LIMIT,
            };
            const result = await client.sendTokens(account.address, recipient, amount, fee);
            console.log(`${recipient}: 转账 ${amount.toString()} 成功: ${`https://www.mintscan.io/${chain}/tx/` + result.transactionHash}`);
        } catch (error) {
            console.error(`转账给 ${recipient} 失败: `, error);
        }
    }
}

main();
