package com.rejob.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.rejob.backend.dto.response.RecommendJobResponse;
import com.rejob.backend.enums.JobSource;
import com.rejob.backend.infra.AiRecommenderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final AiRecommenderPort aiRecommender;

    public List<RecommendJobResponse> recommend(Long userInfoId) {
        JsonNode arr = aiRecommender.recommend(userInfoId);
        List<RecommendJobResponse> out = new ArrayList<>();
        if (arr == null || !arr.isArray()) return out;

        for (JsonNode n : arr) {
            String source = text(n, "source"); // stub/prod 공통
            if (!StringUtils.hasText(source)) continue;

            if ("노인일자리여기".equals(source)) {
                out.add(mapKorea(n));
            } else if ("사람인".equals(source)) {
                out.add(mapSaramin(n));
            }
        }
        return out;
    }

    private RecommendJobResponse mapKorea(JsonNode n) {
        // CSV 키에 맞춰 매핑
        String title    = coalesce(text(n, "직무요약"), left(text(n, "직무내용"), 60));
        String company  = text(n, "사업체명");
        String locBase  = text(n, "기관소재지");
        String locDet   = text(n, "근무지역(상세)");
        String location = join(locBase, locDet);
        String category = text(n, "사업유형");
        String phone    = normalizePhone(text(n, "연락처"));

        return RecommendJobResponse.builder()
                .job_id(null) // 모델이 별도 id를 줄 경우 여기 매핑
                .title(title)
                .company_name(company)
                .location(location)
                .category(category)
                .source(JobSource.노인일자리여기.name())
                .contact_phone(phone)
                .url(null)
                .build();
    }

    private RecommendJobResponse mapSaramin(JsonNode n) {
        String title    = text(n, "title");
        String company  = text(n, "company");
        String location = text(n, "location");
        String category = coalesce(text(n, "industry"), text(n, "employment_type"));
        String url      = text(n, "url");

        return RecommendJobResponse.builder()
                .job_id(null)
                .title(title)
                .company_name(company)
                .location(location)
                .category(category)
                .source(JobSource.사람인.name())
                .contact_phone(null)
                .url(url)
                .build();
    }

    /* ---------- utils ---------- */
    private static String text(JsonNode n, String k) {
        JsonNode v = n.get(k); return (v==null || v.isNull()) ? null : v.asText();
    }
    private static String coalesce(String a, String b) {
        return StringUtils.hasText(a) ? a : (StringUtils.hasText(b) ? b : null);
    }
    private static String left(String s, int len) {
        if (!StringUtils.hasText(s)) return null;
        return s.length() > len ? s.substring(0, len) + "…" : s;
    }
    private static String join(String a, String b) {
        if (!StringUtils.hasText(a)) return StringUtils.hasText(b) ? b.trim() : null;
        if (!StringUtils.hasText(b)) return a.trim();
        return (a.trim() + " " + b.trim()).trim();
    }
    private static String normalizePhone(String raw) {
        if (!StringUtils.hasText(raw)) return null;
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() == 10) return digits.replaceFirst("(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3");
        if (digits.length() == 11) return digits.replaceFirst("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
        return raw.trim();
    }
}
