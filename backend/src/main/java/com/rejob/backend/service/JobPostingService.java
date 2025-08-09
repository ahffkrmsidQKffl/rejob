package com.rejob.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.rejob.backend.dto.request.JobPostingRequest;
import com.rejob.backend.dto.response.JobPostingResponse;
import com.rejob.backend.entity.JobPosting;
import com.rejob.backend.enums.JobSource;
import com.rejob.backend.infra.AiCrawlerPort;
import com.rejob.backend.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    //private final AiCrawlerClient aiCrawlerClient;
    private final AiCrawlerPort aiCrawlerClient; // 타입만 인터페이스로

    // 일자리 목록 조회
    public List<JobPostingResponse> getJobList(String region, String source) {
        JobSource jobSource = JobSource.valueOf(source);
        List<JobPosting> postings = jobPostingRepository.findAllByLocationContainingAndJobSource(region, jobSource);
        return postings.stream()
                .map(JobPostingResponse::new)
                .collect(Collectors.toList());
    }

    // 일자리 정보 저장(단건 저장)
    public void saveJob(JobPostingRequest request) {

        JobSource source = JobSource.valueOf(request.getJobSource());

        // 사람인은 항상 url 필요(프론트 단건 입력 시에도 권장)
        String normalizedPhone = (source == JobSource.노인일자리여기)
                ? normalizePhone(request.getContact_phone())
                : null;

        JobPosting job = new JobPosting();

        job.setTitle(trimOrNull(request.getTitle()));
        job.setCategory(trimOrNull(request.getCategory()));
        job.setLocation(trimOrNull(request.getLocation()));
        job.setCompanyName(trimOrNull(request.getCompany_name()));
        job.setJobSource(source);
        job.setContactPhone(normalizedPhone);
        job.setUrl(source == JobSource.사람인 ? trimOrNull(request.getJobSource()) : null); // 필요시 Request에 url 필드 추가 권장

        upsert(job);
    }

    /* ---------- NEW: FastAPI에서 끌어와서 저장 ---------- */
    @Transactional
    public int syncFromAI(String source) {
        JobSource jobSource = JobSource.valueOf(source);
        JsonNode root = (jobSource == JobSource.노인일자리여기)
                ? aiCrawlerClient.fetchKoreaJobs()
                : aiCrawlerClient.fetchSaraminJobs();

        if (root == null || !root.isArray()) return 0;

        int inserted = 0;
        for (JsonNode node : root) {
            Optional<JobPosting> maybe = (jobSource == JobSource.노인일자리여기)
                    ? mapKorea(node)
                    : mapSaramin(node);
            if (maybe.isEmpty()) continue;

            JobPosting job = maybe.get();
            boolean isNew = upsert(job);
            if (isNew) inserted++;
        }
        return inserted;
    }

    /* ---------- 매핑 ---------- */

    private Optional<JobPosting> mapKorea(JsonNode n) {
        // CSV 예시 키 기준, 실제 FastAPI 응답 키를 동일하게 맞추는 걸 권장
        String company  = get(n, "사업체명");
        String baseLoc  = get(n, "기관소재지");
        String detail   = get(n, "근무지역(상세)");
        String title    = coalesce(get(n, "직무요약"), left(get(n, "직무내용"), 60));
        String category = get(n, "사업유형");
        String phone    = normalizePhone(get(n, "연락처"));

        String location = join(baseLoc, detail);

        if (!StringUtils.hasText(title) || !StringUtils.hasText(company) || !StringUtils.hasText(location)) {
            return Optional.empty();
        }

        JobPosting job = new JobPosting();
        job.setTitle(title);
        job.setCompanyName(company);
        job.setLocation(location);
        job.setCategory(category);
        job.setContactPhone(phone);
        job.setJobSource(JobSource.노인일자리여기);
        job.setUrl(null);
        return Optional.of(job);
    }

    private Optional<JobPosting> mapSaramin(JsonNode n) {
        String title    = get(n, "title");
        String company  = get(n, "company");
        String location = get(n, "location");
        String category = coalesce(get(n, "industry"), get(n, "employment_type"));
        String url      = get(n, "url");

        if (!StringUtils.hasText(title) || !StringUtils.hasText(company) || !StringUtils.hasText(location)) {
            return Optional.empty();
        }

        JobPosting job = new JobPosting();
        job.setTitle(title);
        job.setCompanyName(company);
        job.setLocation(location);
        job.setCategory(category);
        job.setContactPhone(null);
        job.setJobSource(JobSource.사람인);
        job.setUrl(url);
        return Optional.of(job);
    }

    /* ---------- upsert & 유틸 ---------- */

    // 존재하면 업데이트(카테고리/전화/URL 등), 없으면 insert
    private boolean upsert(JobPosting incoming) {
        // 사람인은 url이 안정적인 중복 기준
        if (incoming.getJobSource() == JobSource.사람인 && StringUtils.hasText(incoming.getUrl())) {
            return jobPostingRepository.findByUrlAndJobSource(incoming.getUrl(), JobSource.사람인)
                    .map(found -> {
                        merge(found, incoming);
                        return false; // updated
                    })
                    .orElseGet(() -> {
                        jobPostingRepository.save(incoming);
                        return true; // inserted
                    });
        }

        // 노인일자리여기는 기존 기준 사용
        boolean exists = jobPostingRepository.existsByTitleAndCompanyNameAndLocationAndJobSource(
                incoming.getTitle(), incoming.getCompanyName(), incoming.getLocation(), incoming.getJobSource());

        if (exists) {
            // 동일 레코드 찾아서 업데이트
            // 단, existsBy*만 있으니 findOne을 위한 쿼리 메서드 추가를 권장.
            // 여기서는 단순 insert-무시 전략으로 갈 수도 있음.
            return false;
        } else {
            jobPostingRepository.save(incoming);
            return true;
        }
    }

    private void merge(JobPosting target, JobPosting src) {
        if (StringUtils.hasText(src.getCategory())) target.setCategory(src.getCategory());
        if (StringUtils.hasText(src.getContactPhone())) target.setContactPhone(src.getContactPhone());
        if (StringUtils.hasText(src.getLocation())) target.setLocation(src.getLocation());
        if (StringUtils.hasText(src.getTitle())) target.setTitle(src.getTitle());
        if (StringUtils.hasText(src.getCompanyName())) target.setCompanyName(src.getCompanyName());
        if (StringUtils.hasText(src.getUrl())) target.setUrl(src.getUrl());
        // 변경분만 반영 (save는 JPA가 영속 상태면 자동 flush)
    }


    private static String get(JsonNode n, String key) {
        JsonNode v = n.get(key);
        return (v == null || v.isNull()) ? null : v.asText();
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
    private static String trimOrNull(String s) { return s == null ? null : s.trim(); }

    private static String normalizePhone(String raw) {
        if (!StringUtils.hasText(raw)) return null;
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() == 10) return digits.replaceFirst("(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3");
        if (digits.length() == 11) return digits.replaceFirst("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
        return raw.trim();
    }
}
