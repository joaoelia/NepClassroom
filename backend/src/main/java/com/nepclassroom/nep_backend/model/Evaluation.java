package com.nepclassroom.nep_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "evaluations")
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String questionsJson;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getQuestionsJson() { return questionsJson; }
    public void setQuestionsJson(String questionsJson) { this.questionsJson = questionsJson; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
