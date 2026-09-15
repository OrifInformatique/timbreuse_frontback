package ch.sectioninformatique.template.log;

import ch.sectioninformatique.template.user.User;
import ch.sectioninformatique.template.user.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import ch.sectioninformatique.template.security.Role;
import ch.sectioninformatique.template.security.RoleEnum;
import ch.sectioninformatique.template.security.RoleRepository;

import org.springframework.core.annotation.Order;

import java.util.Arrays;

@Component
@Order(3)
public class LogSeeder implements CommandLineRunner {

    private final LogRepository logRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public LogSeeder(LogRepository logRepository, UserRepository userRepository, RoleRepository roleRepository) {
        this.logRepository = logRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting Log Seeding...");
        loadLogData();
        System.out.println("Log Seeding completed.");
    }

    private void loadLogData() {
        if (logRepository.count() == 0) {
            Role userRole = roleRepository.findByName(RoleEnum.USER)
					.orElseThrow(() -> new RuntimeException("Role USER not found"));
			Role managerRole = roleRepository.findByName(RoleEnum.MANAGER)
					.orElseThrow(() -> new RuntimeException("Role MANAGER not found"));
			Role adminRole = roleRepository.findByName(RoleEnum.ADMIN)
					.orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

            User user0 = User.builder()
					.firstName("deleted")
					.lastName("user")
					.login("deleted.user@test.com")
					.mainRole(userRole)
					.build();

            User user1 = User.builder()
					.firstName("Jane")
					.lastName("SMITH")
					.login("jane.smith@test.com")
					.mainRole(managerRole)
					.build();

            User user2 = User.builder()
					.firstName("Super")
					.lastName("Admin")
					.login("super.admin@test.com")
					.mainRole(adminRole)
					.build();

            Log log1 = new Log(0, user0, "09.09.2026 08:00:00", 0, "09.09.2026 08:00:00", "09.09.2026 08:00:00", 0);
            Log log2 = new Log(1, user1, "09.09.2026 09:45:00", 1, "09.09.2026 09:45:00", "09.09.2026 09:45:00", 0);
            Log log3 = new Log(2, user2, "09.09.2026 10:30:00", 0, "09.09.2026 10:30:00", "09.09.2026 10:30:00", 0);

            logRepository.saveAll(Arrays.asList(log1, log2, log3));
        
        } else {
            System.out.println("Logs already exist in the database. Skipping log seeding.");
        }
    }


}