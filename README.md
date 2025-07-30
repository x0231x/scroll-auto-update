# scroll-auto-update（React + TypeScript + Tailwind v3）

這是一個**最小可執行的無限卷軸示範**，採用 **Create React App + TypeScript + Tailwind CSS v3.4**。  
畫面一次載入 3 筆水果卡片，當最後一筆進入視窗時（多預留 200 px），自動載入下一批資料。

## 專案結構（摘要）  
src/  
├── App.tsx # 主要元件（無限卷軸邏輯）  
├── fake-data.ts # 水果資料  
├── types.ts # Fruit 介面  
└── index.css # Tailwind  


## Getting Started  

### 環境需求
- **Node.js 20.18.1**
- **Yarn 1.22**

### 安裝與執行

# 安裝相依
yarn

# 啟動開發伺服器（http://localhost:3000）
yarn start

### 運作流程

首次掛載 -> loadNext() 切出第一批 3 筆。  

每次 items 增加，新的「最後一筆li」被指定為 sentinel。  

IntersectionObserver 監看該 sentinel；只要進入視窗（含 rootMargin 多預留的 200 px），就再切下一批加入。  

items.length === fakeData.length 時 hasMore 為 false，停止載入並顯示「已顯示全部資料」。  