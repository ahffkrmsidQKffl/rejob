package com.rejob.backend.infra;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@Profile("prod")
@RequiredArgsConstructor
public class AiCrawlerClient implements AiCrawlerPort {

    private final WebClient webClient = WebClient.builder().build();

    @Value("${ai.base-url}")
    private String aiBaseUrl;

    // 예: GET {base}/crawl/korea  또는  GET {base}/crawl/saramin
    public JsonNode fetchKoreaJobs() {
        return webClient.get()
                .uri(aiBaseUrl + "/crawl/korea")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.error(new RuntimeException("AI 호출 실패(korea)", e)))
                .block();
    }

    public JsonNode fetchSaraminJobs() {
        return webClient.get()
                .uri(aiBaseUrl + "/crawl/saramin")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> Mono.error(new RuntimeException("AI 호출 실패(saramin)", e)))
                .block();
    }
}
