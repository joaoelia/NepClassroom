"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadVideoProps {
  courseId: number;
  isAdmin: boolean;
}

const UploadVideo: React.FC<UploadVideoProps> = ({ courseId, isAdmin }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isAdmin) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage("Selecione um arquivo e informe o título.");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("courseId", String(courseId));
    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMessage("Upload realizado com sucesso!");
        setFile(null);
        setTitle("");
      } else {
        setMessage("Erro ao fazer upload do vídeo.");
      }
    } catch {
      setMessage("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <h2 className="text-lg font-bold">Upload de Vídeo</h2>
      <Input
        type="text"
        placeholder="Título do vídeo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input type="file" accept="video/*" onChange={handleFileChange} required />
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
      {message && <div className="text-sm mt-2">{message}</div>}
    </form>
  );
};

export default UploadVideo;
