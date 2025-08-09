package com.rejob.backend.infra;

import com.fasterxml.jackson.databind.JsonNode;

public interface AiRecommenderPort {
    JsonNode recommend(Long userInfoId);
}
