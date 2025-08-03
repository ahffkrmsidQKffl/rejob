package com.rejob.backend.dto.response;

import com.rejob.backend.entity.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoResponse {

    private String name;
    private String birth;
    private String gender;
    private String job_experience;

    public UserInfoResponse(UserInfo info) {
        this.name = info.getName();
        this.birth = String.valueOf(info.getBirth());
        this.gender = String.valueOf(info.getGender());
        this.job_experience = info.getJobExperience();
    }
}
