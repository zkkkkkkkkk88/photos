# 照片地图系统 · 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个日系和风可爱的中国地图旅行相册，两人可通过 GitHub 登录共用，按省份浏览和上传照片。

**Architecture:** React 18 + TypeScript 前端，ECharts 渲染中国地图，Tailwind CSS 定制日系主题，Supabase 提供数据库/存储/认证，React Router 管理三页面路由，React Query 管理服务端状态。

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v3, ECharts v5, React Router v6, @tanstack/react-query v5, @supabase/supabase-js, react-dropzone

---

## 文件结构总览

```
photo2/
├── public/
├── src/
│   ├── components/
│   │   ├── MapView.tsx          # ECharts 中国地图
│   │   ├── ProvinceDetail.tsx   # 省份照片列表
│   │   ├── PhotoCard.tsx        # 单张照片卡片
│   │   ├── PhotoLightbox.tsx    # 照片灯箱（放大）
│   │   ├── UploadForm.tsx       # 上传表单
│   │   ├── Timeline.tsx         # 时间线
│   │   ├── NavBar.tsx           # 底部导航
│   │   ├── AuthGate.tsx         # 登录门禁
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Tag.tsx
│   │       └── StarRating.tsx
│   ├── hooks/
│   │   ├── useAuth.ts           # 认证 hook
│   │   ├── usePhotos.ts         # 照片 CRUD hook
│   │   └── useStats.ts          # 统计 hook
│   ├── lib/
│   │   └── supabase.ts          # Supabase 客户端
│   ├── types/
│   │   └── index.ts             # TypeScript 类型定义
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── TimelinePage.tsx
│   │   └── StatsPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
└── package.json
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `postcss.config.js`, `tailwind.config.ts`

- [ ] **Step 1: 创建 Vite + React + TypeScript 项目**

```bash
cd d:/CODE/vscode/xingmu/front/photo2
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: 安装依赖**

```bash
npm install
npm install tailwindcss@3 postcss autoprefixer @tailwindcss/forms react-router-dom @tanstack/react-query @supabase/supabase-js echarts echarts-for-react react-dropzone
npm install -D @types/react-dropzone
```

- [ ] **Step 3: 初始化 Tailwind CSS**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: 配置 Tailwind 主题** —— 覆写 `tailwind.config.ts`

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: '#F4C2C2',
        'sakura-light': '#FFF5F5',
        matcha: '#C4D7B2',
        'matcha-light': '#F0F7EC',
        ai: '#A3C4D4',
        'ai-light': '#EEF4F7',
        washi: '#FEF9F3',
        warm: '#E8DDD0',
        ink: '#8B7D6D',
        'ink-light': '#B0A090',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
```

- [ ] **Step 5: 写入 `src/index.css`** —— 替换默认内容

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');

@layer base {
  body {
    @apply bg-washi text-ink font-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-warm p-4;
  }
  .btn-primary {
    @apply bg-sakura text-white rounded-full px-6 py-2.5 font-medium
           hover:brightness-105 active:brightness-95 transition-all
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-ghost {
    @apply text-ink-light hover:text-ink border border-warm rounded-full px-4 py-2
           transition-colors;
  }
  .input-field {
    @apply w-full bg-washi border border-warm rounded-xl px-4 py-2.5
           text-ink placeholder:text-ink-light/60
           focus:outline-none focus:ring-2 focus:ring-sakura/40 focus:border-sakura
           transition-all;
  }
}
```

- [ ] **Step 6: 验证脚手架**

```bash
npm run dev
```

打开浏览器确认 Vite + React 页面正常显示，Tailwind 样式生效。

---

### Task 2: TypeScript 类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 写入类型定义**

```typescript
// src/types/index.ts

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  user_id: string;
  province: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
  category: '美食' | '景点' | '其他';
  tags: string[];
  rating: number;
  created_at: string;
  profile?: Profile;
}

export type ProvinceStats = {
  province: string;
  count: number;
};

export type CategoryStats = {
  category: string;
  count: number;
};

export interface Stats {
  totalProvinces: number;
  totalPhotos: number;
  topCategory: string;
  myCount: number;
  taCount: number;
  provinceRanking: ProvinceStats[];
}

export type NewPhoto = Omit<Photo, 'id' | 'created_at' | 'profile' | 'image_url'> & {
  image_url?: string;
};
```

