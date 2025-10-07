package com.bookhive.controller;

import com.bookhive.dto.BookRequest;
import com.bookhive.dto.BookResponse;
import com.bookhive.model.Book;
import com.bookhive.repo.BookRepository;
import com.bookhive.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/books")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookController {

    private final BookService service;
    private final BookRepository repo;

    public AdminBookController(BookService service, BookRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> listAll() {
        return ResponseEntity.ok(service.adminListAll());
    }

    @PostMapping
    public ResponseEntity<BookResponse> create(@RequestBody BookRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> update(@PathVariable("id") Long id, @RequestBody BookRequest req) {
        Book existing = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found: id=" + id));
        return ResponseEntity.ok(service.update(existing.getId(), req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Book not found: id=" + id);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
