"use client" 

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const ProtectedRoute = ({ children }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/acceso/login")
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return null

  return children
}

export default ProtectedRoute