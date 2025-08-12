"use client"

import React, { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Clock, Play, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const mockCourses = [
  {
    id: 1,
    title: "Introdução ao React",
    description: "Aprenda os fundamentos do React do zero",
    image: "/placeholder.svg?height=200&width=300",
    totalHours: 12,
    totalVideos: 24,
    modules: [
      { id: 1, title: "Fundamentos", videos: 8 },
      { id: 2, title: "Componentes", videos: 10 },
      { id: 3, title: "Estado e Props", videos: 6 },
    ],
  },
  {
    id: 2,
    title: "JavaScript Avançado",
    description: "Domine conceitos avançados de JavaScript",
    image: "/placeholder.svg?height=200&width=300",
    totalHours: 18,
    totalVideos: 32,
    modules: [
      { id: 1, title: "ES6+", videos: 12 },
      { id: 2, title: "Async/Await", videos: 8 },
      { id: 3, title: "Módulos", videos: 12 },
    ],
  },
]

export default function CursosPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState(mockCourses)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    totalHours: "",
    image: null as File | null,
    video: null as File | null,
  })

  useEffect(() => {
    const email = window.sessionStorage.getItem("email")
    if (!email) return
    fetch(`/api/users/${email}`)
      .then((res) => res.ok ? res.json() : null)
      .then((userData) => {
        if (userData) setUser(userData)
      })
  }, [])

  const handleAddCourse = () => {
    const course = {
      id: courses.length + 1,
      title: newCourse.title,
      description: newCourse.description,
      image: "/placeholder.svg?height=200&width=300",
      totalHours: Number.parseInt(newCourse.totalHours),
      totalVideos: 0,
      modules: [],
    }
    setCourses([...courses, course])
    setNewCourse({ title: "", description: "", totalHours: "", image: null, video: null })
    setShowAddCourse(false)
  }

  const handleDeleteCourse = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Previne o clique no card
    if (confirm("Tem certeza que deseja deletar este curso?")) {
      setCourses(courses.filter((course: any) => course.id !== courseId))
    }
  }

  if (!user) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
        </div>

        {user.role === "admin" && (
          <Dialog open={showAddCourse} onOpenChange={setShowAddCourse}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Curso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Curso</DialogTitle>
                <DialogDescription>Preencha as informações do curso</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Curso</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Horas Totais</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={newCourse.totalHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, totalHours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Imagem do Curso</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, image: e.target.files?.[0] || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video">Vídeo do Curso</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({ ...newCourse, video: e.target.files?.[0] || null })}
                  />
                </div>
                <Button onClick={handleAddCourse} className="w-full">
                  Criar Curso
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {selectedCourse ? (
        <div>
          <Button variant="outline" onClick={() => setSelectedCourse(null)} className="mb-4">
            ← Voltar aos Cursos
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{selectedCourse.title}</CardTitle>
              <CardDescription>Módulos e Vídeo Aulas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCourse.modules.map((module: any) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{module.title}</h3>
                    <div className="space-y-2">
                      {Array.from({ length: module.videos }, (_, i) => (
                        <Link
                          key={i}
                          href={`/dashboard/cursos/${selectedCourse.id}/video/${i + 1}`}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Play className="h-5 w-5 text-blue-600" />
                          <span>
                            Vídeo {i + 1} - {module.title}
                          </span>
                          <span className="text-sm text-gray-500 ml-auto">10:30</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="aspect-video relative">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.totalHours}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{course.totalVideos} vídeos</span>
                  </div>
                </div>
                {user.role === "admin" && (
                  <div className="flex justify-end mt-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteCourse(course.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
