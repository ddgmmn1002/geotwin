package com.geotwin.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

//	@Bean
//	CommandLineRunner checkDatabase(JdbcTemplate jdbcTemplate) {
//		return args -> {
//			Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM public.facilities", Long.class);
//			System.out.println("데이터 개수: " + count);
//		};
//	}
}
