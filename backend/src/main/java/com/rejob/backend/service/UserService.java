package com.rejob.backend.service;

import ch.qos.logback.core.spi.ErrorCodes;
import com.rejob.backend.dto.request.UserInfoUpdateRequest;
import com.rejob.backend.dto.request.UserRegisterRequest;
import com.rejob.backend.dto.response.UserInfoResponse;
import com.rejob.backend.entity.User;
import com.rejob.backend.entity.UserInfo;
import com.rejob.backend.exception.CustomException;
import com.rejob.backend.repository.UserInfoRepository;
import com.rejob.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;
    private final PasswordEncoder passwordEncoder;

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

    public UserInfoResponse getUserInfo(Long userId) {
        UserInfo userInfo = userInfoRepository.findByUser_UserId(userId);

        if(userInfo == null) {
            throw new CustomException("해당 사용자를 찾을 수 없습니다.");
        }

        return new UserInfoResponse(userInfo);
    }

    @Transactional
    public void updateUserInfo(Long userId, UserInfoUpdateRequest request) {
        UserInfo info = userInfoRepository.findByUser_UserId(userId);

        if(info == null) {
            throw new CustomException("해당 사용자를 찾을 수 없습니다.");
        }

        info.updateInfo(request.getName(), request.getBirth(), request.getGender(), request.getJob_experience());
    }
}
