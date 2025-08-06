package com.rejob.backend.repository;

import com.rejob.backend.entity.JobPosting;
import com.rejob.backend.enums.JobSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findAllByLocationContainingAndJobSource(String location, JobSource jobSource);
}
