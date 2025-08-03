package com.rejob.backend.controller;

import com.rejob.backend.common.ResponseData;
import com.rejob.backend.service.ResumeService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @DeleteMapping("/{resume_id}")
    public ResponseEntity<ResponseData<Void>> deleteResume(HttpSession session, @PathVariable("resume_id") Long resumeId) {
        Long userId = (Long) session.getAttribute("user_id");
        resumeService.deleteResume(userId, resumeId);

        return ResponseEntity.ok(new ResponseData<>(200, "마이페이지 - 이력서 삭제 성공", null));
    }
}
