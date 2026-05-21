package com.vedansh.taal.controller;

import com.vedansh.taal.entity.User;
import com.vedansh.taal.service.AuthService;
import com.vedansh.taal.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/test")
    public String test(){
        return "Auth controller working";
    }

    @PostMapping("/register")
        public String register(@RequestBody User user){
            return authService.registerUser(user);

        }
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){
        return authService.loginUser(request);
    }

    @GetMapping("/protected")
    public String protectedRoute(){
        return "This is a protected route";
    }

}

