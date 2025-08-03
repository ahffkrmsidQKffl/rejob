package com.rejob.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume")
@Getter
@Setter
@NoArgsConstructor
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resumeId;

    @ManyToOne
    @JoinColumn(name = "info_id", nullable = false)
    private UserInfo userInfo;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    private String title;

    private String region;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;
}
