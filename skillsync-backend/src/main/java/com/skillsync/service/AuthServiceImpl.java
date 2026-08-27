package com.skillsync.service;

import com.skillsync.dto.AuthResponseDTO;
import com.skillsync.dto.LoginRequestDTO;
import com.skillsync.dto.RegisterRequestDTO;
import com.skillsync.entity.Users;
import com.skillsync.repository.UsersRepository;
import com.skillsync.security.JwtUtil;
import com.skillsync.utility.SkillSyncException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service(value = "authService")
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UsersRepository usersRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO dto) throws SkillSyncException {
        if (usersRepository.existsByEmail(dto.getEmail())) {
            throw new SkillSyncException("Service.EMAIL_ALREADY_EXISTS");
        }
        Users user = Users.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .bio(dto.getBio())
                .location(dto.getLocation())
                .githubUrl(dto.getGithubUrl())
                .linkedinUrl(dto.getLinkedinUrl())
                .build();
        user = usersRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponseDTO.builder()
                .token(token)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) throws SkillSyncException {
        Users user = usersRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new SkillSyncException("Service.INVALID_CREDENTIALS"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new SkillSyncException("Service.INVALID_CREDENTIALS");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponseDTO.builder()
                .token(token)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
