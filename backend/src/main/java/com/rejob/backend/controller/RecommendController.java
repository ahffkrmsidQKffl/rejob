package com.rejob.backend.controller;

import com.rejob.backend.common.ResponseData;
import com.rejob.backend.dto.request.RecommendJobRequest;
import com.rejob.backend.dto.response.RecommendJobResponse;
import com.rejob.backend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    // POST /api/jobs/recommend
    @PostMapping("/recommend")
    public ResponseEntity<ResponseData<List<RecommendJobResponse>>> recommend(@RequestBody RecommendJobRequest request) {
        List<RecommendJobResponse> list = recommendService.recommend(request.getUser_info_id());
        return ResponseEntity.ok(new ResponseData<>(200, "추천 일자리 조회 성공", list));
    }
}
