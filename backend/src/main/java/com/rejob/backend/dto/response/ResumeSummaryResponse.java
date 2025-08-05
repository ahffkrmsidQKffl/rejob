package com.rejob.backend.dto.response;

import com.rejob.backend.entity.Resume;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResumeSummaryResponse {

    private Long resume_id;
    private String title;
    private String region;
    private String created_at;

    public ResumeSummaryResponse(Resume resume) {
        this.resume_id = resume.getResumeId();
        this.title = resume.getTitle();
        this.region = resume.getRegion();
        this.created_at = String.valueOf(resume.getCreatedAt());
    }
}
