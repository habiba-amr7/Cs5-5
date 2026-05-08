package com.example.movies;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MoviesWebsiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoviesWebsiteApplication.class, args);
    }

    @Bean
    CommandLineRunner addDemoData(MovieRepository movieRepository,
                                  AppUserRepository userRepository,
                                  PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new AppUser("admin", passwordEncoder.encode("admin123"), "ADMIN"));
                userRepository.save(new AppUser("user", passwordEncoder.encode("user123"), "USER"));
            }

            if (movieRepository.count() == 0) {
                movieRepository.save(new Movie(
                        "Interstellar",
                        "Sci-Fi",
                        2014,
                        "A team travels through a wormhole to save humanity.",
                        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=900",
                        "https://www.youtube.com/embed/zSWdZVtXT7E"
                ));
                movieRepository.save(new Movie(
                        "The Dark Knight",
                        "Action",
                        2008,
                        "Batman faces the Joker in Gotham City.",
                        "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=900",
                        "https://www.youtube.com/embed/EXeTwQWrcwY"
                ));
                movieRepository.save(new Movie(
                        "Inception",
                        "Thriller",
                        2010,
                        "A thief enters dreams to steal and plant ideas.",
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900",
                        "https://www.youtube.com/embed/YoHD9XEInc0"
                ));
            }
        };
    }
}
