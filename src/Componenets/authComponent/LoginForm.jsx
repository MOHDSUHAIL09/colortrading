// File: src/components/LoginForm.jsx

import { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { THEME_CONFIGS } from './themes';
import {
  playTypingClick, playTelescopeEyeSound, playHidingSound,
  playErrorBuzz, playSuccessChime,
} from './sound';

export default function LoginForm({
  theme, setBotMood, onLoginSuccess,
  onSwitchToRegister, onForgotPassword,
}) {
  const themeConfig = THEME_CONFIGS[theme];

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Ek hi error message — top pe box mein dikhega
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Field-wise errors — sirf client validation ke liye (input ke neeche)
  const [fieldErrors, setFieldErrors] = useState({ loginId: '', password: '' });

  // ================= HANDLERS =================

  const handleLoginIdChange = (e) => {
    setLoginId(e.target.value);
    setErrorMessage('');   // ✅ top error clear
    setFieldErrors((prev) => ({ ...prev, loginId: '' }));
    playTypingClick();
    setBotMood('typing');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');   // ✅ top error clear
    setFieldErrors((prev) => ({ ...prev, password: '' }));
    playTypingClick();
    setBotMood(showPassword ? 'peeking' : 'hiding_eyes');
  };

  const handlePasswordFocus = () =>
    setBotMood(showPassword ? 'peeking' : 'hiding_eyes');

  const handlePasswordBlur = () => setBotMood('idle');

  const handleTogglePassword = () => {
    const next = !showPassword;
    setShowPassword(next);
    if (next) { playTelescopeEyeSound(); setBotMood('peeking'); }
    else { playHidingSound(); setBotMood('hiding_eyes'); }
  };

  // ✅ Server error — sirf TOP pe ek hi box mein dikhao
  const showServerError = (msg) => {
    const errorMsg = Array.isArray(msg)
      ? msg.join(', ')
      : String(msg || 'Invalid Login Credentials.');

    setErrorMessage(errorMsg);          // ✅ sirf top box
    setFieldErrors({ loginId: '', password: '' });  // ✅ field errors clear
    playErrorBuzz();
    setBotMood('error');
    setTimeout(() => setBotMood('idle'), 1200);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({ loginId: '', password: '' });

    // ✅ Client-side validation (field-wise)
    let hasClientError = false;
    const clientErrors = { loginId: '', password: '' };

    if (!loginId.trim()) {
      clientErrors.loginId = 'Login ID is required.';
      hasClientError = true;
    } else if (loginId.trim().length < 3) {
      clientErrors.loginId = 'Login ID must be at least 3 characters.';
      hasClientError = true;
    } else if (!/^[a-zA-Z0-9]+$/.test(loginId.trim())) {
      clientErrors.loginId = 'Login ID can only contain letters and numbers.';
      hasClientError = true;
    }

    if (!password) {
      clientErrors.password = 'Password is required.';
      hasClientError = true;
    } else if (password.length < 8) {
      clientErrors.password = 'Password must be at least 8 characters.';
      hasClientError = true;
    }

    if (hasClientError) {
      setFieldErrors(clientErrors);
      playErrorBuzz();
      setBotMood('error');
      setTimeout(() => setBotMood('idle'), 1200);
      return;
    }

    setIsLoading(true);
    setBotMood('typing');

    const payload = {
      loginId: loginId.trim(),
      password,
      deviceId: 'web-browser',
    };

    try {
      const { data } = await apiClient.post('/Auth/Login', payload);

      if (data?.result === 'true' && data?.response) {
        const user = data.response;

        sessionStorage.setItem('Regno', String(user.regNo ?? ''));
        sessionStorage.setItem('loginId', user.loginid ?? '');
        sessionStorage.setItem('walletid', user.walletid ?? '');
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('user', JSON.stringify(user));

        const session = {
          name: user.name || user.loginid,
          email: user.EmailID || '',
          loginId: user.loginid,
          regNo: user.regNo,
          walletId: user.walletid,
          mobile: user.mobile,
          sessionId: 'SES-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          loginTime: new Date().toLocaleString(),
          provider: 'Email & Password',
          raw: user,
        };

        playSuccessChime();
        setBotMood('celebrating');
        onLoginSuccess?.(session);
      } else {
        // ❌ API ne result: false diya
        const msg = data?.message || 'Invalid Login Credentials.';
        showServerError(msg);
      }
    } catch (error) {
      const rd = error?.response?.data;

      let msg = 'Invalid Login Credentials.';

      if (rd?.message) {
        msg = Array.isArray(rd.message) ? rd.message.join(', ') : String(rd.message);
      } else if (rd?.title) {
        msg = String(rd.title);
      } else if (rd?.errors) {
        msg = Object.values(rd.errors).flat().join(', ');
      } else if (error?.message && error.message !== 'Network Error') {
        msg = error.message;
      } else if (error?.code === 'ECONNABORTED') {
        msg = 'Request timed out. Please try again.';
      } else if (!error?.response) {
        msg = 'Check your connection.';
      }

      showServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= RENDER =================

  return (
    <div id="login-form-container" className="flex flex-col h-full">
      <div>
        <div className="text-center mb-7">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Sign in with your credentials
          </p>
        </div>

        {/* ✅ SINGLE ERROR BOX — sirf yahan dikhega */}
        {errorMessage && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, color: '#f87171' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" autoComplete="off" noValidate>
          {/* ================= Login ID ================= */}
          <div>
            <label
              className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
              htmlFor="login-id"
            >
              Login ID
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400"
                style={{ paddingLeft: '16px', zIndex: 2 }}
              >
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-id"
                type="text"
                autoComplete="off"
                value={loginId}
                onChange={handleLoginIdChange}
                onFocus={() => setBotMood('typing')}
                onBlur={() => setBotMood('idle')}
                placeholder="your login id"
                className="w-full pr-4 py-3 sm:py-3.5 bg-slate-950/60 text-white placeholder-slate-500 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  paddingLeft: '44px',
                  borderColor: fieldErrors.loginId ? '#ef4444' : 'rgba(255,255,255,0.1)',
                }}
              />
            </div>
            {/* ✅ Client validation error — input ke neeche */}
            {fieldErrors.loginId && (
              <p
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  lineHeight: 1.4,
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{fieldErrors.loginId}</span>
              </p>
            )}
          </div>

          {/* ================= Password ================= */}
          <div>
            <label
              className="block text-xs sm:text-sm font-medium text-slate-300 mb-2"
              htmlFor="login-password"
            >
              Password
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400"
                style={{ paddingLeft: '16px', zIndex: 2 }}
              >
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/60 text-white placeholder-slate-500 rounded-xl border text-sm focus:outline-none transition-all"
                style={{
                  paddingLeft: '44px',
                  paddingRight: '48px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderColor: fieldErrors.password ? '#ef4444' : 'rgba(255,255,255,0.1)',
                }}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                style={{ paddingRight: '16px', zIndex: 2 }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* ✅ Client validation error — input ke neeche */}
            {fieldErrors.password && (
              <p
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  lineHeight: 1.4,
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm text-slate-400">Forgot password ? </span>
            <button
              type="button"
              onClick={onForgotPassword}
              className="bg-transparent border-0 p-0 font-semibold"
              style={{ color: '#667eea', cursor: 'pointer' }}
            >
              Reset Here
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-400">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold hover:underline ml-1"
              style={{
                color: '#667eea',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
            >
              Register Here
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-5 rounded-xl font-semibold text-sm sm:text-base transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 10px 30px -8px rgba(6, 182, 212, 0.55)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}