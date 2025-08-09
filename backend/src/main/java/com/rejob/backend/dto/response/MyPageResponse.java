package com.rejob.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class MyPageResponse {

    private UserInfoResponse user_info;
    // private List<ResumeSummaryResponse> resumes; 이력서 필드 삭제
    // private List<ApplicationSummaryResponse> applications; 접수 내역 필드 삭제
}
