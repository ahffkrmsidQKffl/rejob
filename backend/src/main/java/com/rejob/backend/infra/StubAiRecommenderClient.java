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
public class StubAiRecommenderClient implements AiRecommenderPort{

    private final ObjectMapper om = new ObjectMapper();

    @Override
    public JsonNode recommend(Long userInfoId) {
        // 간단 목: 두 CSV에서 각각 일부 샘플을 뽑아 하나의 JSON 배열로 합침
        ArrayNode result = om.createArrayNode();
        result.addAll(readKoreaTopN(8));   // 노인일자리여기 샘플
        result.addAll(readSaraminTopN(8)); // 사람인 샘플
        return result;
    }

    private ArrayNode readKoreaTopN(int n) {
        return csvToArray("mock/korea_jobs_fixed16_final.csv", n, true);
    }
    private ArrayNode readSaraminTopN(int n) {
        return csvToArray("mock/senior_jobs_fixed.csv", n, false);
    }

    private ArrayNode csvToArray(String classpathCsv, int limit, boolean korea) {
        ArrayNode arr = om.createArrayNode();
        try (CSVReader reader = new CSVReader(new InputStreamReader(
                new ClassPathResource(classpathCsv).getInputStream(), StandardCharsets.UTF_8))) {

            String[] header = reader.readNext();
            if (header == null) return arr;
            Map<String,Integer> idx = index(header);

            String[] row; int cnt = 0;
            while ((row = reader.readNext()) != null && cnt < limit) {
                ObjectNode o = om.createObjectNode();
                if (korea) {
                    o.put("source", "노인일자리여기");
                    put(o, "사업체명", row, idx);
                    put(o, "기관소재지", row, idx);
                    put(o, "근무지역(상세)", row, idx);
                    put(o, "직무요약", row, idx);
                    put(o, "사업유형", row, idx);
                    put(o, "연락처", row, idx);
                    put(o, "직무내용", row, idx); // fallback용
                } else {
                    o.put("source", "사람인");
                    put(o, "title", row, idx);
                    put(o, "company", row, idx);
                    put(o, "location", row, idx);
                    put(o, "industry", row, idx);
                    put(o, "employment_type", row, idx);
                    put(o, "url", row, idx);
                }
                arr.add(o);
                cnt++;
            }
        } catch (Exception e) {
            throw new RuntimeException("Stub recommend CSV load failed: " + classpathCsv, e);
        }
        return arr;
    }

    private Map<String,Integer> index(String[] header) {
        Map<String,Integer> m = new HashMap<>();
        for (int i=0;i<header.length;i++) m.put(header[i].trim(), i);
        return m;
    }
    private void put(ObjectNode o, String key, String[] row, Map<String,Integer> idx) {
        Integer i = idx.get(key);
        if (i != null && 0 <= i && i < row.length) o.put(key, row[i]); else o.putNull(key);
    }
}
