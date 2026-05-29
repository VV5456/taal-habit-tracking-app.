package com.vedansh.taal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TaalApplication {
	@Bean
	CommandLineRunner testEnv() {
		return args -> {
			System.out.println("=================================");
			System.out.println("DB_URL = " + System.getenv("DB_URL"));
			System.out.println("=================================");
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(TaalApplication.class, args);
	}

}
