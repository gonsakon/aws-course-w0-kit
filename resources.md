# W0 教學資源｜只看你卡住的那一段

官方資料最後查核：2026-07-23。

W0 的主教材是影片與任務卡（task.md）。下面是安裝、規則查核與排錯入口，不需要從頭讀完整份官方文件。

## 先判斷你缺哪個環境

在 macOS Terminal、Windows PowerShell 或 Command Prompt 執行：

```bash
node --version
docker --version
docker info
```

| 結果 | 下一步 |
|---|---|
| `node` 找不到、是已 EOL 的 v20，或是奇數版 | 先走下方 Node.js 安裝／升級 |
| `docker` 找不到 | 安裝 Docker Desktop |
| Docker 有版本，但 `docker info` 無 Server | 啟動 Docker Desktop，等待引擎完成啟動 |
| 三個指令都正常 | 回到學生攻略開始 W0 |

### Node.js 尚未安裝或不是受支援的 LTS

- [Node.js 官方下載](https://nodejs.org/en/download)：安裝 Latest LTS；2026-07 建議 v24，v22 仍可使用
- [Node.js 官方版本狀態](https://nodejs.org/en/about/previous-releases)：v20 已 EOL，不再接收一般安全修補；不要因為數字大於 22 就選 v23／v25 等已 EOL 奇數版
- 安裝或升級後關閉所有終端機，再開一個新的終端機執行 `node --version`
- 若電腦同時裝過多種 Node.js，畫面仍顯示舊版，不要反覆安裝；回報作業系統、`node --version` 與安裝方式，讓助教協助判斷 PATH

Windows PowerShell 若執行 `npm run ...` 顯示 `npm.ps1 cannot be loaded`，不要修改全域 Execution Policy。可改用：

```powershell
npm.cmd run status
```

或開啟 Windows Command Prompt 執行原本的 `npm run ...`。

## 任務一：AWS 帳號

W0 的帳號步驟是這次新註冊時選擇 `Free account plan`。完成紀錄填 `account_plan: FREE` 與 `time_window: COVERS_COURSE`。

### 必要時查

- [AWS：建立帳號的完整步驟](https://docs.aws.amazon.com/accounts/latest/reference/getting-started.html)：註冊欄位、付款方式、身分驗證與最長 24 小時啟用時間
- [AWS：Free account plan](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html)：確認 Free plan 的期限、credits 與使用限制
- [AWS：Control Your AWS Costs](https://docs.aws.amazon.com/hands-on/latest/control-your-costs-free-tier-budgets/control-your-costs-free-tier-budgets.html)：看懂初始 US$100 credits 與額外學習活動的差別
- [AWS：Root user MFA](https://docs.aws.amazon.com/IAM/latest/UserGuide/enable-mfa-for-root.html)：支援裝置、35 天規則與復原前提
- [AWS：Root user 安全實務](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)：為什麼不日常使用 Root、為什麼不建立 Root Access Key
- [AWS：登入 Root user](https://docs.aws.amazon.com/signin/latest/userguide/introduction-to-root-user-sign-in-tutorial.html)：登入頁面選錯時使用
- [AWS：切換 Region](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/select-region-procedure.html)：找不到 Tokyo 時使用

### W0 不需要讀

- AWS CLI 安裝與 `aws configure`
- IAM User、Policy、Role
- EC2、VPC、RDS 建立教學

這些會在後續週次正式處理。

## 網路概念（課中預習用，W0 不需要）

### 想補一個觀念時看

- [MDN：Internet 如何運作](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work)：只看 Client、Server、IP 與 DNS 的概念圖
- [MDN：DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)：網域如何對應 IP
- [MDN：HTTP 概觀](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)：Client／Server 與 Request／Response
- [AWS：VPC 如何運作](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html)：只掃讀 VPC、Subnet 與 Route，不需要照做

### W0 不需要讀

- OSI 七層完整理論
- TCP 封包細節
- 二進位與 CIDR 子網計算
- NAT Gateway、NACL、DNS Record 類型

## 任務二：Docker 與 Ubuntu

### Docker 尚未安裝

- [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

Windows 請依 Docker 官方步驟確認 WSL 2；安裝或更新後若要求重新開機，先完成再跑 W0。

### 想補 Linux 指令

- [Ubuntu：給新手的 Linux command line](https://ubuntu.com/desktop/docs/en/latest/tutorial/the-linux-command-line-for-beginners/)：建議看到檔案操作即可
- [Docker：執行 Container](https://docs.docker.com/get-started/docker-concepts/running-containers/)：理解 image、container 與 `docker run`

### W0 不需要讀

- SSH 私鑰與 EC2 登入
- `apt` 安裝套件
- `systemctl`、Nginx、Certbot
- EBS 格式化與掛載

## 安裝後的最小健檢

macOS Terminal 或 Windows PowerShell 都執行同一組指令：

```bash
node --version
docker --version
docker info
```

預期：

- Node.js 顯示 `v22` 或 `v24`（建議 Latest LTS）
- Docker 顯示版本
- `docker info` 能列出 Server 資訊

若 `docker --version` 成功但 `docker info` 失敗，通常是 Docker Desktop 尚未啟動，不是 Linux 任務寫錯。

若 `node --version` 是 v20 或其他已 EOL 版本，先升級到官方目前支援的 LTS 再執行 checker；不要在舊版 Node.js 下把工具錯誤當成作業錯誤。

若 W0 工具顯示 `NODE_VERSION_UNSUPPORTED`，表示它已在任務開始前停止，不是你的 AWS、網路題目或 Linux 作業做錯。升級 Node.js 後要關閉所有終端機，再開新終端機確認 `node --version` 為 v22 或 v24，最後重跑原指令。

## 向老師回報的原則

可以提供：

- 作業系統與版本
- Node.js／Docker 版本
- W0 工具顯示的錯誤代碼
- 不含家目錄、Email、Account ID 或憑證的錯誤文字

不要提供 AWS 付款、Billing、MFA、Security credentials 或完整帳號畫面。
