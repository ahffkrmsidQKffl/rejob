package com.rejob.backend.entity;

import com.rejob.backend.enums.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "user_info")
@Getter
@Setter
@NoArgsConstructor
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long infoId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    private String name;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate birth;

    @Column(columnDefinition = "TEXT")
    private String jobExperience;

    public void updateInfo(String name, String birth, String gender, String jobExperience) {
        this.name = name;
        this.birth = LocalDate.parse(birth);
        this.gender = Gender.valueOf(gender);
        this.jobExperience = jobExperience;
    }
}
