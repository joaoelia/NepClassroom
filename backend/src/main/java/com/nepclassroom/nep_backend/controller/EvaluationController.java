package com.nepclassroom.nep_backend.controller;

import com.nepclassroom.nep_backend.model.Evaluation;
import com.nepclassroom.nep_backend.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {
    @Autowired
    private EvaluationRepository evaluationRepository;

    @GetMapping
    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Evaluation> createEvaluation(@RequestBody Evaluation evaluation) {
        Evaluation saved = evaluationRepository.save(evaluation);
        return ResponseEntity.ok(saved);
    }
}