- [ ] **Step 2: 确认编译无报错**

```bash
npx tsc --noEmit
```

---

### Task 3: Supabase 客户端 + 后端初始化

**Files:**
- Create: `src/lib/supabase.ts`, `.env`

- [ ] **Step 1: 创建环境变量文件**

```bash
# .env (不提交到 Git)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 2: 创建 Supabase 客户端**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
```

- [ ] **Step 3: 在 Supabase Dashboard 中执行 SQL（手动操作，不在代码仓库中）**

在 Supabase SQL Editor 中运行以下 SQL 初始化脚本：

```sql
-- 1. 创建 profiles 表
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL DEFAULT '新用户',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'user_name', '新用户'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. 创建 photos 表
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  province TEXT NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL CHECK (category IN ('美食', '景点', '其他')),
  tags TEXT[] DEFAULT '{}',
  rating INT DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. RLS: profiles 登录用户可读，本人可写
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. RLS: photos 登录可读，本人可写
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_read" ON public.photos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "photos_insert" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photos_update" ON public.photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "photos_delete" ON public.photos
  FOR DELETE USING (auth.uid() = user_id);

-- 6. 创建索引
CREATE INDEX idx_photos_province ON public.photos(province);
CREATE INDEX idx_photos_user_id ON public.photos(user_id);
CREATE INDEX idx_photos_date ON public.photos(date DESC);

-- 7. 启用 Supabase Realtime (可选，用于实时更新)
ALTER PUBLICATION supabase_realtime ADD TABLE public.photos;
```

- [ ] **Step 4: 在 Supabase Dashboard 创建 Storage Bucket**

在 Supabase → Storage → New Bucket:
- Name: `photos`
- Public bucket: OFF（通过 Supabase URL 访问，由 RLS 控制权限）

然后在 Storage → Policies 中为 `photos` bucket 添加策略：

```sql
-- Storage 读取策略（登录用户可读）
CREATE POLICY "storage_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'photos' AND auth.role() = 'authenticated'
  );

-- Storage 上传策略（仅本人）
CREATE POLICY "storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

- [ ] **Step 5: 在 Supabase Dashboard 启用 GitHub OAuth**

在 Authentication → Providers → GitHub:
- 启用 GitHub provider
- 填入 GitHub OAuth App 的 Client ID 和 Client Secret
- Redirect URL: `https://<project>.supabase.co/auth/v1/callback`

---

### Task 4: UI 基础组件

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Tag.tsx`, `src/components/ui/StarRating.tsx`

- [ ] **Step 1: Button 组件**

```typescript
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Input 组件**

```typescript
// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-ink-light font-medium">{label}</label>}
      <input ref={ref} className={`input-field ${className}`} {...props} />
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
```

- [ ] **Step 3: Tag 组件**

```typescript
// src/components/ui/Tag.tsx
interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
}

export default function Tag({ label, onRemove, color = 'bg-sakura text-white' }: TagProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label.startsWith('#') ? label : `#${label}`}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70">&times;</button>
      )}
    </span>
  );
}
```

- [ ] **Step 4: StarRating 组件**

```typescript
// src/components/ui/StarRating.tsx
interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-xl transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${star <= value ? 'text-sakura' : 'text-warm'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 5: useAuth Hook + AuthGate 组件

**Files:**
- Create: `src/hooks/useAuth.ts`, `src/components/AuthGate.tsx`

- [ ] **Step 1: 实现 useAuth hook**

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取初始 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  async function signInWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return { user, profile, loading, signInWithGitHub, signOut };
}
```

- [ ] **Step 2: 实现 AuthGate 组件**

```typescript
// src/components/AuthGate.tsx
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithGitHub } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-washi">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-sakura border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-light text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-washi to-sakura-light">
        <div className="text-center space-y-8 max-w-sm mx-auto p-8">
          {/* Logo 区域 */}
          <div className="space-y-4">
            <div className="text-6xl">🌸</div>
            <h1 className="text-3xl font-serif font-bold text-ink">我们的旅行手帖</h1>
            <p className="text-ink-light text-sm leading-relaxed">
              用照片记录两个人的旅行回忆<br />
              每一张都是独一无二的故事
            </p>
          </div>

          {/* 装饰分隔线 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-warm" />
            <span className="text-warm text-xs">登录方式</span>
            <div className="flex-1 h-px bg-warm" />
          </div>

          {/* GitHub 登录按钮 */}
          <Button variant="primary" onClick={signInWithGitHub} className="w-full py-3 text-base">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub 账号登录
            </span>
          </Button>

          <p className="text-ink-light/50 text-[11px]">
            登录即表示同意仅限两人使用的约定 🤝
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 3: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 6: NavBar 底部导航

