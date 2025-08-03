package com.rejob.backend.service;

import com.rejob.backend.entity.Resume;
import com.rejob.backend.exception.CustomException;
import com.rejob.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    @Transactional
    public void deleteResume(Long userId, Long resumeId) {
        Resume resume = resumeRepository.findByResumeIdAndUser_UserId(resumeId, userId);

        if(resume == null) {
            throw new CustomException("해당 이력서를 찾을 수 없습니다.");
        }

        resumeRepository.delete(resume);
    }
}
