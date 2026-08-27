package com.skillsync.utility;

import com.skillsync.entity.Users;
import com.skillsync.enums.AvailabilityStatus;
import com.skillsync.enums.RoleType;
import com.skillsync.repository.UsersRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usersRepository.count() > 0) return;

        String hash = passwordEncoder.encode("admin123");

        usersRepository.save(Users.builder()
                .fullName("Admin User").email("admin@skillsync.com").passwordHash(hash)
                .bio("Platform administrator").location("San Francisco, CA")
                .githubUrl("https://github.com/admin")
                .role(RoleType.ADMIN).availabilityStatus(AvailabilityStatus.OPEN).active(true).build());

        usersRepository.save(Users.builder()
                .fullName("Alex Johnson").email("alex@skillsync.com").passwordHash(hash)
                .bio("Full-stack developer passionate about open source").location("Austin, TX")
                .githubUrl("https://github.com/alexj").linkedinUrl("https://linkedin.com/in/alexj")
                .role(RoleType.USER).availabilityStatus(AvailabilityStatus.OPEN).active(true).build());

        usersRepository.save(Users.builder()
                .fullName("Priya Sharma").email("priya@skillsync.com").passwordHash(hash)
                .bio("ML engineer who loves building data-driven products").location("Seattle, WA")
                .githubUrl("https://github.com/priyas").linkedinUrl("https://linkedin.com/in/priyas")
                .role(RoleType.USER).availabilityStatus(AvailabilityStatus.OPEN).active(true).build());

        usersRepository.save(Users.builder()
                .fullName("Jordan Lee").email("jordan@skillsync.com").passwordHash(hash)
                .bio("UX designer with 5 years of product experience").location("New York, NY")
                .linkedinUrl("https://linkedin.com/in/jordanl")
                .role(RoleType.USER).availabilityStatus(AvailabilityStatus.PART_TIME).active(true).build());

        usersRepository.save(Users.builder()
                .fullName("Sam Rivera").email("sam@skillsync.com").passwordHash(hash)
                .bio("DevOps engineer obsessed with automation and reliability").location("Denver, CO")
                .githubUrl("https://github.com/samr")
                .role(RoleType.USER).availabilityStatus(AvailabilityStatus.BUSY).active(true).build());
    }
}
