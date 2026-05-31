# 🌸 我们的旅行手帖

日系和风可爱的中国地图旅行相册，用照片记录两个人的旅行回忆。

![style](https://img.shields.io/badge/style-春日和-FFB5C2) ![stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-61DAFB)

## ✨ 功能

- 🗺️ **中国地图** —— 省份两态着色，已探索/待探索一目了然
- 📷 **照片上传** —— 拖拽上传，支持标题、描述、日期、分类、标签、评分
- 🔍 **照片灯箱** —— 点击放大查看完整信息
- 📅 **时间线** —— 跨省份按日期浏览所有照片
- 📊 **统计** —— 已探索省份、分类排行、两人贡献对比
- 🔐 **GitHub 登录** —— 两人共用，各自上传互不影响

## 🚀 快速部署自己的相册

### 前置准备

- GitHub 账号
- [Supabase](https://supabase.com) 账号（免费）

### 第一步：Fork 并克隆

点击右上角 **Fork** 按钮，然后：

```bash
git clone https://github.com/你的用户名/photos.git
cd photos
npm install
```

### 第二步：创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com) 登录
2. 点击 **New Project**，随便起个名字
3. 等创建完成后，去 Settings → API，记下 **Project URL** 和 **anon public key**

### 第三步：配置数据库

在 Supabase SQL Editor 中执行 `supabase-setup.sql` 中的全部 SQL。

### 第四步：创建存储桶

1. Supabase → Storage → **New Bucket**
2. Name: `photos`，勾选 **Public bucket**
3. Policies → 添加两条：
   - SELECT：`(true)` —— 允许任何人查看
   - INSERT：`(auth.role() = 'authenticated')` —— 仅登录用户可上传

### 第五步：配置 GitHub 登录

1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**
   - Homepage URL: `https://你的项目名.supabase.co`
   - Callback URL: `https://你的项目名.supabase.co/auth/v1/callback`
2. 拿到 Client ID 和 Client Secret
3. Supabase → Authentication → Providers → GitHub → 打开开关，填入 ID 和 Secret

### 第六步：配置环境变量

创建 `.env` 文件：

```
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon key
```

### 第七步：本地运行

```bash
npm run dev
```

打开 `http://localhost:5173`，用 GitHub 登录即可使用。

### 第八步：部署上线

1. GitHub 仓库 → Settings → Pages → Source 选 **GitHub Actions**
2. 仓库 → Settings → Secrets and variables → Actions → 添加两个 Secret：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. `git push` 到 main 分支，自动部署
4. 访问 `https://你的用户名.github.io/photos/`

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript + Vite |
| 样式 | Tailwind CSS（春日和主题） |
| 地图 | ECharts + 中国 GeoJSON |
| 后端 | Supabase（数据库 + 存储 + 认证） |
| 部署 | GitHub Pages + GitHub Actions |

## 📁 项目结构

```
src/
├── components/      # UI 组件
│   ├── ui/          # 通用组件（Button, Input, Tag, StarRating）
│   ├── MapView.tsx       # 中国地图
│   ├── ProvinceDetail.tsx # 省份详情
│   ├── PhotoCard.tsx     # 照片卡片
│   ├── PhotoLightbox.tsx # 照片灯箱
│   ├── UploadForm.tsx    # 上传表单
│   ├── Timeline.tsx      # 时间线
│   ├── NavBar.tsx        # 底部导航
│   └── AuthGate.tsx      # 登录门禁
├── hooks/           # 数据 hooks（useAuth, usePhotos, useStats）
├── pages/           # 路由页面
├── lib/             # Supabase 客户端
└── types/           # TypeScript 类型
```

## 📝 License

MIT
