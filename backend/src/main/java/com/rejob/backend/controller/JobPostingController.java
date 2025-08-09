package com.rejob.backend.controller;

import com.rejob.backend.common.ResponseData;
import com.rejob.backend.dto.request.JobPostingRequest;
import com.rejob.backend.dto.response.JobPostingResponse;
import com.rejob.backend.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @GetMapping()
    public ResponseEntity<ResponseData<List<JobPostingResponse>>> getJobs(@RequestParam String region, @RequestParam String source) {
        List<JobPostingResponse> jobs = jobPostingService.getJobList(region, source);
        return ResponseEntity.ok(new ResponseData<>(200, "일자리 목록 조회 성공", jobs));
    }

    @PostMapping()
    public ResponseEntity<ResponseData<Void>> saveJobs(@RequestBody JobPostingRequest request) {
        jobPostingService.saveJob(request);
        return ResponseEntity.ok(new ResponseData<>(201, "일자리 정보 저장 성공", null));
    }

    // AI 크롤러에서 당겨와 저장
    @PostMapping("/sync")
    public ResponseEntity<ResponseData<Integer>> syncFromAI(@RequestParam String source) {
        int inserted = jobPostingService.syncFromAI(source); // source: 사람인 | 노인일자리여기
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(201, "AI 동기화 성공", inserted));
    }
}
