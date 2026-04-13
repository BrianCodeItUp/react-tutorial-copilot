# PRD: react-copilot 升級至 React Native 0.77 + React 18

## 背景

`@app-react/react-copilot` 從 React Native 0.74.2 升級至 0.77.3，這是最後一個支援 React 18 的 RN 版本（0.78+ 需要 React 19）。

## 版本對照

| 套件 | 升級前 | 升級後 |
|------|--------|--------|
| react | 18.2.0 | 18.2.0（不變） |
| react-native | 0.74.2 | **0.77.3** |
| react-native-builder-bob | ^0.20.0 | **^0.40.18** |
| @react-native/eslint-config | ^0.73.1 | **^0.77.3** |
| @react-native/babel-preset | — | **0.77.3**（新增） |
| eslint-plugin-ft-flow | — | **^3.0.11**（新增） |
| expo (example) | ~51.0.14 | **~52.0.49** |
| expo-status-bar (example) | ~1.12.1 | **~2.2.3** |
| react-native (example) | 0.74.2 | **0.77.3** |
| 版本號 | 1.0.12 | **1.1.0** |

## Tracer Bullet 執行記錄

### Round 1 — 核心庫編譯通過

**目標**：升級 library 依賴，確認 `yarn prepare` / `typecheck` / `lint` 通過。

**執行結果**：
- `bob build` ✅ — commonjs / module / typescript 三個目標全部產出
- `tsc --noEmit` ✅ — 零錯誤
- `eslint` — 初次失敗，發現兩個問題：
  1. `@react-native/eslint-config` 0.77 新增 `eslint-plugin-ft-flow` 依賴 → 安裝解決
  2. `@react-native/eslint-config` 0.77 不再內建 `eslint-plugin-prettier`，需在 `eslintConfig.plugins` 中明確加入 `"prettier"` → 修改設定解決
  3. `@react-native/babel-preset` 缺失 → 安裝為 devDependency 解決
- 修正後 `eslint` ✅

### Round 2 — 原始碼相容性檢查

**目標**：確認 RN 0.75–0.77 breaking changes 不影響現有程式碼。

**檢查項目**：
- `TouchableOpacity`（`src/native/CopilotItem.tsx`）— 僅用 `onPress`，無 ref/class API → **無需修改**
- `View.measure()`（`src/native/Copilot.tsx`）— 搭配 `collapsable={false}` 使用，取得 `pageX`/`pageY` 絕對座標，New Architecture (Fabric) 下行為一致 → **無需修改**
- `useWindowDimensions`（`src/native/CopilotItem.tsx`）— API 無變動 → **無需修改**
- `getBoundingClientRect`（`src/web/Copilot.tsx`）— 純 DOM API → **無需修改**

**結論**：原始碼零修改即可相容 RN 0.77。

### Round 3 — Example App 升級

**目標**：升級 example app 至 Expo SDK 52 + RN 0.77。

**變更**：
- Expo SDK 51 → 52、expo-status-bar 1.12 → 2.2
- react-native 0.74.2 → 0.77.3
- 移除已廢棄的 `@expo/webpack-config` 和 `babel-loader`（Expo SDK 52 使用 Metro for Web）
- 刪除 `webpack.config.js`
- 更新 `metro.config.js`：
  - `@expo/metro-config` → `expo/metro-config`
  - `blacklistRE` → `blockList`（metro-config API 更名）

### Round 4 — CI 與版本號

**變更**：
- GitHub Actions 升級：`checkout@v3` → `v4`、`setup-node@v3` → `v4`、`cache@v3` → `v4`
- CI web build 指令：`expo export:web` → `expo export --platform web`
- 版本號：`1.0.12` → `1.1.0`

## 風險與後續事項

| 項目 | 狀態 | 說明 |
|------|------|------|
| New Architecture `View.measure()` | 需實機驗證 | 程式碼審查無問題，但建議在 iOS/Android 實機或模擬器上跑 example app 確認高亮定位正確 |
| Example app Web 端 | 需手動驗證 | `yarn example expo start --web` 啟動後確認 Copilot 教學流程正常 |
| 下游專案相容性 | 需通知 | 使用此庫的專案需確認 RN 版本 >= 0.77 |
