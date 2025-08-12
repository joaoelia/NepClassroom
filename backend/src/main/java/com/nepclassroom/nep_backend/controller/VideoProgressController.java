package com.nepclassroom.nep_backend.controller;

import com.nepclassroom.nep_backend.model.VideoProgress;
import com.nepclassroom.nep_backend.repository.VideoProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-progress")
public class VideoProgressController {
    @Autowired
    private VideoProgressRepository videoProgressRepository;

    @GetMapping
    public List<VideoProgress> getAllProgress() {
        return videoProgressRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<VideoProgress> saveProgress(@RequestBody VideoProgress progress) {
        VideoProgress saved = videoProgressRepository.save(progress);
        return ResponseEntity.ok(saved);
    }
}
