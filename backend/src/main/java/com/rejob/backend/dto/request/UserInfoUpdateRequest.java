package com.rejob.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoUpdateRequest {

    private String name;
    private String birth;
    private String gender;
    private String job_experience;
}
