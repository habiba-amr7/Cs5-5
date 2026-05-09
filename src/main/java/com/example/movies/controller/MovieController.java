package com.example.movies.controller;

import com.example.movies.model.Movie;
import com.example.movies.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MovieController {

    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Public: anyone can see and search movies
    @GetMapping("/api/movies")
    public List<Movie> getMovies(@RequestParam(required = false) String search) {
        if (search == null || search.trim().isEmpty()) {
            return movieRepository.findAll();
        }
        return movieRepository.findByTitleContainingIgnoreCase(search);
    }

    @GetMapping("/api/movies/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    // Admin only: add, update, delete movies
    @PostMapping("/api/admin/movies")
    public Movie addMovie(@RequestBody Movie movie) {
        movie.setId(null);
        return movieRepository.save(movie);
    }

    @PutMapping("/api/admin/movies/{id}")
    public Movie updateMovie(@PathVariable Long id, @RequestBody Movie newMovie) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setTitle(newMovie.getTitle());
        movie.setGenre(newMovie.getGenre());
        movie.setReleaseYear(newMovie.getReleaseYear());
        movie.setDescription(newMovie.getDescription());
        movie.setPosterUrl(newMovie.getPosterUrl());
        movie.setVideoUrl(newMovie.getVideoUrl());

        return movieRepository.save(movie);
    }

    @DeleteMapping("/api/admin/movies/{id}")
    public void deleteMovie(@PathVariable Long id) {
        movieRepository.deleteById(id);
    }
}
