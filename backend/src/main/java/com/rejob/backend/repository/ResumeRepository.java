package com.rejob.backend.repository;

import com.rejob.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Resume findByResumeIdAndUser_UserId(Long resumeId, Long userId);
    List<Resume> findAllByUser_UserId(Long userId);
}
