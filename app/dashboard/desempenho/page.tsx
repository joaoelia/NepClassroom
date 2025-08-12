"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Lock } from "lucide-react"

const mockStudents = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    courses: [
      {
        name: "Introdução ao React",
        totalVideos: 24,
        watchedVideos: 18,
        videoProgress: [
          { id: 1, title: "Fundamentos", progress: 100 },
          { id: 2, title: "Componentes", progress: 75 },
          { id: 3, title: "Estado", progress: 45 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    courses: [
      {
        name: "JavaScript Avançado",
        totalVideos: 32,
        watchedVideos: 32,
        videoProgress: [
          { id: 1, title: "ES6+", progress: 100 },
          { id: 2, title: "Async/Await", progress: 100 },
          { id: 3, title: "Módulos", progress: 100 },
        ],
      },
    ],
  },
]

export default function DesempenhoPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Credenciais inválidas!")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Esta área é restrita aos administradores</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="admin123"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Acessar Desempenho
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Desempenho dos Alunos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>Clique em um aluno para ver seu desempenho detalhado</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cursos Matriculados</TableHead>
                <TableHead>Progresso Geral</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((student) => {
                const totalProgress =
                  student.courses.reduce((acc, course) => {
                    return acc + (course.watchedVideos / course.totalVideos) * 100
                  }, 0) / student.courses.length

                return (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.courses.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={totalProgress} className="w-20" />
                        <span className="text-sm">{Math.round(totalProgress)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Desempenho - {selectedStudent.name}</DialogTitle>
              <DialogDescription>Detalhes do aproveitamento nos cursos</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {selectedStudent.courses.map((course: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>
                      {course.watchedVideos} de {course.totalVideos} vídeos assistidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">Progresso Geral:</span>
                        <Progress value={(course.watchedVideos / course.totalVideos) * 100} className="flex-1" />
                        <span className="text-sm">
                          {Math.round((course.watchedVideos / course.totalVideos) * 100)}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Progresso por Módulo:</h4>
                        {course.videoProgress.map((module: any) => (
                          <div key={module.id} className="flex items-center space-x-4">
                            <span className="text-sm w-32">{module.title}:</span>
                            <Progress value={module.progress} className="flex-1" />
                            <span className="text-sm w-12">{module.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
