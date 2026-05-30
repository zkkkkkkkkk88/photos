# 照片地图系统 · 设计文档

> 2026-05-31 · 日系和风可爱的中国地图旅行相册

---

## 1. 项目概述

一个双人共用的中国地图旅行相册。在中国地图上点击省份进入该省照片列表，支持上传照片并填写详细说明。整体风格采用日系和风可爱设计（春日和配色）。

### 核心用途
- **旅行游记** — 记录去过的地方，按省份整理
- **美食/特产图鉴** — 收集各地美食照片

### 用户
- 两人共用（"我"和"Ta"）
- 通过 GitHub OAuth 登录区分身份

---

## 2. 技术栈

| 层 | 选型 | 理由 |
|----|------|------|
| 前端框架 | React 18 + TypeScript | 生态成熟，Supabase 官方支持最好 |
| 样式 | Tailwind CSS + 自定义日系主题 | 语义化色值，开发效率高 |
| 中国地图 | ECharts + 中国 GeoJSON | 省份点击、hover 高亮、两态着色开箱即用 |
| 路由 | React Router v6 | 三个页面：地图首页、时间线、统计 |
| 服务端状态 | @tanstack/react-query | 自动缓存、自动刷新 |
| 后端 BaaS | Supabase | 数据库 + 文件存储 + GitHub 登录 |
| 文件上传 | react-dropzone | 拖拽上传体验 |
| 部署 | GitHub Pages | 免费静态托管 |

---

## 3. 视觉设计

### 配色方案：🌸 春日和

| 色名 | 色值 | 用途 |
|------|------|------|
| 樱花粉 | `#F4C2C2` | 主色调、按钮、高亮、标签 |
| 抹茶绿 | `#C4D7B2` | 辅助色、成功状态、"想去"标记 |
| 蓝染 | `#A3C4D4` | 点缀色、链接、次要信息 |
| 和纸白 | `#FEF9F3` | 页面背景 |
| 暖灰 | `#E8DDD0` | 边框、分隔线、卡片底色 |
| 深棕 | `#8B7D6D` | 正文文字 |

### 设计关键词
柔和圆角、留白充足、手账感、樱花/花草装饰元素

---

## 4. 页面结构

### 路由

```
/            → HomePage    （中国地图首页）
/timeline    → TimelinePage（全局时间线）
/stats       → StatsPage   （统计页）
```

### 四个页面

#### 🏠 首页 —— 中国地图
- 顶部："我们的旅行手帖"标题 + 已探索 X 省 + 共 N 张照片
- 中部：ECharts 中国地图，省份两态着色（有内容=樱花粉、无内容=浅灰）
- hover 省份显示省份名 + 照片数
- 点击省份 → 侧边栏/浮层展示 ProvinceDetail
- 底部：NavBar 导航（地图 | 时间线 | 统计）

#### 📄 省份详情（ProvinceDetail）
- 省份名 + 照片总数 + 分类统计
- 照片列表（PhotoCard × N）：左侧缩略图 + 右侧标题/日期/标签/评分/上传者
- 点击照片 → PhotoLightbox 灯箱放大
- 底部："+ 添加照片"按钮 → UploadForm

#### 🖼️ 照片灯箱（PhotoLightbox）
- 全屏半透明遮罩 + 居中大图
- 下方：标题、完整描述、标签、星级评分、日期、上传者
- 上传者本人可见"编辑"和"删除"按钮
- 点击遮罩或 X 关闭

#### 📝 上传表单（UploadForm）
- 拖拽上传区（react-dropzone）
- 标题 *（必填）
- 描述（选填）
- 日期 *（必填，默认当天）
- 分类 *（必填，下拉：美食/景点/其他）
- 标签（选填，自由添加）
- 评分（选填，1-5 星点击）
- 省份由当前所在省份自动填入
- 上传者由当前登录用户自动填入

