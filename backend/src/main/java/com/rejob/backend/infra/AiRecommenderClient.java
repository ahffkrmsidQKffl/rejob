package com.rejob.backend.infra;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@Profile("prod")
@RequiredArgsConstructor
public class AiRecommenderClient implements AiRecommenderPort{

    private final WebClient webClient = WebClient.builder().build();

    @Value("${ai.base-url}")
    private String aiBaseUrl;

    @Override
    public JsonNode recommend(Long userInfoId) {
        return webClient.post()
                .uri(aiBaseUrl + "/recommend") // FastAPI: POST /recommend
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"user_info_id\":" + userInfoId + "}")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }
}
