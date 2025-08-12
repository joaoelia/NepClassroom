package com.nepclassroom.nep_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "video_progress")
public class VideoProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    @Column(nullable = false)
    private int secondsWatched;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Video getVideo() { return video; }
    public void setVideo(Video video) { this.video = video; }
    public int getSecondsWatched() { return secondsWatched; }
    public void setSecondsWatched(int secondsWatched) { this.secondsWatched = secondsWatched; }
}
