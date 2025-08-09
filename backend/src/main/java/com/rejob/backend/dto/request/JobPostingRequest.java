package com.rejob.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobPostingRequest {

    private String title;
    private String company_name;
    private String location;
    private String category;
    private String contact_phone;
    private String jobSource; // ENUM 문자열
}
