package com.nepclassroom.nep_backend.repository;

import com.nepclassroom.nep_backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {}
