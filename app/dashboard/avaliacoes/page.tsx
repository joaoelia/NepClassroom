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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Trash2 } from "lucide-react"

// Interfaces de tipos
interface Question {
  type: "multiple" | "open"
  question: string
  options: string[]
  answer: string
}

interface NewEvaluation {
  title: string
  courseId: string
  questions: Question[]
}

interface Evaluation {
  id: number
  title: string
  questions: Question[]
  courseId: number
}

interface Enrollment {
  id: number
  courseName: string
  status: string
  pendingEvaluations: number
}

interface User {
  role: string
  [key: string]: any
}

const mockEnrollments: Enrollment[] = [
  { id: 1, courseName: "Introdução ao React", status: "Em andamento", pendingEvaluations: 2 },
  { id: 2, courseName: "JavaScript Avançado", status: "Concluído", pendingEvaluations: 0 },
]

export default function AvaliacoesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Enrollment | null>(null)
  const [showCreateEvaluation, setShowCreateEvaluation] = useState(false)
  const [newEvaluation, setNewEvaluation] = useState<NewEvaluation>({
    title: "",
    courseId: "",
    questions: [{ type: "multiple", question: "", options: ["", "", "", ""], answer: "" }],
  })

  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { 
      id: 1, 
      title: "Avaliação React - Módulo 1", 
      questions: [
        { type: "multiple", question: "O que é React?", options: ["Uma biblioteca JavaScript", "Uma linguagem de programação", "Um banco de dados", "Um servidor web"], answer: "" },
        { type: "multiple", question: "Qual hook é usado para gerenciar estado?", options: ["useEffect", "useState", "useContext", "useReducer"], answer: "" }
      ], 
      courseId: 1 
    },
    { 
      id: 2, 
      title: "Projeto Final React", 
      questions: [
        { type: "open", question: "Explique a diferença entre props e state no React.", options: [], answer: "" },
        { type: "open", question: "Descreva o ciclo de vida de um componente React.", options: [], answer: "" },
        { type: "open", question: "Como implementar roteamento no React?", options: [], answer: "" }
      ], 
      courseId: 1 
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const getEvaluationType = (questions: Question[]) => {
    const multipleCount = questions.filter(q => q.type === "multiple").length
    const openCount = questions.filter(q => q.type === "open").length
    
    if (multipleCount > 0 && openCount > 0) return "Mista"
    if (multipleCount > 0) return "Múltipla escolha"
    if (openCount > 0) return "Dissertativa"
    return "Não definido"
  }

  const addQuestion = () => {
    setNewEvaluation({
      ...newEvaluation,
      questions: [
        ...newEvaluation.questions,
        { type: "multiple", question: "", options: ["", "", "", ""], answer: "" },
      ],
    })
  }

  const removeQuestion = (index: number) => {
    const questions = newEvaluation.questions.filter((_: Question, i: number) => i !== index)
    setNewEvaluation({ ...newEvaluation, questions })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const questions = [...newEvaluation.questions]
    questions[index] = { ...questions[index], [field]: value }
    setNewEvaluation({ ...newEvaluation, questions })
  }

  const handleDeleteEvaluation = (evaluationId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Previne o clique no card
    if (confirm("Tem certeza que deseja deletar esta avaliação?")) {
      setEvaluations(evaluations.filter((evaluation: Evaluation) => evaluation.id !== evaluationId))
    }
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer })
  }

  const submitAnswers = () => {
    console.log("Respostas enviadas:", answers)
    setShowAnswerForm(false)
    setSelectedEvaluation(null)
    setAnswers({})
    alert("Avaliação enviada com sucesso!")
  }

  const handleCreateEvaluation = () => {
    const evaluation: Evaluation = {
      id: evaluations.length + 1,
      title: newEvaluation.title,
      questions: newEvaluation.questions,
      courseId: Number.parseInt(newEvaluation.courseId),
    }
    setEvaluations([...evaluations, evaluation])
    setNewEvaluation({
      title: "",
      courseId: "",
      questions: [{ type: "multiple", question: "", options: ["", "", "", ""], answer: "" }],
    })
    setShowCreateEvaluation(false)
  }

  if (!user) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Avaliações</h1>
        </div>

        {user.role === "admin" && (
          <Dialog open={showCreateEvaluation} onOpenChange={setShowCreateEvaluation}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Avaliação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Avaliação</DialogTitle>
                <DialogDescription>Configure as perguntas da avaliação</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eval-title">Título da Avaliação</Label>
                    <Input
                      id="eval-title"
                      value={newEvaluation.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvaluation({ ...newEvaluation, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-select">Curso</Label>
                    <select
                      id="course-select"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newEvaluation.courseId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewEvaluation({ ...newEvaluation, courseId: e.target.value })}
                    >
                      <option value="">Selecione um curso</option>
                      <option value="1">Introdução ao React</option>
                      <option value="2">JavaScript Avançado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Perguntas</h3>
                    <Button onClick={addQuestion} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Pergunta
                    </Button>
                  </div>

                  {newEvaluation.questions.map((question: Question, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Pergunta {index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tipo de Pergunta</Label>
                          <RadioGroup
                            value={question.type}
                            onValueChange={(value: string) => updateQuestion(index, "type", value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="multiple" id={`multiple-${index}`} />
                              <Label htmlFor={`multiple-${index}`}>Múltipla escolha</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="open" id={`open-${index}`} />
                              <Label htmlFor={`open-${index}`}>Dissertativa</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label>Pergunta</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateQuestion(index, "question", e.target.value)}
                            placeholder="Digite a pergunta..."
                          />
                        </div>

                        {question.type === "multiple" && (
                          <div className="space-y-2">
                            <Label>Opções de Resposta</Label>
                            {question.options.map((option: string, optionIndex: number) => (
                              <Input
                                key={optionIndex}
                                value={option}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const options = [...question.options]
                                  options[optionIndex] = e.target.value
                                  updateQuestion(index, "options", options)
                                }}
                                placeholder={`Opção ${optionIndex + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button onClick={handleCreateEvaluation} className="w-full">
                  Criar Avaliação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Cursos</CardTitle>
          <CardDescription>Clique em um curso para ver as avaliações disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Avaliações Pendentes</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEnrollments.map((enrollment) => (
                <TableRow
                  key={enrollment.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedCourse(enrollment)}
                >
                  <TableCell className="font-medium">{enrollment.courseName}</TableCell>
                  <TableCell>{enrollment.status}</TableCell>
                  <TableCell>{enrollment.pendingEvaluations}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Avaliações
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCourse && (
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Avaliações - {selectedCourse.courseName}</DialogTitle>
              <DialogDescription>Selecione uma avaliação para responder</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <Card key={evaluation.id} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{evaluation.title}</h4>
                        <p className="text-sm text-gray-600">
                          {evaluation.questions.length} perguntas • {getEvaluationType(evaluation.questions)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedEvaluation(evaluation)
                            setShowAnswerForm(true)
                            setSelectedCourse(null)
                          }}
                        >
                          Responder
                        </Button>
                        {user.role === "admin" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteEvaluation(evaluation.id, e)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAnswerForm && selectedEvaluation && (
        <Dialog open={showAnswerForm} onOpenChange={() => setShowAnswerForm(false)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Responder Avaliação - {selectedEvaluation.title}</DialogTitle>
              <DialogDescription>Responda todas as perguntas abaixo</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {selectedEvaluation.questions.map((question, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">Pergunta {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="font-medium">{question.question}</p>

                      {question.type === "multiple" ? (
                        <RadioGroup
                          value={answers[index] || ""}
                          onValueChange={(value: string) => handleAnswerChange(index, value)}
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`q${index}-${optionIndex}`} />
                              <Label htmlFor={`q${index}-${optionIndex}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Textarea
                          value={answers[index] || ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, e.target.value)}
                          placeholder="Digite sua resposta..."
                          rows={4}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex space-x-3">
                <Button onClick={submitAnswers} className="flex-1">
                  Enviar Respostas
                </Button>
                <Button variant="outline" onClick={() => setShowAnswerForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
