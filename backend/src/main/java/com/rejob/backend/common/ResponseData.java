package com.rejob.backend.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResponseData<T> {
    private int status;
    private String message;
    private T data;
}
