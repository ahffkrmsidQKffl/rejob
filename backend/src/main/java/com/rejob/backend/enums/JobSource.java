package com.rejob.backend.enums;

public enum JobSource {

    노인일자리여기(false), 고용24(true), 사람인(true);

    private final boolean requiresResume;

    JobSource(boolean requiresResume) {
        this.requiresResume = requiresResume;
    }

    public boolean requiresResume() {
        return requiresResume;
    }
}
