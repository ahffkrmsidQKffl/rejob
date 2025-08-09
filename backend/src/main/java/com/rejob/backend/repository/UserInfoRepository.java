package com.rejob.backend.repository;

import com.rejob.backend.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    UserInfo findByUser_UserId(Long userId);

    boolean existsByUser_UserId(Long userId);
}
