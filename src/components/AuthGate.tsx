import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    async function handleEmailAuth(e: React.FormEvent) {
      e.preventDefault();
      setErrorMsg('');
      setMsg('');
      setSubmitting(true);
      const error = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);
      setSubmitting(false);
      if (error) {
        setErrorMsg(error.message);
      } else if (isSignUp) {
        setMsg('注册成功！请检查邮箱中的确认邮件。');
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-washi to-sakura-light">
        <div className="text-center space-y-6 max-w-sm mx-auto p-8">
          <div className="space-y-3">
            <div className="text-5xl">🌸</div>
            <h1 className="text-2xl font-serif font-bold text-ink">我们的旅行手帖</h1>
            <p className="text-ink-light text-xs leading-relaxed">
              用照片记录两个人的旅行回忆
            </p>
          </div>

          {/* Email login form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 text-left">
            <div>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱地址"
                required
              />
            </div>
            <div>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                required
                minLength={6}
              />
            </div>
            {errorMsg && (
              <p className="text-red-400 text-xs">{errorMsg}</p>
            )}
            {msg && (
              <p className="text-matcha text-xs">{msg}</p>
            )}
            <Button type="submit" variant="primary" className="w-full py-2.5 text-sm" disabled={submitting}>
              {submitting ? '处理中...' : isSignUp ? '📧 注册' : '📧 登录'}
            </Button>
          </form>

          <div className="text-xs">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setMsg(''); }}
              className="text-ink-light hover:text-sakura transition-colors"
            >
              {isSignUp ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-warm" />
            <span className="text-warm text-xs">或</span>
            <div className="flex-1 h-px bg-warm" />
          </div>

          <Button variant="ghost" onClick={signInWithGitHub} className="w-full py-2.5 text-sm">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub 登录
            </span>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
