"use client"

import React, { useState, useEffect } from "react"
import { Menu, X, User, BookOpen, FileText, BarChart3, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Footer from "@/components/footer"

async function fetchUser(email: string) {
  const res = await fetch(`/api/users/${email}`)
  if (!res.ok) return null
  return await res.json()
}
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()


  useEffect(() => {
    // Exemplo: buscar email do usuário logado de um cookie ou contexto
    const email = window.sessionStorage.getItem("email")
    if (!email) {
      router.push("/")
      return
    }
    fetchUser(email).then((userData) => {
      if (!userData) {
        router.push("/")
        return
      }
      setUser(userData)
    })
  }, [router])

  const handleLogout = () => {
    window.sessionStorage.removeItem("email")
    router.push("/")
  }

  const menuItems = [
    { icon: User, label: "Perfil", href: "/dashboard/perfil" },
    { icon: BookOpen, label: "Cursos", href: "/dashboard/cursos" },
    { icon: FileText, label: "Avaliações", href: "/dashboard/avaliacoes" },
    { icon: BarChart3, label: "Desempenho", href: "/dashboard/desempenho" },
    { icon: Users, label: "Pessoas", href: "/dashboard/pessoas" },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-blue-700 font-bold">NEP</span>
              <span className="text-gray-800"> Classroom</span>
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex items-center justify-between p-4 border-b mt-16">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${pathname === item.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-8"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full">
          <div className="p-6 min-h-screen">{children}</div>
          <Footer />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
