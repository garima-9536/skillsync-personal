package com.skillsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class SkillSyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillSyncApplication.class, args);
    }
}