**Files:**
- Create: `src/components/NavBar.tsx`

- [ ] **Step 1: 实现 NavBar**

```typescript
// src/components/NavBar.tsx
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '🗺️', label: '地图' },
  { to: '/timeline', icon: '📅', label: '时间线' },
  { to: '/stats', icon: '📊', label: '统计' },
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-warm safe-area-bottom z-40">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-sakura bg-sakura-light'
                  : 'text-ink-light hover:text-ink'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 7: usePhotos Hook

**Files:**
- Create: `src/hooks/usePhotos.ts`

- [ ] **Step 1: 实现 usePhotos hook**

```typescript
// src/hooks/usePhotos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Photo, NewPhoto } from '../types';
import { useAuth } from './useAuth';

// 获取某省份的所有照片
export function useProvincePhotos(province: string | null) {
  return useQuery({
    queryKey: ['photos', 'province', province],
    queryFn: async (): Promise<Photo[]> => {
      if (!province) return [];
      const { data, error } = await supabase
        .from('photos')
        .select('*, profile:profiles(*)')
        .eq('province', province)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
    enabled: !!province,
  });
}

// 获取所有照片（用于时间线和统计）
export function useAllPhotos() {
  return useQuery({
    queryKey: ['photos', 'all'],
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await supabase
        .from('photos')
        .select('*, profile:profiles(*)')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
  });
}

// 上传照片
export function useUploadPhoto() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      photo,
    }: {
      file: File;
      photo: NewPhoto;
    }) => {
      if (!user) throw new Error('未登录');

      // 1. 上传文件到 Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${photo.province}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. 获取公开 URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // 3. 写入数据库
      const { data, error } = await supabase
        .from('photos')
        .insert({
          ...photo,
          image_url: urlData.publicUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

// 删除照片
export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: Photo) => {
      // 从 URL 提取文件路径
      const url = new URL(photo.image_url);
      const filePath = url.pathname.split('/storage/v1/object/public/photos/')[1];
      if (filePath) {
        await supabase.storage.from('photos').remove([filePath]);
      }
      const { error } = await supabase.from('photos').delete().eq('id', photo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 8: PhotoCard 组件

**Files:**
- Create: `src/components/PhotoCard.tsx`

- [ ] **Step 1: 实现 PhotoCard**

```typescript
// src/components/PhotoCard.tsx
import type { Photo } from '../types';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';
import { useAuth } from '../hooks/useAuth';
import { useDeletePhoto } from '../hooks/usePhotos';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
}

const categoryIcons: Record<string, string> = {
  '美食': '🍜',
  '景点': '🏔️',
  '其他': '📷',
};

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const { user } = useAuth();
  const deletePhoto = useDeletePhoto();
  const isOwner = user?.id === photo.user_id;

  return (
    <div
      onClick={() => onClick(photo)}
      className="flex gap-3 p-3 bg-white rounded-xl border border-warm cursor-pointer
                 hover:shadow-md hover:border-sakura/30 transition-all group"
    >
      {/* 缩略图 */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-warm">
        <img
          src={photo.image_url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>

      {/* 信息区 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{categoryIcons[photo.category] || '📷'}</span>
            <h4 className="font-medium text-sm text-ink truncate">{photo.title}</h4>
          </div>
          <p className="text-[11px] text-ink-light mt-0.5 truncate">{photo.description || '暂无描述'}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-1">
          {photo.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {photo.tags.slice(0, 2).map((tag) => (
                <Tag key={tag} label={tag} color="bg-sakura-light text-sakura" />
              ))}
              {photo.tags.length > 2 && (
                <span className="text-[10px] text-ink-light">+{photo.tags.length - 2}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <StarRating value={photo.rating} readonly />
            <span className="text-[10px] text-ink-light">
              {photo.date} · {photo.profile?.nickname || '未知'}
            </span>
          </div>
        </div>
      </div>

      {/* 删除按钮（仅本人可见） */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('确定删除这张照片吗？')) {
              deletePhoto.mutate(photo);
            }
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity self-start
                     text-ink-light hover:text-red-400 text-sm p-1"
          title="删除"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 9: PhotoLightbox 组件

**Files:**
- Create: `src/components/PhotoLightbox.tsx`

- [ ] **Step 1: 实现 PhotoLightbox**

```typescript
// src/components/PhotoLightbox.tsx
import { useEffect } from 'react';
import type { Photo } from '../types';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // 阻止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10"
        >
          ✕
        </button>

        {/* 大图 */}
        <div className="aspect-[4/3] bg-warm rounded-t-2xl overflow-hidden">
          <img
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-full object-contain bg-black/5"
          />
        </div>

        {/* 信息区 */}
        <div className="p-5 space-y-3">
          <h2 className="text-lg font-bold text-ink">{photo.title}</h2>

          {photo.description && (
            <p className="text-sm text-ink-light leading-relaxed">{photo.description}</p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <StarRating value={photo.rating} readonly />
            <span className="text-sm text-ink-light">
              {photo.profile?.nickname || '未知'} · {photo.date}
            </span>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <span className="bg-sakura text-white px-2.5 py-0.5 rounded-full text-xs">
              {{ '美食': '🍜', '景点': '🏔️', '其他': '📷' }[photo.category]} {photo.category}
            </span>
            {photo.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 10: UploadForm 组件

**Files:**
- Create: `src/components/UploadForm.tsx`

- [ ] **Step 1: 实现 UploadForm**

```typescript
// src/components/UploadForm.tsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadPhoto } from '../hooks/usePhotos';
import Button from './ui/Button';
import Tag from './ui/Tag';
import StarRating from './ui/StarRating';

interface UploadFormProps {
  province: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UploadForm({ province, onSuccess, onCancel }: UploadFormProps) {
  const uploadPhoto = useUploadPhoto();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<'美食' | '景点' | '其他'>('美食');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [rating, setRating] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  function addTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim() || !date || !category) return;

    uploadPhoto.mutate(
      {
        file,
        photo: {
          user_id: '', // hook 内部填充
          province,
          title: title.trim(),
          description: description.trim(),
          date,
          category,
          tags,
          rating,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-bold text-ink text-center">
        🌸 添加照片 · {province}
      </h3>

      {/* 拖拽上传区 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-sakura bg-sakura-light scale-[1.02]' : 'border-warm hover:border-sakura/50 bg-washi'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="预览" className="max-h-48 mx-auto rounded-lg" />
        ) : (
          <div className="space-y-2">
            <div className="text-3xl">📷</div>
            <p className="text-sm text-ink-light">
              {isDragActive ? '松手即可上传' : '拖拽照片到这里，或点击选择'}
            </p>
            <p className="text-[11px] text-ink-light/50">支持 JPG/PNG/WebP，最大 10MB</p>
          </div>
        )}
      </div>

      {/* 标题 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">标题 *</label>
        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="给这张照片起个名字..."
          required
        />
      </div>

      {/* 描述 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">描述</label>
        <textarea
          className="input-field resize-none h-20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="写下此刻的心情..."
        />
      </div>

      {/* 日期 + 分类 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-light font-medium">日期 *</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-light font-medium">分类 *</label>
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value as '美食' | '景点' | '其他')}
          >
            <option value="美食">🍜 美食</option>
            <option value="景点">🏔️ 景点</option>
            <option value="其他">📷 其他</option>
          </select>
        </div>
      </div>

      {/* 标签 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">标签</label>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag(); }
            }}
            placeholder="输入标签后按回车..."
          />
          <Button type="button" variant="ghost" onClick={addTag}>添加</Button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
        )}
      </div>

      {/* 评分 */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink-light font-medium">评分</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          取消
        </Button>
        <Button
          type="submit"
          disabled={!file || !title.trim() || uploadPhoto.isPending}
          className="flex-1"
        >
          {uploadPhoto.isPending ? '上传中...' : '🌸 发布'}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 11: MapView —— ECharts 中国地图

**Files:**
- Create: `src/components/MapView.tsx`

- [ ] **Step 1: 实现 MapView**

```typescript
// src/components/MapView.tsx
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { ProvinceStats } from '../types';

interface MapViewProps {
  provinceStats: ProvinceStats[];
  onProvinceClick: (provinceName: string) => void;
  onProvinceHover?: (provinceName: string | null) => void;
}

// 省份名简写到全称的映射（ECharts 注册的 map 用中文全称）
const PROVINCE_NAMES = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
  '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
  '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
  '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区',
];

export default function MapView({ provinceStats, onProvinceClick, onProvinceHover }: MapViewProps) {
  const [mapGeoJSON, setMapGeoJSON] = useState<any>(null);

  useEffect(() => {
    // 从 DataV GeoAtlas 加载中国 GeoJSON 并注册到 ECharts
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then((res) => res.json())
      .then((geo) => {
        echarts.registerMap('china', geo);
        setMapGeoJSON(geo);
      })
      .catch(console.error);
  }, []);

  if (!mapGeoJSON) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-ink-light text-sm">地图加载中...</div>
      </div>
    );
  }

  // 构建省份数据映射
  const statsMap = new Map(provinceStats.map((s) => [s.province, s.count]));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const count = statsMap.get(params.name) || 0;
        return count > 0
          ? `🌸 <b>${params.name}</b><br/>📸 ${count} 张照片`
          : `🤍 <b>${params.name}</b><br/>暂无照片`;
      },
      backgroundColor: '#fff',
      borderColor: '#E8DDD0',
      textStyle: { color: '#8B7D6D', fontSize: 12 },
    },
    visualMap: {
      min: 0,
      max: Math.max(1, ...provinceStats.map((s) => s.count)),
      inRange: {
        color: ['#F5EDE3', '#FDE8E8', '#F9C5C5', '#F4C2C2', '#E8A8A8'],
      },
      calculable: false,
      show: false, // 不显示 visualMap 控制器，保持简洁
    },
    series: [
      {
        type: 'map',
        map: 'china',
        aspectScale: 0.85,
        roam: false, // 禁用缩放，保持整洁
        label: {
          show: true,
          color: '#B0A090',
          fontSize: 9,
          fontFamily: '"Noto Sans SC", sans-serif',
        },
        emphasis: {
          label: {
            show: true,
            color: '#8B7D6D',
            fontSize: 12,
            fontWeight: 'bold',
          },
          itemStyle: {
            areaColor: '#FFF5F5',
            borderColor: '#F4C2C2',
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: 'rgba(244, 194, 194, 0.3)',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1.5,
          areaColor: '#F5EDE3',
        },
        data: provinceStats.map((s) => ({
          name: s.province,
          value: s.count,
        })),
      },
    ],
  };

  const onEvents = {
    click: (params: any) => {
      if (params.name) {
        onProvinceClick(params.name);
      }
    },
    mouseover: (params: any) => {
      onProvinceHover?.(params.name || null);
    },
    mouseout: () => {
      onProvinceHover?.(null);
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-warm overflow-hidden shadow-sm">
      <ReactECharts
        option={option}
        style={{ height: '50vh', minHeight: '380px' }}
        onEvents={onEvents}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
```


- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 12: ProvinceDetail 组件

**Files:**
- Create: `src/components/ProvinceDetail.tsx`

- [ ] **Step 1: 实现 ProvinceDetail**

```typescript
// src/components/ProvinceDetail.tsx
import { useState } from 'react';
import { useProvincePhotos } from '../hooks/usePhotos';
import PhotoCard from './PhotoCard';
import PhotoLightbox from './PhotoLightbox';
import UploadForm from './UploadForm';
import Button from './ui/Button';
import type { Photo } from '../types';

interface ProvinceDetailProps {
  province: string;
  onBack: () => void;
}

export default function ProvinceDetail({ province, onBack }: ProvinceDetailProps) {
  const { data: photos, isLoading, error } = useProvincePhotos(province);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const categoryCounts = photos?.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-washi pb-20">
      {/* 顶部 */}
      <div className="sticky top-0 bg-washi/90 backdrop-blur-sm border-b border-warm z-30">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="text-ink-light hover:text-ink text-sm flex items-center gap-1">
              ← 返回地图
            </button>
          </div>
          <h2 className="text-xl font-serif font-bold text-ink">🌸 {province}</h2>
          {photos && (
            <p className="text-xs text-ink-light mt-1">
              {photos.length} 张照片
              {categoryCounts && Object.entries(categoryCounts).map(([cat, count]) => (
                <span key={cat} className="ml-2">
                  {{ '美食': '🍜', '景点': '🏔️', '其他': '📷' }[cat]} {count}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {isLoading && (
          <div className="text-center py-12 text-ink-light">加载中...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-400">加载失败，请重试</div>
        )}

        {photos && photos.length === 0 && !showUpload && (
          <div className="text-center py-16 space-y-4">
            <div className="text-5xl">🏔️</div>
            <p className="text-ink-light">这里还没有照片</p>
            <p className="text-xs text-ink-light/60">成为第一个记录的人吧</p>
            <Button onClick={() => setShowUpload(true)}>+ 添加第一张照片</Button>
          </div>
        )}

        {photos && photos.length > 0 && (
          <div className="space-y-2">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={setSelectedPhoto}
              />
            ))}
          </div>
        )}

        {/* 添加按钮 */}
        {photos && photos.length > 0 && !showUpload && (
          <div className="text-center py-8">
            <Button onClick={() => setShowUpload(true)}>+ 添加照片</Button>
          </div>
        )}

        {/* 上传表单 */}
        {showUpload && (
          <div className="card mt-4 mb-8">
            <UploadForm
              province={province}
              onSuccess={() => setShowUpload(false)}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        )}
      </div>

      {/* 灯箱 */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 13: HomePage 页面

**Files:**
- Create: `src/pages/HomePage.tsx`

- [ ] **Step 1: 实现 HomePage**

```typescript
// src/pages/HomePage.tsx
import { useState, useMemo } from 'react';
import MapView from '../components/MapView';
import ProvinceDetail from '../components/ProvinceDetail';
import { useAllPhotos } from '../hooks/usePhotos';
import type { ProvinceStats } from '../types';

export default function HomePage() {
  const { data: photos } = useAllPhotos();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // 从 photos 计算省份统计
  const provinceStats = useMemo((): ProvinceStats[] => {
    if (!photos) return [];
    const counts = new Map<string, number>();
    photos.forEach((p) => {
      counts.set(p.province, (counts.get(p.province) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([province, count]) => ({
      province,
      count,
    }));
  }, [photos]);

  const totalPhotos = photos?.length || 0;
  const totalProvinces = provinceStats.length;

  if (selectedProvince) {
    return (
      <ProvinceDetail
        province={selectedProvince}
        onBack={() => setSelectedProvince(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-washi pb-20">
      {/* 顶部标题 */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-2 text-center">
        <h1 className="text-2xl font-serif font-bold text-ink">🍥 我们的旅行手帖</h1>
        <p className="text-xs text-ink-light mt-1 space-x-3">
          <span>🎀 已探索 <b className="text-sakura">{totalProvinces}</b> 省</span>
          <span>📸 共 <b className="text-sakura">{totalPhotos}</b> 张</span>
        </p>
      </div>

      {/* 地图区 */}
      <div className="max-w-lg mx-auto px-2 pt-2">
        <MapView
          provinceStats={provinceStats}
          onProvinceClick={(name) => setSelectedProvince(name)}
          onProvinceHover={setHoveredProvince}
        />
      </div>

      {/* hover 提示 */}
      {hoveredProvince && (
        <div className="max-w-lg mx-auto px-4 mt-2 text-center">
          <span className="inline-block bg-white border border-sakura rounded-full px-4 py-1.5 text-sm text-sakura">
            🌸 {hoveredProvince}
            {provinceStats.find((s) => s.province === hoveredProvince)
              ? ` — ${provinceStats.find((s) => s.province === hoveredProvince)!.count} 张`
              : ' — 暂无照片'}
          </span>
        </div>
      )}

      {/* 提示文字 */}
      <div className="max-w-lg mx-auto px-4 mt-4 text-center">
        <p className="text-[11px] text-ink-light/60">点击省份查看照片</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 14: Timeline 组件 + TimelinePage

**Files:**
- Create: `src/components/Timeline.tsx`, `src/pages/TimelinePage.tsx`

- [ ] **Step 1: 实现 Timeline 组件**

```typescript
// src/components/Timeline.tsx
import { useMemo, useState } from 'react';
import { useAllPhotos } from '../hooks/usePhotos';
import PhotoCard from './PhotoCard';
import PhotoLightbox from './PhotoLightbox';
import type { Photo } from '../types';

export default function Timeline() {
  const { data: photos, isLoading, error } = useAllPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // 按日期分组，日期降序
  const grouped = useMemo(() => {
    if (!photos) return [];
    const groups = new Map<string, Photo[]>();
    photos.forEach((p) => {
      const d = p.date;
      if (!groups.has(d)) groups.set(d, []);
      groups.get(d)!.push(p);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [photos]);

  if (isLoading) {
    return <div className="text-center py-12 text-ink-light">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-400">加载失败</div>;
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">📅</div>
        <p className="text-ink-light">还没有照片记录</p>
        <p className="text-xs text-ink-light/60">回到地图添加第一张照片吧</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative pl-6">
        {/* 时间轴竖线 */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-sakura/20" />

        <div className="space-y-6">
          {grouped.map(([date, items]) => (
            <div key={date} className="relative">
              {/* 日期节点 */}
              <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-sakura border-2 border-white shadow-sm" />
              <h3 className="text-sm font-bold text-sakura mb-2">{date}</h3>
              <div className="space-y-2">
                {items.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onClick={setSelectedPhoto}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: 实现 TimelinePage**

```typescript
// src/pages/TimelinePage.tsx
import Timeline from '../components/Timeline';

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-washi pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif font-bold text-ink text-center">📅 旅行时间线</h1>
        <p className="text-xs text-ink-light text-center mt-1">跨省份按日期浏览</p>
      </div>
      <div className="max-w-lg mx-auto px-4 pt-4">
        <Timeline />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 15: useStats Hook + StatsPage

**Files:**
- Create: `src/hooks/useStats.ts`, `src/pages/StatsPage.tsx`

- [ ] **Step 1: 实现 useStats hook**

```typescript
// src/hooks/useStats.ts
import { useMemo } from 'react';
import { useAllPhotos } from './usePhotos';
import { useAuth } from './useAuth';
import type { Stats, ProvinceStats } from '../types';

export function useStats() {
  const { data: photos } = useAllPhotos();
  const { user } = useAuth();

  return useMemo((): Stats | null => {
    if (!photos) return null;

    // 省份统计
    const provinceMap = new Map<string, number>();
    // 分类统计
    const categoryMap = new Map<string, number>();
    // 用户统计
    let myCount = 0;
    let taCount = 0;

    photos.forEach((p) => {
      provinceMap.set(p.province, (provinceMap.get(p.province) || 0) + 1);
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
      if (user && p.user_id === user.id) {
        myCount++;
      } else {
        taCount++;
      }
    });

    const provinceRanking: ProvinceStats[] = Array.from(provinceMap.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count);

    const topCategory = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '暂无';

    return {
      totalProvinces: provinceMap.size,
      totalPhotos: photos.length,
      topCategory,
      myCount,
      taCount,
      provinceRanking,
    };
  }, [photos, user]);
}
```

- [ ] **Step 2: 实现 StatsPage**

```typescript
// src/pages/StatsPage.tsx
import { useStats } from '../hooks/useStats';

const categoryIcons: Record<string, string> = {
  '美食': '🍜',
  '景点': '🏔️',
  '其他': '📷',
};

export default function StatsPage() {
  const stats = useStats();

  if (!stats) {
    return (
      <div className="min-h-screen bg-washi flex items-center justify-center">
        <p className="text-ink-light">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-washi pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif font-bold text-ink text-center">📊 旅行统计</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* 数据卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center space-y-1">
            <div className="text-3xl font-bold text-sakura">{stats.totalProvinces}</div>
            <div className="text-xs text-ink-light">🎀 已探索省份</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-3xl font-bold text-sakura">{stats.totalPhotos}</div>
            <div className="text-xs text-ink-light">📸 总照片数</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-2xl">
              {categoryIcons[stats.topCategory]} {stats.topCategory}
            </div>
            <div className="text-xs text-ink-light">🏆 照片最多分类</div>
          </div>
          <div className="card text-center space-y-1">
            <div className="text-xl font-bold text-sakura">
              {stats.totalPhotos > 0
                ? `${stats.myCount} / ${stats.taCount}`
                : '暂无'}
            </div>
            <div className="text-xs text-ink-light">👤 我 / Ta 贡献</div>
          </div>
        </div>

        {/* 省份排行 */}
        <div className="card">
          <h3 className="text-sm font-bold text-ink mb-3">🗺️ 省份照片排行</h3>
          {stats.provinceRanking.length === 0 ? (
            <p className="text-xs text-ink-light text-center py-4">暂无数据</p>
          ) : (
            <div className="space-y-2">
              {stats.provinceRanking.map((p, i) => (
                <div key={p.province} className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-5 ${
                    i < 3 ? 'text-sakura' : 'text-ink-light'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <span className="flex-1 text-sm text-ink">{p.province}</span>
                  <span className="text-xs text-ink-light">{p.count} 张</span>
                  <div className="w-24 h-1.5 bg-warm rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sakura rounded-full transition-all"
                      style={{
                        width: `${(p.count / stats.provinceRanking[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 确认编译**

```bash
npx tsc --noEmit
```

---

### Task 16: App.tsx + main.tsx + React Query 配置

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: 覆写 main.tsx**

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 分钟内不重新请求
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

- [ ] **Step 2: 覆写 App.tsx**

```typescript
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <AuthGate>
      <div className="max-w-lg mx-auto relative min-h-screen bg-washi">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
        <NavBar />
      </div>
    </AuthGate>
  );
}
```

- [ ] **Step 3: 更新 index.html 标题和字体**

覆写 `<title>` 标签：

```html
<!-- index.html -->
<title>我们的旅行手帖 🌸</title>
```

- [ ] **Step 4: 清理 Vite 默认文件**

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 5: 最终编译检查**

```bash
npx tsc --noEmit
npm run build
```

---

### Task 17: 创建 Supabase 项目 + 部署

- [ ] **Step 1: 在 [supabase.com](https://supabase.com) 创建免费项目**

记下 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`

- [ ] **Step 2: 更新 `.env` 文件**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

- [ ] **Step 3: 运行 Task 3 Step 3 的 SQL 脚本**

在 Supabase SQL Editor 中执行建表 + RLS + 触发器 SQL

- [ ] **Step 4: 创建 Storage Bucket（Task 3 Step 4）**

- [ ] **Step 5: 启用 GitHub OAuth（Task 3 Step 5）**

在 GitHub Settings → Developer settings → OAuth Apps 创建应用：
- Homepage URL: `https://your-project.supabase.co`
- Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`

将 Client ID 和 Client Secret 填入 Supabase Auth Providers

- [ ] **Step 6: 本地测试**

```bash
npm run dev
```

测试完整流程：GitHub 登录 → 浏览地图 → 点击省份 → 上传照片 → 查看时间线 → 查看统计

- [ ] **Step 7: 部署到 GitHub Pages**

在 `vite.config.ts` 中添加 base 配置：

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/photo2/', // 替换为实际的 GitHub Pages 路径
});
```

部署：

```bash
npm run build
# 将 dist/ 推送到 GitHub Pages 分支
npx gh-pages -d dist
```

- [ ] **Step 8: Supabase Auth 添加 GitHub Pages 域名到重定向白名单**

在 Supabase → Authentication → URL Configuration → Redirect URLs 添加：
`https://your-username.github.io/photo2/`

---

## 完成后验证清单

- [ ] `npm run build` 成功无错误
- [ ] GitHub 登录正常跳转
- [ ] 中国地图正确显示，省份可点击
- [ ] 有照片的省份显示樱花粉，无照片的显示浅灰
- [ ] 省份详情页正确展示照片列表
- [ ] 照片灯箱点击放大，ESC 关闭
- [ ] 上传表单完整可用（拖拽上传 + 所有字段）
- [ ] 上传成功后列表自动刷新
- [ ] 时间线页面按日期分组显示
- [ ] 统计页面数据正确
- [ ] 底部导航三页面切换正常
- [ ] 仅本人可删除自己的照片
