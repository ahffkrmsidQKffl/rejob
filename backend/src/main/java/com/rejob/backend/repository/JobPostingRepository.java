package com.rejob.backend.repository;

import com.rejob.backend.entity.JobPosting;
import com.rejob.backend.enums.JobSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findAllByLocationContainingAndJobSource(String location, JobSource jobSource);

    boolean existsByTitleAndCompanyNameAndLocationAndJobSource(
            String title, String companyName, String location, JobSource jobSource
    );

    // 사람인 중복 기준 개선 (동일 url이면 같은 공고로 간주)
    Optional<JobPosting> findByUrlAndJobSource(String url, JobSource jobSource);
}
