# 冰箱食譜小幫手 🍳

> 給沒空想晚餐的媽媽 — 30 秒找到今天能煮的料理。

輸入冰箱裡有的食材，從 80 道台灣家常菜中找出今天可以做的。完全靜態、零後端、零 API、零維護。

部署網址：[fridge.chparenting.com](https://fridge.chparenting.com)

---

## 特色

- 📦 **內建 80 道台灣家常菜**：蛋料理 10 / 蔬菜 15 / 肉類 16 / 海鮮 10 / 湯品 11 / 主食 13 / 早餐點心 5
- 🎯 **智慧比對**：完全可做、缺 1-2 樣食材都會推薦
- 🏷 **分類瀏覽**：沒輸入食材也能逛分類找靈感
- 🎨 **AI 媽媽手記品牌設計**：奶油色 + 暖咖啡 + 金色強調
- 📱 **Mobile-first**：手機 1 欄、桌面 2 欄
- 🔌 **完全離線運作**：純 HTML+CSS+JS，零 API 呼叫

---

## 本機測試

```bash
cd fridge-recipe-helper
python3 -m http.server 8000
```

打開 http://localhost:8000

---

## 怎麼新增食譜

編輯 `data/recipes.json`，按這個格式加新的：

```json
{
  "id": "81",
  "category": "蛋料理",
  "name": "三色蛋",
  "description": "鹹蛋+皮蛋+雞蛋三層風味",
  "time_minutes": 30,
  "difficulty": 2,
  "tags": ["宴客", "造型"],
  "required_ingredients": ["雞蛋", "皮蛋", "鹹蛋"],
  "optional_ingredients": [],
  "seasonings": ["鹽", "高湯", "醬油"],
  "servings": "4 人份",
  "ingredients_with_amount": [
    { "name": "雞蛋", "amount": "3 顆" }
  ],
  "steps": ["步驟 1", "步驟 2", "步驟 3", "步驟 4", "步驟 5"],
  "tips": "一個關鍵小撇步"
}
```

### 重要規則

- `category` 必須是這 7 個之一：`蛋料理` / `蔬菜` / `肉類` / `海鮮` / `湯品` / `主食` / `早餐點心`
- `required_ingredients` **只列「沒有就做不出來」的主食材**
- 常見調味料（鹽、糖、油、醬油、蒜、薑、蔥）放 `seasonings`，**不參與比對**
- `steps` 維持 5–8 步
- `tips` 一個關鍵撇步就好，不要冗長

### 新食材的同義詞

如果新食譜用了還沒對應的食材名（例如「番茄」 vs 「蕃茄」），請編輯 `script.js` 最上面的 `SYNONYMS`：

```js
const SYNONYMS = {
  '蕃茄': '番茄',
  // ...
};
```

---

## 部署到 Cloudflare Pages

1. 推到 GitHub（建議獨立 repo）
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. 選 repo，設定：
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: `/`
4. Deploy

### 綁定自訂網域 fridge.chparenting.com

1. Cloudflare Pages 專案 → **Custom domains** → Set up a custom domain
2. 輸入 `fridge.chparenting.com`
3. Cloudflare 會自動幫你加 DNS 記錄（如果根域名已在 Cloudflare）

---

## 檔案結構

```
fridge-recipe-helper/
├── index.html          # HTML 骨架 + Tailwind CDN
├── style.css           # 自訂品牌樣式
├── script.js           # 比對邏輯 + UI 互動
├── data/
│   └── recipes.json    # 80 道食譜資料
├── _headers            # Cloudflare 安全 headers
└── README.md
```

---

## 技術棧

- 純 HTML5 + Vanilla JavaScript（ES6+）
- Tailwind CSS（CDN）
- Noto Sans TC（Google Fonts）
- Cloudflare Pages

**沒用**：React、Vue、Next.js、後端、資料庫、AI API。
**理由**：永久免費、零維護、超快速。

---

## 食譜資料來源

內建 80 道為作者整理的台灣家常菜經典食譜，可自由增加。歡迎提 Pull Request 或編輯 `data/recipes.json` 加入更多。

---

## 授權

made with ♡ by [AI 媽媽手記](https://chparenting.com)
