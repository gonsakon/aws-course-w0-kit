# W0 本機驗收工具

這個資料夾只使用 Node.js 內建功能與本機 Docker CLI，不安裝第三方套件、不讀取 AWS 憑證，也不呼叫 AWS API。

## 系統需求

- 仍受官方支援的 Node.js LTS：建議 v24，v22 也可
- Docker Desktop
- macOS Terminal 或 Windows PowerShell（不要用 Git Bash）

先執行：

```bash
node --version
docker --version
```

不需要 `npm install`。學生只要用到下面三個指令：

| 指令 | 用途 |
|---|---|
| `npm run linux` | 進入免洗 Ubuntu（任務二的門） |
| `npm run check:docker` | 任務二驗收：Docker 環境＋簽到檔 |
| `npm run status` | 總驗收：環境過＝READY |

任務一（AWS 帳號）不經 kit 驗收：依任務卡拍兩張截圖（Console 東京首頁＋Authenticator 的 AWS 條目）。

每個指令都會先檢查 Node.js 版本。若顯示 `NODE_VERSION_UNSUPPORTED`，任務尚未執行；請依 `resources.md` 升級至 v24 LTS（或仍受支援的 v22 LTS），關閉並重開終端機後再試。

如果 Windows PowerShell 顯示「無法載入 `npm.ps1`，因為此系統已停用指令碼執行」，不需要修改系統的 Execution Policy；把指令開頭的 `npm` 改成 `npm.cmd` 即可，例如：

```powershell
npm.cmd run check:docker
```

## 任務二：免洗 Ubuntu 與簽到檔

```bash
npm run linux
```

會進入一台免洗 Ubuntu（第一次自動下載 image）。機器是拋棄式的：`exit` 離開就消失，再開就是全新一台。唯一會留下來的是掛在 `/postbox` 的信箱；照影片在裡面留下簽到檔：

```bash
echo hello world > /postbox/hello.txt
```

驗收：

```bash
npm run check:docker
```

依序檢查三件事：Docker 正在運作、`ubuntu:24.04` 容器起得來、`/postbox/hello.txt` 存在且非空。驗收用的容器以 `--network none` 執行、用完即棄。

想把簽到信箱整個重來：

```bash
docker volume rm aws-w0-postbox
```

## 總驗收

```bash
npm run status
```

讀取環境驗收結果，通過才顯示：

```text
Docker environment        PASS
W0 STATUS                 READY
```

把這兩行用文字複製，連同任務卡要求的三張截圖，一起交到指定的提交位置。沒過會顯示 `MISSING` 或 `INVALID / RETRY`，補完後可重跑任意次。

## 本機產物

工具會把最小結果寫入 `.w0-results/`，只含任務狀態、檢查版本、時間與內容雜湊；不保存 AWS Email、Account ID、credits 或憑證。此資料夾已被 `.gitignore` 排除。

## 為什麼找不到測試資料夾？

這是正常的。學生發布包刻意排除老師使用的 `test/`、`integration/`，以及課中預習才會用到的工具（網路測驗、Linux 練習驗收會在對應週前另行發布）。你不需要那些檔案也能完成 W0 的兩個任務。
