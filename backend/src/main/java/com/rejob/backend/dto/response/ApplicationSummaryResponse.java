package com.rejob.backend.dto.response;

import com.rejob.backend.entity.Application;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApplicationSummaryResponse {

    private Long application_id;
    private String title;
    private String region;
    private String applied_at;
    private String extra_info;

    public ApplicationSummaryResponse(Application application) {
        this.application_id = application.getApplicationId();
        this.title = application.getTitle();
        this.region = application.getRegion();
        this.applied_at = String.valueOf(application.getAppliedAt());
        this.extra_info = application.getExtraInfo();
    }
}
