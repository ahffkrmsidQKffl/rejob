package com.rejob.backend.controller;

import com.rejob.backend.common.ResponseData;
import com.rejob.backend.dto.request.UserInfoRequest;
import com.rejob.backend.dto.request.UserInfoUpdateRequest;
import com.rejob.backend.dto.request.UserRegisterRequest;
import com.rejob.backend.dto.response.MyPageResponse;
import com.rejob.backend.dto.response.UserInfoResponse;
import com.rejob.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<ResponseData<Void>> register(@RequestBody UserRegisterRequest request){
        userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(201, "회원가입 성공", null));
    }

    // 마이페이지 조회
    @GetMapping("/me")
    public ResponseEntity<ResponseData<MyPageResponse>> getMyPageInfo(HttpSession session) {
        Long userId = (Long) session.getAttribute("user_id");
        MyPageResponse dto = userService.getMyPageInfo(userId);

        return ResponseEntity.ok(new ResponseData<>(200, "마이페이지 조회 성공", dto));
    }

    // 마이페이지 수정
    @PatchMapping("/me")
    public ResponseEntity<ResponseData<Void>> updateMyPageInfo(HttpSession session, @RequestBody UserInfoUpdateRequest request) {
        Long userId = (Long) session.getAttribute("user_id");
        userService.updateUserInfo(userId, request);

        return ResponseEntity.ok(new ResponseData<>(200, "마이페이지 - 개인정보 수정 성공", null));
    }

    // 필수 정보 저장
    @PostMapping("/info")
    public ResponseEntity<ResponseData<UserInfoResponse>> createUserInfo(HttpSession session, @RequestBody UserInfoRequest request) {

        // 로그인 여부 체크
        Long userId = (Long) session.getAttribute("user_id");

        UserInfoResponse saved = userService.saveUserInfo(request, userId);
        return ResponseEntity.ok(new ResponseData<>(201, "필수 정보 입력 성공", saved));
    }
}
