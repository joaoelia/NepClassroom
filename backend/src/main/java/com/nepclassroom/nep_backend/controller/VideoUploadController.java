package com.nepclassroom.nep_backend.controller;

import com.nepclassroom.nep_backend.model.Video;
import com.nepclassroom.nep_backend.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/upload-video")
public class VideoUploadController {
    private static final String UPLOAD_DIR = "uploads/videos/";

    @Autowired
    private VideoRepository videoRepository;

    @PostMapping
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file,
                                         @RequestParam("title") String title,
                                         @RequestParam("courseId") Long courseId) {
        try {
            // Cria diretório se não existir
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Salva arquivo
            Path filePath = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            // Salva vídeo no banco
            Video video = new Video();
            video.setTitle(title);
            video.setUrl(filePath.toString());
            // video.setCourse(courseId); // Relacionamento pode ser ajustado conforme necessário
            videoRepository.save(video);

            return ResponseEntity.ok("Upload realizado com sucesso!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erro ao fazer upload do vídeo.");
        }
    }
}
