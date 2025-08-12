"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus } from "lucide-react"

const mockUsers = [
  { id: 1, name: "João Silva", email: "joao@email.com", courses: ["Introdução ao React"] },
  { id: 2, name: "Maria Santos", email: "maria@email.com", courses: ["JavaScript Avançado"] },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", courses: [] },
  { id: 4, name: "Ana Oliveira", email: "ana@email.com", courses: ["Introdução ao React", "JavaScript Avançado"] },
]

const mockCourses = [
  { id: 1, name: "Introdução ao React" },
  { id: 2, name: "JavaScript Avançado" },
  { id: 3, name: "Node.js Fundamentals" },
]

export default function PessoasPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState(mockUsers)
  const [showAddUserToCourse, setShowAddUserToCourse] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")

  useEffect(() => {
    const email = window.sessionStorage.getItem("email")
    if (!email) return
    fetch(`/api/users/${email}`)
      .then((res) => res.ok ? res.json() : null)
      .then((userData) => {
        if (userData) setUser(userData)
      })
  }, [])

  const handleAddUserToCourse = () => {
    if (!selectedUser || !selectedCourse) return

    const userIndex = users.findIndex((u) => u.id.toString() === selectedUser)
    const course = mockCourses.find((c) => c.id.toString() === selectedCourse)

    if (userIndex !== -1 && course) {
      const updatedUsers = [...users]
      if (!updatedUsers[userIndex].courses.includes(course.name)) {
        updatedUsers[userIndex].courses.push(course.name)
        setUsers(updatedUsers)
      }
    }

    setSelectedUser("")
    setSelectedCourse("")
    setShowAddUserToCourse(false)
  }

  if (!user) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Pessoas</h1>
        </div>

        {user.role === "admin" && (
          <Dialog open={showAddUserToCourse} onOpenChange={setShowAddUserToCourse}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário ao Curso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Matricular Usuário</DialogTitle>
                <DialogDescription>Selecione o usuário e o curso para matrícula</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Usuário</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Curso</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">Selecione um curso</option>
                    {mockCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleAddUserToCourse} className="w-full" disabled={!selectedUser || !selectedCourse}>
                  Matricular Usuário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Todos os usuários cadastrados na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cursos Matriculados</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.courses.length === 0 ? (
                      <span className="text-gray-500">Nenhum curso</span>
                    ) : (
                      <div className="space-y-1">
                        {user.courses.map((course, index) => (
                          <div
                            key={index}
                            className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mr-1"
                          >
                            {course}
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.courses.length > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.courses.length > 0 ? "Ativo" : "Sem matrícula"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
