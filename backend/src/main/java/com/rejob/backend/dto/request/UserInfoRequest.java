package com.rejob.backend.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoRequest {

    @NotBlank(message = "이름 입력은 필수입니다.")
    private String name;

    @NotBlank(message = "생년월일 입력은 필수입니다.")
    private String birth;

    @NotBlank(message = "성별 입력은 필수입니다.")
    private String gender;

    private String job_experience;
}
