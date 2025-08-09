package com.rejob.backend.dto.request;

import lombok.Getter;

@Getter
public class UserRegisterRequest {
    private String email;
    private String password;
}
