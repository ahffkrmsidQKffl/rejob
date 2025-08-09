package com.rejob.backend.infra;

import com.fasterxml.jackson.databind.JsonNode;

public interface AiCrawlerPort {

    JsonNode fetchKoreaJobs();
    JsonNode fetchSaraminJobs();
}
