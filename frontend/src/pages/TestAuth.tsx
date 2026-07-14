import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function TestAuth() {
  const [token, setToken] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'test@test.com',
        '123456'
      )
      const idToken = await userCredential.user.getIdToken()
      setToken(idToken)
      setResult('✅ Đăng ký thành công! Token đã được lấy.')
    } catch (err: any) {
      setResult(`❌ Lỗi: ${err.message}`)
    }
  }

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'test@test.com',
        '123456'
      )
      const idToken = await userCredential.user.getIdToken()
      setToken(idToken)
      setResult('✅ Đăng nhập thành công! Token đã được lấy.')
    } catch (err: any) {
      setResult(`❌ Lỗi: ${err.message}`)
    }
  }

  const handleTestAPI = async () => {
    try {
      const res = await fetch('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setResult(`✅ API response: ${JSON.stringify(data, null, 2)}`)
    } catch (err: any) {
      setResult(`❌ API lỗi: ${err.message}`)
    }
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-xl">
      <h1 className="text-xl font-bold">Test Firebase Auth</h1>

      <div className="flex gap-2">
        <button onClick={handleRegister} className="px-4 py-2 bg-blue-500 text-white rounded">
          Đăng ký test account
        </button>
        <button onClick={handleLogin} className="px-4 py-2 bg-green-500 text-white rounded">
          Đăng nhập
        </button>
      </div>

      {token && (
        <button onClick={handleTestAPI} className="px-4 py-2 bg-purple-500 text-white rounded">
          Gọi API /profile (có token)
        </button>
      )}

      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap break-all">
          {result}
        </pre>
      )}

      {token && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Token (dùng để test với Postman/curl):</p>
          <pre className="bg-gray-100 p-2 rounded text-xs break-all">{token}</pre>
        </div>
      )}
    </div>
  )
}
