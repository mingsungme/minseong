import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/pm-portfolio');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (err.code === 'auth/weak-password') {
        setError('비밀번호는 6자리 이상이어야 합니다.');
      } else {
        setError(isLogin ? '이메일 또는 비밀번호가 올바르지 않습니다.' : '회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    // Set custom parameters to prompt user to select their account
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      await signInWithPopup(auth, provider);
      navigate('/pm-portfolio');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('로그인 팝업이 닫혔습니다.');
      } else {
        setError('구글 로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-8">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#f5f5f0]/10 p-12">
        <div className="mb-10 text-center">
          <div className="font-['Space_Mono'] text-xs tracking-[0.3em] text-[#ff6b35] mb-4">
            {isLogin ? 'ADMIN ACCESS' : 'CREATE ACCOUNT'}
          </div>
          <h1 className="font-['Archivo_Black'] text-4xl text-[#f5f5f0]">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 font-['Crimson_Pro'] text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#b8b8a8] mb-2">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block font-['Space_Mono'] text-xs tracking-wider text-[#b8b8a8] mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#f5f5f0]/10 font-['Crimson_Pro'] text-[#f5f5f0] focus:border-[#ff6b35] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-[#ff6b35] text-[#0a0a0a] font-['Space_Mono'] text-sm tracking-wider hover:bg-[#ff8855] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? (isLogin ? 'SIGNING IN...' : 'SIGNING UP...') : (isLogin ? 'SIGN IN' : 'SIGN UP')}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-px bg-[#f5f5f0]/10 flex-1"></div>
          <span className="px-4 text-[#b8b8a8] font-['Space_Mono'] text-xs">OR</span>
          <div className="h-px bg-[#f5f5f0]/10 flex-1"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 w-full px-8 py-4 bg-[#f5f5f0] text-[#0a0a0a] font-['Space_Mono'] text-sm tracking-wider hover:bg-[#e0e0d8] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-['Space_Mono'] text-xs text-[#b8b8a8] hover:text-[#ff6b35] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
