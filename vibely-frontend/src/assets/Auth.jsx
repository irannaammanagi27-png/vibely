
import { useState } from 'react';
import {
  Heart,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  MessageCircle,
} from 'lucide-react';
import { loginUser, registerUser } from '../api';

const INTERESTS = [
  'Music',
  'Movies',
  'Travel',
  'Gaming',
  'Photography',
  'Reading',
  'Fitness',
  'Art',
  'Technology',
  'Food',
  'Nature',
  'Fashion',
];

export default function Auth({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([
    'Music',
    'Movies',
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const isRegister = mode === 'register';

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  function toggleInterest(interest) {
    setSelectedInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((item) => item !== interest)
        : [...previous, interest]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (isRegister) {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }

      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        await registerUser({
          fullName: fullName.trim(),
          email: cleanEmail,
          password,
          interests: selectedInterests,
        });

        setNotice('Account created! You can now log in.');
        setMode('login');
        setPassword('');
      } else {
        const result = await loginUser({
          email: cleanEmail,
          password,
        });

        if (!result.token) {
          throw new Error(
            'Login succeeded but no token was returned.'
          );
        }

        onSuccess?.(result);
      }
    } catch (err) {
      setError(
        err.message ||
          'Something went wrong. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8ff] px-4 py-8 text-slate-800">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-purple-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-2xl shadow-purple-200/40 md:grid-cols-2">
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500 p-10 text-white md:flex">
          <div className="absolute -right-20 top-28 h-64 w-64 rounded-full border border-white/20" />
          <div className="absolute -right-10 top-38 h-48 w-48 rounded-full border border-white/20" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
              <Heart fill="white" size={25} />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Vibely
            </span>
          </div>

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm">
              <Sparkles size={16} />
              Find your kind of people
            </div>

            <h1 className="max-w-md text-5xl font-black leading-tight tracking-tight">
              Good vibes.
              <br />
              Real friends.
              <br />
              <span className="text-purple-200">Your people.</span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-purple-100">
              Meet people who share your interests, start conversations,
              and make everyday connections feel special.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                <Users size={18} />
                <span className="text-sm font-medium">
                  New friendships
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                <MessageCircle size={18} />
                <span className="text-sm font-medium">
                  Real conversations
                </span>
              </div>
            </div>
          </div>

          <p className="relative text-sm text-purple-100">
            Made for meaningful connections 💜
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                <Heart size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-violet-700">
                Vibely
              </span>
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              {isRegister ? 'Start your journey' : 'Welcome back'}
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {isRegister ? 'Create account' : 'Find your vibe.'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isRegister
                ? 'Join Vibely and meet people who get you.'
                : 'Sign in to reconnect with your community.'}
            </p>

            <div className="mt-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => changeMode('login')}
                className={`rounded-xl py-3 text-sm font-bold transition ${
                  !isRegister
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => changeMode('register')}
                className={`rounded-xl py-3 text-sm font-bold transition ${
                  isRegister
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign up
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {isRegister && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      isRegister ? 'new-password' : 'current-password'
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={
                      isRegister
                        ? 'At least 8 characters'
                        : 'Enter your password'
                    }
                    required
                    minLength={isRegister ? 8 : undefined}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <p className="mb-3 text-sm font-semibold">
                    Choose your interests
                    <span className="ml-2 font-normal text-slate-400">
                      (optional)
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => {
                      const selected =
                        selectedInterests.includes(interest);

                      return (
                        <button
                          key={interest}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                            selected
                              ? 'border-violet-600 bg-violet-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
                          }`}
                        >
                          {selected ? '✓ ' : '+ '}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Please wait...'
                  : isRegister
                    ? 'Create my account'
                    : 'Log in to Vibely'}

                {!loading && <Sparkles size={18} />}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to use Vibely respectfully and help
              create a welcoming community.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
