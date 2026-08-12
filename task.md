# W0 預習任務

### 任務描述



這份預習只做這兩件事。**影片會一步一步帶你操作**：照建議動線做完、交出三張截圖，你就準備好開課了。

點擊觀看 👉 [Teachable 課程影音](【待補：課程連結】)，用 Ctrl+F 搜尋影音章節的標題。

### 【建議動線】

全部做完約一個晚上（1.5〜2.5 小時，多數時間在等帳號啟用與下載）：

| 順序 | 做什麼 | 時間 |
|---|---|---|
| 1 | 看影片 ①②（從前後端踏進雲端工程師、什麼是 AWS） | 16 分 |
| 2 | 照影片 ③ 申請 AWS 帳號 → 送出後**等啟用** | 30〜45 分 |
| 3 | 等待空檔：跳去做**任務二**（裝 Docker＋打招呼） | 20〜60 分 |
| 4 | 帳號啟用後：照影片 ④ 綁 MFA，拍兩張截圖 | 15〜20 分 |
| 5 | `npm run status` 出現 READY → 拍最後一張截圖繳交 | 1 分 |

⚠️ AWS 帳號啟用通常幾分鐘、最長可能 24 小時——所以先送出申請，等待時間拿去做任務二，不要乾等。

### 【環境準備】

1\. 下載老師提供的 `w0-kit` 資料夾（下載連結：【待補】），解壓縮後用終端機進入該資料夾

2\. 確認 Node.js 版本是 **v22 或 v24**：終端機輸入 `node -v` 查看（版本不對的話 kit 會直接提醒你）

### 【任務一：申請 AWS 帳號】

**💡 觀看以下 4 個影音章節，完成「AWS 帳號開通與安全設定」：**

① 從前後端踏進雲端工程師

② 什麼是 AWS？

③ 預習任務｜申請 AWS 帳號（此章包含 [任務說明](【待補】)）

④ 預習任務｜登入後必做兩件事

**照影片做完後，你的帳號要長這樣：**

| 檢查點 | 對的狀態 |
|---|---|
| 方案 | **Free account plan**（本課唯一接受的方案） |
| Root MFA | 已綁定（建議多綁一台備用裝置） |
| 右上角 Region | Tokyo（`ap-northeast-1`） |

**驗收：兩張截圖**

**① IAM 儀表板**（Console 搜尋 IAM → Dashboard），畫面要看得到安全建議面板的兩個綠色勾勾：

- **Root user has MFA**
- **Root user has no active access keys**

這張同時證明了：帳號已啟用、登入成功、MFA 綁好、Root 沒有殘留金鑰。
（這頁右上角顯示 Global 是正常的，IAM 是全域服務；右側帳號資訊想遮就遮。）

**② 手機 Authenticator App**，看得到 **Amazon Web Services 那一條**——證明 MFA 綁在你自己的手機上。

驗證碼拍到沒關係（30 秒就換一組）；其他服務的條目建議先用搜尋框打 `AWS` 過濾掉，或直接遮起來。

### 【任務二：熟悉 Linux 環境】

**💡 看你自己作業系統的那支影音章節，完成「安裝 Docker＋第一次進入 Ubuntu」：**

① 預習任務｜安裝 Docker Desktop

② 預習任務｜安裝 Docker Desktop：Windows＋WSL2

1\. 執行：

```bash
npm run linux
```

第一次會自動下載 Ubuntu（約 1〜3 分鐘）。看到提示字元變成 `root@一串亂碼:/#`，你已經站在另一台電腦裡了。

2\. 跟著影片打一輪**查詢指令**（唯讀，怎麼打都玩不壞）：

| 查什麼 | 指令 |
|---|---|
| 我是誰 | `whoami` |
| 這台機器叫什麼 | `hostname` |
| 我站在哪 | `pwd` |
| 這是什麼系統 | `uname` |
| 這裡有什麼檔案 | `ls` |
| 現在幾點 | `date` |
| 我剛剛打過什麼 | `history` |
| 叫機器說話 | `echo 你好` |

3\. **寫入就一行**：照抄這行把簽到檔寄進信箱。`/postbox` 不是指令，是**資料夾的路徑**——跟網址的 `/path` 同一個概念，`/` 開頭代表從系統根目錄出發；它要搭配 `ls`、`cat`、`echo` 這些動詞用：

```bash
echo hello world > /postbox/hello.txt
```

寫完**再用查詢驗回來**：

| 查什麼 | 指令 |
|---|---|
| 信箱裡有什麼 | `ls -l /postbox` |
| 紙條寫什麼 | `cat /postbox/hello.txt` |

看到 `hello world` 就成功了。

4\. `exit` 回家，接著在 w0-kit 資料夾跑驗收：

```bash
npm run check:docker
```

```bash
npm run status
```

看到 `W0 STATUS READY` 就完成任務二。

5\. **拍第三張截圖**：終端機視窗整個拍下來，畫面裡要看得到你打過的指令、`cat` 印出的 `hello world`，以及最後 `npm run status` 的兩行結果

### 【繳交內容】

繳到【待補：提交位置】的東西：**三張截圖**。

| 截圖 | 拍什麼 |
|---|---|
| ① | IAM 儀表板，兩個綠色勾勾（Root MFA、無 active access keys） |
| ② | Authenticator App 的 Amazon Web Services 條目 |
| ③ | 終端機畫面，要看得到你打過的指令、`cat /postbox/hello.txt` 印出 `hello world`，以及最後 `npm run status` 的兩行結果 |

截圖③ 最後那兩行長這樣就是過了：

```text
Docker environment        PASS
W0 STATUS                 READY
```

沒過會顯示 `MISSING` 或 `INVALID / RETRY`：回任務二補完再跑一次就好，可以重跑任意次。

📌 重要提醒：AWS 帳號啟用最長要等 24 小時，不要拖到截止日當天才開始。


### 【常見問題】

**Q：在 Ubuntu 裡打錯指令，或把東西玩壞了怎麼辦？**

A：不用救。`exit` 離開再 `npm run linux`，進來的就是全新的一台。錯誤訊息不是弄壞，是機器在回話。

**Q：`npm run check:docker` 說 `DOCKER_IMAGE_MISSING`？**

A：代表還沒進去過 Ubuntu。先執行 `npm run linux` 完成第一次進入（會自動下載），再回來驗收。

**Q：`npm run check:docker` 說 `DOCKER_POSTBOX_EMPTY`？**

A：你進去過，但還沒留簽到檔。`npm run linux` 再進去一次，照抄 `echo hello world > /postbox/hello.txt`，離開後再驗一次。

**Q：kit 說我的 Node.js 版本不支援？**

A：裝 Node.js **v24 LTS**（或 v22），裝完**重開終端機**再執行。

