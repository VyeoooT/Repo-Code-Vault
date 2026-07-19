import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useState } from 'react';

import { auth } from '../lib/firebase';

export default function TestAuth() {
  const [token, setToken] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unknown error';

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'testapi@gmail.com',
        '123@123aA'
      );
      const idToken = await userCredential.user.getIdToken();
      setToken(idToken);
      setResult('✅ Đăng ký thành công! Token đã được lấy.');
    } catch (err: unknown) {
      setResult(`❌ Lỗi: ${getErrorMessage(err)}`);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'testapi@gmail.com',
        '123@123aA'
      );
      const idToken = await userCredential.user.getIdToken();
      setToken(idToken);
      setResult('✅ Đăng nhập thành công! Token đã được lấy.');
    } catch (err: unknown) {
      setResult(`❌ Lỗi: ${getErrorMessage(err)}`);
    }
  };

  const handleTestAPI = async () => {
    try {
      const res = await fetch('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setResult(`✅ API response: ${JSON.stringify(data, null, 2)}`);
    } catch (err: unknown) {
      setResult(`❌ API lỗi: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-xl font-bold">Test Firebase Auth</h1>

      <div className="flex gap-2">
        <button
          onClick={handleRegister}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Đăng ký test account
        </button>
        <button
          onClick={handleLogin}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Đăng nhập
        </button>
      </div>

      {token && (
        <button
          onClick={handleTestAPI}
          className="rounded bg-purple-500 px-4 py-2 text-white"
        >
          Gọi API /profile (có token)
        </button>
      )}

      {result && (
        <pre className="rounded bg-gray-100 p-4 text-sm break-all whitespace-pre-wrap">
          {result}
        </pre>
      )}

      {token && (
        <div>
          <p className="mb-1 text-xs text-gray-500">
            Token (dùng để test với Postman/curl):
          </p>
          <pre className="rounded bg-gray-100 p-2 text-xs break-all">
            {token}
          </pre>
        </div>
      )}
    </div>
  );
}
