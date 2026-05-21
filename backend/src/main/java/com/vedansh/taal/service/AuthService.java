package com.vedansh.taal.service;

import com.vedansh.taal.entity.User;
import com.vedansh.taal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.vedansh.taal.dto.LoginRequest;
import com.vedansh.taal.jwt.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public String registerUser(User user){

        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return "Email already exits";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "User Registered Successfully";
    }

    public String loginUser(LoginRequest request){
        User user=userRepository.findByEmail(request.getEmail())
                .orElse(null);
        if(user==null){
            return "User not found.";
        }

        boolean passwordMatches=passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if(!passwordMatches){
            return "Invalid password";
        }

        String token=jwtUtil.generateToken(user.getEmail());

        return token;

    }
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}