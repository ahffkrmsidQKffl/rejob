package com.rejob.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecommendJobResponse {

    private Long job_id;           // nullable
    private String title;
    private String location;
    private String company_name;
    private String category;       // 사람인은 industry, 노인일자리여기는 사업유형 매핑
    private String source;         // "사람인" | "노인일자리여기"
    private String contact_phone;  // 노인일자리여기 전용
    private String url;            // 사람인 전용 (리다이렉트 버튼용)
}
