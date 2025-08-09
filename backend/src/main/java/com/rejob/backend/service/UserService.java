package com.rejob.backend.service;

import com.rejob.backend.dto.request.UserInfoRequest;
import com.rejob.backend.dto.request.UserInfoUpdateRequest;
import com.rejob.backend.dto.request.UserRegisterRequest;
import com.rejob.backend.dto.response.MyPageResponse;
import com.rejob.backend.dto.response.UserInfoResponse;
import com.rejob.backend.entity.User;
import com.rejob.backend.entity.UserInfo;
import com.rejob.backend.enums.Gender;
import com.rejob.backend.exception.CustomException;
import com.rejob.backend.repository.UserInfoRepository;
import com.rejob.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    public void register(UserRegisterRequest request) {

        // 이메일 중복 검사
        if(userRepository.existsByEmail(request.getEmail())){
            throw new CustomException("이미 존재하는 이메일입니다.");
        }

        // 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(request.getPassword());

        // User 엔티티 생성
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encryptedPassword);

        // db 저장
        userRepository.save(user);
    }

    // 마이페이지 조회
    @Transactional(readOnly = true)
    public MyPageResponse getMyPageInfo(Long userId) {
        // 사용자 정보 조회
        UserInfo userInfo = userInfoRepository.findByUser_UserId(userId);
        if(userInfo == null) {
            throw new CustomException("해당 사용자를 찾을 수 없습니다.");
        }
/** 이력서, 접수 내역 부분 삭제
        // 이력서 목록 조회
        List<Resume> resumeList = resumeRepository.findAllByUser_UserId(userId);
        List<ResumeSummaryResponse> resumes = resumeList.stream()
                .map(ResumeSummaryResponse::new)
                .collect(Collectors.toList());

        // 지원 내역 조회
        List<Application> applicationList = applicationRepository.findAllByUser_UserId(userId);
        List<ApplicationSummaryResponse> applications = applicationList.stream()
                .map(ApplicationSummaryResponse::new)
                .collect(Collectors.toList());
**/
        // 응답 구성
        return new MyPageResponse(
                new UserInfoResponse(userInfo)
        );
    }

    // 마이페이지 수정 - 개인정보
    @Transactional
    public void updateUserInfo(Long userId, UserInfoUpdateRequest request) {
        UserInfo info = userInfoRepository.findByUser_UserId(userId);

        if(info == null) {
            throw new CustomException("해당 사용자를 찾을 수 없습니다.");
        }

        info.updateInfo(request.getName(), request.getBirth(), request.getGender(), request.getJob_experience());
    }

    // 필수 정보 저장
    @Transactional
    public UserInfoResponse saveUserInfo(UserInfoRequest request, Long userId) {
        UserInfo info = new UserInfo();

        // 회원인 경우 User 설정
        if(userId != null) {
            User user = userRepository.findByUserId(userId);
            if(user == null) {
                throw new CustomException("해당 사용자가 존재하지 않습니다.");
            }

            info.setUser(user);

            // 중복 방지: 이미 등록된 경우 예외
            if(userInfoRepository.existsByUser_UserId(userId)) {
                throw new CustomException("이미 정보가 등록되어 있습니다.");
            }
        }

        // 필수 정보 저장
        info.setName(request.getName());
        info.setBirth(LocalDate.parse(request.getBirth()));
        info.setGender(Gender.valueOf(request.getGender()));

        info.setJobExperience(request.getJob_experience());

        UserInfo saved = userInfoRepository.save(info);
        return new UserInfoResponse(saved);
    }
}
