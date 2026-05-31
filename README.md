# 🌙 我们的旅行手帖

暗夜影院风格的中国地图旅行相册，用照片记录两个人的旅行回忆。

![stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-61DAFB) ![style](https://img.shields.io/badge/theme-Dark%20Cinema-0a0a0a)

## ✨ 功能

- 🗺️ **中国地图** —— 省份三阶着色：🟣 1-9 张 / 🟡 10-99 张 / 🔴 100+ 张
- 📷 **照片上传** —— 拖拽上传，支持标题、描述、日期、分类、标签、评分
- 🔍 **照片灯箱** —— 点击放大，查看完整信息与描述
- 📅 **时间线** —— 跨省份按日期浏览所有照片
- 📊 **统计** —— 已探索省份、分类排行、两人贡献对比
- 🏷️ **分类筛选** —— 省份内按分类筛选 + 统计页全局分类查看
- 🎬 **视频背景** —— 支持上传多段视频作为背景，一键切换
- 🔐 **GitHub 登录** —— 两人共用，各自上传互不影响

---

## 🚀 从零部署自己的相册（约10分钟）

### 你需要准备

- 一个 GitHub 账号
- 一个 [Supabase](https://supabase.com) 账号（免费额度完全够用）
- 一个能运行命令行的电脑（Windows/Mac/Linux 都行）

---

### 第一步：Fork 仓库

点击本仓库右上角 **Fork** 按钮，复制一份到你的账号下。

```bash
# 克隆你的 fork 到本地
git clone https://github.com/你的用户名/photos.git
cd photos
npm install
```

---

### 第二步：创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com)，用 GitHub 账号登录
2. 点击 **New project**，填写：
   - Name：随便起（如 `photo-map`）
   - Database Password：设一个密码并**记下来**
   - Region：选离你最近的（亚洲选 Tokyo 或 Singapore）
3. 等待 1-2 分钟创建完成
4. 进入 Settings → API，记下两个值：
   - **Project URL**（类似 `https://xxxxx.supabase.co`）
   - **anon public key**（以 `sb_publishable_` 开头）

---

### 第三步：初始化数据库

1. 在 Supabase 左侧菜单进入 **SQL Editor**
2. 点击 **New query**
3. 把本仓库 `supabase-setup.sql` 文件的**全部内容**粘贴进去
4. 点击 **Run**，看到绿色 "Success" 即可

这会自动创建 `profiles` 表、`photos` 表、触发器、索引、以及全套 RLS 权限策略。

---

### 第四步：创建图片存储

1. Supabase → **Storage** → **New bucket**
2. Name 填 `photos`，**勾选 Public bucket**
3. 创建后，进入该 bucket → **Policies** → 添加两条策略：

| 操作 | Policy 表达式 | 说明 |
|------|-------------|------|
| SELECT | `(true)` | 允许任何人查看照片 |
| INSERT | `(auth.role() = 'authenticated')` | 仅登录用户可上传 |

> 如果之前已有旧的策略，先全部删除再添加新的。

---

### 第五步：配置 GitHub 登录

#### 5a. 在 GitHub 创建 OAuth App

1. 打开 [github.com/settings/developers](https://github.com/settings/developers)
2. 点击 **New OAuth App**，填写：

| 字段 | 值 |
|------|-----|
| Application name | 随便（如"我的旅行相册"） |
| Homepage URL | `https://你的项目.supabase.co` |
| Authorization callback URL | `https://你的项目.supabase.co/auth/v1/callback` |

3. 点击 **Register application**
4. 点击 **Generate a new client secret**，记下 **Client ID** 和 **Client Secret**

#### 5b. 在 Supabase 启用 GitHub 登录

1. Supabase → **Authentication** → **Providers** → 找到 **GitHub**
2. 打开开关，填入上面拿到的 Client ID 和 Client Secret
3. 点击 **Save**

---

### 第六步：配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_key
```

> ⚠️ `.env` 文件包含密钥，已在 `.gitignore` 中，不会被提交到 GitHub。

---

### 第七步：本地测试

```bash
npm run dev
```

打开 `http://localhost:5173`，点击 **GitHub 账号登录**，授权后应该能看到中国地图。尝试上传一张照片测试完整流程。

---

### 第八步：部署上线

#### 8a. 设置 GitHub Secrets

打开你的仓库 → **Settings** → **Secrets and variables** → **Actions**，添加两个 **Repository secret**：

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://你的项目.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | 你的 anon key |

#### 8b. 启用 GitHub Pages

仓库 → **Settings** → **Pages**：
- Source 选 **GitHub Actions**
- 保存

#### 8c. 推送代码

```bash
git add .
git commit -m "初始化部署"
git push
```

推送后，GitHub Actions 会自动构建并部署。打开仓库的 **Actions** 标签页查看进度，变绿 ✅ 后访问：

```
https://你的用户名.github.io/photos/
```

#### 8d. 配置 Supabase 回调地址

Supabase → **Authentication** → **URL Configuration**：

- **Site URL**：`https://你的用户名.github.io/photos/`
- **Redirect URLs**：添加 `https://你的用户名.github.io/photos/`

保存。至此部署完成！

---

## 🎬 自定义视频背景

把 `.mp4` 视频文件放入 `public/videos/` 目录：

```
public/videos/
├── 1.mp4    ← 视频1
├── 2.mp4    ← 视频2
├── 3.mp4    ← 视频3
└── ...
```

然后编辑 `src/components/BackgroundVideo.tsx` 中的 `VIDEOS` 数组：

```ts
const VIDEOS = [
  { file: '1.mp4', label: '🗻 富士山' },
  { file: '2.mp4', label: '🌅 夕阳' },
  { file: '3.mp4', label: '🌸 蜜璃' },
];
```

重新推送即可生效。

---

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript + Vite |
| 样式 | Tailwind CSS（暗夜影院主题） |
| 地图 | ECharts + 中国 GeoJSON |
| 后端 | Supabase（PostgreSQL + Storage + Auth） |
| 部署 | GitHub Pages + GitHub Actions |

---

## 📁 项目结构

```
src/
├── components/
│   ├── ui/              # Button, Input, Tag, StarRating
│   ├── AuthGate.tsx      # GitHub 登录门禁
│   ├── BackgroundVideo.tsx # 视频背景 + 切换
│   ├── MapView.tsx       # ECharts 中国地图
│   ├── NavBar.tsx        # 底部导航
│   ├── PhotoCard.tsx     # 照片卡片
│   ├── PhotoLightbox.tsx # 照片灯箱
│   ├── ProvinceDetail.tsx # 省份详情（含分类筛选）
│   ├── Timeline.tsx      # 全局时间线
│   └── UploadForm.tsx    # 照片上传表单
├── hooks/               # useAuth, usePhotos, useStats
├── pages/               # HomePage, TimelinePage, StatsPage
├── lib/                 # Supabase 客户端
└── types/               # TypeScript 类型定义
```

---

## ❓ 常见问题

**Q: 邮箱确认链接打不开？**
Supabase 的确认邮件链接需要翻墙点击一次。如果不想翻墙，可以在 Supabase → Authentication → Providers → Email 中关闭 "Confirm email"（会降低安全性，但两人用的场景足够）。

**Q: 上传照片失败（400 错误）？**
检查 Storage bucket 是否设为 **Public**，以及 SELECT/INSERT 策略是否正确添加。

**Q: 登录后跳转 404？**
检查 Supabase → Authentication → URL Configuration → Redirect URLs 是否包含 `https://你的用户名.github.io/photos/`。

**Q: 地图加载不出来？**
检查 `public/china.json` 文件是否存在。如果 GitHub Pages 加载慢，可以改回 CDN 加载。

## 📝 License

MIT
