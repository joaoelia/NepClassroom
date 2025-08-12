package com.nepclassroom.nep_backend.repository;

import com.nepclassroom.nep_backend.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {}
