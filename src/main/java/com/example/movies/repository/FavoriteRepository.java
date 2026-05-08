package com.example.movies.repository;

import com.example.movies.model.AppUser;
import com.example.movies.model.Favorite;
import com.example.movies.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(AppUser user);
    Optional<Favorite> findByUserAndMovie(AppUser user, Movie movie);
    void deleteByUserAndMovie(AppUser user, Movie movie);
}
