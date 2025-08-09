package com.rejob.backend.infra;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.opencsv.CSVReader;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
@Profile("stub")
public class StubAiCrawlerClient implements AiCrawlerPort{
    private final ObjectMapper om = new ObjectMapper();

    @Override
    public JsonNode fetchKoreaJobs() {
        // 노인일자리여기 CSV → JSON 배열 (키는 실제 매핑에서 쓰는 한글 헤더 유지)
        return readCsvToArray(
                "mock/korea_jobs_fixed16_final.csv",
                new String[]{
                        "사업체명","기관소재지","근무지역(상세)","직무요약","사업유형",
                        "연락처","직무내용" // fallback 용
                }
        );
    }

    @Override
    public JsonNode fetchSaraminJobs() {
        // 사람인 CSV → JSON 배열 (title/company/location/industry/url)
        return readCsvToArray(
                "mock/senior_jobs_fixed.csv",
                new String[]{
                        "title","company","location","industry","employment_type","url"
                }
        );
    }

    private ArrayNode readCsvToArray(String classpathCsv, String[] allowKeys) {
        ArrayNode arr = om.createArrayNode();
        try (CSVReader reader = new CSVReader(new InputStreamReader(
                new ClassPathResource(classpathCsv).getInputStream(), StandardCharsets.UTF_8))) {

            String[] header = reader.readNext();
            if (header == null) return arr;

            Map<String, Integer> idx = index(header);
            String[] row;
            while ((row = reader.readNext()) != null) {
                ObjectNode obj = om.createObjectNode();
                for (String key : allowKeys) {
                    Integer i = idx.get(key);
                    if (i != null && i >= 0 && i < row.length) {
                        obj.put(key, row[i]);
                    } else {
                        obj.putNull(key);
                    }
                }
                arr.add(obj);
            }
        } catch (Exception e) {
            throw new RuntimeException("Stub CSV 로딩 실패: " + classpathCsv, e);
        }
        return arr;
    }

    private Map<String, Integer> index(String[] header) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            map.put(header[i].trim(), i);
        }
        return map;
    }
}
