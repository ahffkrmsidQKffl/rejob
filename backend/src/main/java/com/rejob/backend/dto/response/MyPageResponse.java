package com.rejob.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MyPageResponse {

    private UserInfoResponse user_info;
    private List<ResumeSummaryResponse> resumes;
    private List<ApplicationSummaryResponse> applications;
}
