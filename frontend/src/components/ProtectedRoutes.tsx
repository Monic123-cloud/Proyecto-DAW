"use client" 

import { useRouter } from "next/navigation"
import { useEffect, useState,ReactNode } from "react"


type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
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