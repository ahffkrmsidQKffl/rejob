package com.rejob.backend.dto.response;

import com.rejob.backend.entity.JobPosting;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobPostingResponse {
    private Long job_id;
    private String title;
    private String category;
    private String location;
    private String company_name;
    private String source;
    private boolean requires_resume;
    private String contact_phone;

    public JobPostingResponse(JobPosting job) {
        this.job_id = job.getJobId();
        this.title = job.getTitle();
        this.category = job.getCategory();
        this.company_name = job.getCompanyName();
        this.location = job.getLocation();
        this.source = job.getJobSource().name();
        this.requires_resume = job.getJobSource().requiresResume();
        this.contact_phone = job.getContactPhone();
    }
}
