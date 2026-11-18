# 模擬測驗中心（GitHub Pages）

## 部署
1. 在 GitHub 建立 repository，名稱可用 `exam-simulator`。
2. 將本資料夾內的 `index.html`、`style.css`、`app.js`、`questions.json` 上傳到 repository 根目錄。
3. Repository → Settings → Pages → Build and deployment 選 `Deploy from a branch`。
4. Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
5. 網站網址會是：`https://jyunrenlolz.github.io/exam-simulator/`（前提是 GitHub 帳號名稱與 repository 名稱正確）。

## 題庫格式
`questions.json`：
- `type`: `single`、`multiple`、`truefalse`
- `options`: 選項文字陣列
- `answer`: 正確選項索引陣列（從 0 開始）
- `explanation`: 解析文字
- `category`: 題目分類

此版本包含文件格式相關示範題。請自行確認題目內容適合使用，再加入完整題庫。
