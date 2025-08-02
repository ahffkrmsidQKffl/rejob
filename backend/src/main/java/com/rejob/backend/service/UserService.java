package com.rejob.backend.service;

import com.rejob.backend.dto.request.UserRegisterRequest;
import com.rejob.backend.entity.User;
import com.rejob.backend.exception.CustomException;
import com.rejob.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
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
}
