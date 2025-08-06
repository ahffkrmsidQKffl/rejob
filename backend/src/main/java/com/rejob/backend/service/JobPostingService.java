package com.rejob.backend.service;

import com.rejob.backend.dto.request.JobPostingRequest;
import com.rejob.backend.dto.response.JobPostingResponse;
import com.rejob.backend.entity.JobPosting;
import com.rejob.backend.enums.JobSource;
import com.rejob.backend.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;

    // 일자리 목록 조회
    public List<JobPostingResponse> getJobList(String region, String source) {
        JobSource jobSource = JobSource.valueOf(source);
        List<JobPosting> postings = jobPostingRepository.findAllByLocationContainingAndJobSource(region, jobSource);
        return postings.stream()
                .map(JobPostingResponse::new)
                .collect(Collectors.toList());
    }

    // 일자리 정보 저장
    public void saveJob(JobPostingRequest request) {
        JobPosting job = new JobPosting();

        job.setTitle(request.getTitle());
        job.setCategory(request.getCategory());
        job.setLocation(request.getLocation());
        job.setCompanyName(request.getCompany_name());
        job.setJobSource(JobSource.valueOf(request.getJobSource()));

        // 전화번호 입력값이 있으면 저장
        job.setContactPhone(request.getContact_phone());

        jobPostingRepository.save(job);
    }
}
