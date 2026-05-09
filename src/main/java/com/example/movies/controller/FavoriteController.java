package com.example.movies.controller;

import com.example.movies.model.AppUser;
import com.example.movies.model.Favorite;
import com.example.movies.model.Movie;
import com.example.movies.repository.AppUserRepository;
import com.example.movies.repository.FavoriteRepository;
import com.example.movies.repository.MovieRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final AppUserRepository userRepository;
    private final MovieRepository movieRepository;

    public FavoriteController(FavoriteRepository favoriteRepository,
                              AppUserRepository userRepository,
                              MovieRepository movieRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    @GetMapping
    public List<Movie> getFavorites(Authentication authentication) {
        AppUser user = getCurrentUser(authentication);
        return favoriteRepository.findByUser(user)
                .stream()
                .map(Favorite::getMovie)
                .toList();
    }

    @PostMapping("/{movieId}")
    public String addFavorite(@PathVariable Long movieId, Authentication authentication) {
        AppUser user = getCurrentUser(authentication);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (favoriteRepository.findByUserAndMovie(user, movie).isEmpty()) {
            favoriteRepository.save(new Favorite(user, movie));
        }
        return "Added to favorites";
    }

    @Transactional
    @DeleteMapping("/{movieId}")
    public String removeFavorite(@PathVariable Long movieId, Authentication authentication) {
        AppUser user = getCurrentUser(authentication);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        favoriteRepository.deleteByUserAndMovie(user, movie);
        return "Removed from favorites";
    }

    private AppUser getCurrentUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