#### 📅 全局时间线
- 跨省份按日期倒序排列所有照片
- 左侧时间轴竖线 + 日期节点
- 每条显示：照片缩略图、标题、所属省份

#### 📊 统计页
- 卡片数字：已探索省份、总照片数、最多分类、我/Ta 贡献比
- 省份照片数排行
- 分类饼图（可选）

---

## 5. 数据模型

### Supabase 表结构

#### profiles（用户表，关联 Supabase Auth）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 关联 auth.users |
| nickname | text | 显示名（我/Ta） |
| avatar_url | text | GitHub 头像 |
| created_at | timestamp | 创建时间 |

#### photos（照片表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 自动生成 |
| user_id | uuid (FK → profiles) | 上传者 |
| province | text | 省份名（如"四川省"） |
| image_url | text | Supabase Storage 公开 URL |
| title | text | 照片标题 |
| description | text | 描述文字 |
| date | date | 照片日期 |
| category | text | 美食 / 景点 / 其他 |
| tags | text[] | 标签数组 |
| rating | int | 1-5 评分 |
| created_at | timestamp | 上传时间 |

### Supabase Storage
- Bucket: `photos`
- 路径规则: `/{省份}/{时间戳}_{文件名}.jpg`
- 权限：登录可读，自己文件可写

---

## 6. 权限规则（RLS）

| 操作 | 规则 |
|------|------|
| 读取照片 | 所有已登录用户 ✅ |
| 读取用户信息 | 所有已登录用户 ✅ |
| 上传/编辑/删除照片 | 仅本人（user_id = auth.uid()） ✅ |
| 读取 Storage 文件 | 所有已登录用户 ✅ |
| 上传/删除 Storage 文件 | 仅本人 ✅ |

---

## 7. 上传流程

```
选择照片 → 本地预览 → 填写信息 → 点击发布
                                    ↓
                    1. 上传文件到 Storage → 获得 public URL
                    2. 写入 photos 表一条记录
                    3. React Query 自动刷新列表
                    4. 返回省份详情页（新照片已在列表中）
```

---

## 8. 组件树

```
App
├── AuthGate（未登录时显示 GitHub 登录按钮）
├── NavBar（底部导航：地图/时间线/统计）
└── Routes
    ├── HomePage
    │   ├── MapView（ECharts 中国地图）
    │   ├── ProvinceDetail（侧边栏/浮层）
    │   │   ├── PhotoCard[]（照片卡片列表）
    │   │   ├── UploadForm（上传表单）
    │   │   └── PhotoLightbox（灯箱放大）
    ├── TimelinePage
    │   └── Timeline（时间线列表）
    │       └── PhotoCard[]
    └── StatsPage
        └── 统计卡片 + 排行榜
```

---

## 9. 边界与范围

### 本期包含
- GitHub 登录（两人）
- 中国地图交互（两态着色 + 点击）
- 省份照片列表 + 灯箱
- 照片上传（含全部字段）
- 全局时间线
- 统计页
- 日系和风 UI

### 本期不包含
- 照片编辑功能（可后续加，数据模型已支持）
- 照片删除功能（可后续加）
- 省/市二级地图下钻
- 评论、点赞
- 照片搜索/筛选
- 导出功能

---

## 10. 项目结构

```
photo2/
├── public/
├── src/
│   ├── components/
│   │   ├── MapView.tsx
│   │   ├── ProvinceDetail.tsx
│   │   ├── PhotoCard.tsx
│   │   ├── PhotoLightbox.tsx
│   │   ├── UploadForm.tsx
│   │   ├── Timeline.tsx
│   │   ├── StatsPage.tsx
│   │   ├── NavBar.tsx
│   │   └── ui/          # 通用 UI 组件
│   ├── hooks/
│   │   ├── usePhotos.ts
│   │   ├── useAuth.ts
│   │   └── useStats.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── TimelinePage.tsx
│   │   └── StatsPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css       # Tailwind + 日系主题
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
