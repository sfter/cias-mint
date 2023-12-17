# Celestia(tia) 公链铭文 cias mint 脚本

## 代码参考 [qzz0518/coss](https://github.com/qzz0518/coss)

### Step 1: 安装

```
git clone https://github.com/sfter/cias-mint
yarn install
cp .env.example .env
```

### Step 2: 配置环境变量

在脚本源代码目录下修改 .env 文件

```bash
# rpc配置, 可以从 https://atomscan.com/directory/celestia 找到自己喜欢的节点服务器
NODE_URL=https://public-celestia-rpc.numia.xyz
# NODE_URL=https://celestia-rpc.mesa.newmetric.xyz

# 主钱包（资金钱包）私钥, 用于转账给其它真正用来 Mint 的钱包
PRIVATE_KEY=

# 生成钱包配置,按需配置
# 生成多少个 Mint 钱包
NUM_OF_WALLETS=5
# 真正 Mint 的钱包文件，所有生成的钱包都在这个文件里
WALLET_JSON_FILE=wallets.json

# celestia配置（可以不用动）
CHAIN_SYMBOL=celestia
TOKEN_DENOM=utia
TOKEN_DECIMAL=1000000

# 从主钱包（资金钱包）转多少个 TIA 到 每个真正 Mint 的钱包
TOKEN_TRANSFER_AMOUNT=2

# gas 配置, 按需修改
GAS_PRICE=10000
GAS_LIMIT=100000

# mint配置, 一定要根据官方参数配置
MINT_AMOUNT=10000
# 铭文代币名称
TICK=cias
# 协议类型
PROTOCOL=cia-20

# 每个钱包 mint 次数
MINT_TIMES=10

```

### Step 3: 批量生成 Mint 钱包

```bash
node wallet_gen.js
```

### Step 4: 从主钱包（资金钱包）批量转帐到 Mint 钱包

```bash
node transfer.js
```

### Step 5: 运行 Mint 程序开始 Mint

```bash
node mint.js
```

### 特别说明
如果 keplr 钱包导不出私钥，可以通过如下方法来做
> - 先把 .env 文件配置好，PRIVATE_KEY 留空。
>
> 
> - 使用 node wallet_gen.js 生成钱包
> 
> 
> - 打开当前目录下的 wallet.json 文件
>
> 
> - 选择其中任意一个钱包做为主钱包。
> 
> 
> - 打开 keplr 钱包，向你在上面第4步选择的钱包地址转一些 $TIA 进去。
> 
> 
> - 将上面第4步选择的钱包地址配置到 .env 文件里的 PRIVATE_KEY 字段里。
> 
> 
> - 执行 node transfer.js 将会从上面第4步选择的钱包向其它 Mint 的钱包批量转帐。
> 
> 
> - 执行 node mint.js 开始批量 Mint，完成 OK。
