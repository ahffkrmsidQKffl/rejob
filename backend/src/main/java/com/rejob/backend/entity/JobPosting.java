package com.rejob.backend.entity;

import com.rejob.backend.enums.JobSource;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "job_posting",
        indexes = {
                @Index(name = "idx_job_source_location", columnList = "jobSource, location"),
                @Index(name = "idx_job_url", columnList = "url")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    private String title;

    private String companyName;

    private String location;

    private String category;

    @Enumerated(EnumType.STRING)
    private JobSource jobSource;

    @Column(nullable = true)
    private String contactPhone;

    // 사람인 공고 이동용 (노인일자리여기는 null)
    @Column(length = 512)
    private String url;
}
