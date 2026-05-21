package com.vedansh.taal.dto;

public class LoginRequest {

    public String email;
    private String password;

    public LoginRequest(){

    }
    public String getEmail(){
        return email;
    }
    public String getPassword(){
        return password;
    }
}
