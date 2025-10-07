package com.bookhive.service;

import com.bookhive.dto.BookRequest;
import com.bookhive.dto.BookResponse;
import com.bookhive.model.Book;
import com.bookhive.repo.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public List<BookResponse> publicList() {
        return repo.findByPublishedTrueOrderByIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<BookResponse> adminListAll() {
        return repo.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public BookResponse create(BookRequest req) {
        Book b = new Book();
        b.setName(req.getName());
        b.setCategory(req.getCategory());
        b.setPrice(req.getPrice());
        b.setQuantity(req.getQuantity());
        b.setDiscount(req.getDiscount() == null ? 0 : req.getDiscount());
        b.setPublished(Boolean.TRUE.equals(req.getPublished()));
        b.setCoverUrl(req.getCoverUrl());
        repo.save(b);

        // Generate human-readable code after we have an ID
        b.setBookId("BK" + String.format("%04d", b.getId() + 1000));
        repo.save(b);

        return toDto(b);
    }

    public BookResponse update(Long id, BookRequest req) {
        Book b = repo.findById(id).orElseThrow();
        b.setName(req.getName());
        b.setCategory(req.getCategory());
        b.setPrice(req.getPrice());
        b.setQuantity(req.getQuantity());
        b.setDiscount(req.getDiscount() == null ? 0 : req.getDiscount());
        b.setPublished(Boolean.TRUE.equals(req.getPublished()));
        b.setCoverUrl(req.getCoverUrl());
        repo.save(b);
        return toDto(b);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private BookResponse toDto(Book b) {
        BookResponse dto = new BookResponse();
        dto.setId(b.getId());
        dto.setBookId(b.getBookId());
        dto.setName(b.getName());
        dto.setCategory(b.getCategory());
        dto.setPrice(b.getPrice());
        dto.setQuantity(b.getQuantity());
        dto.setDiscount(b.getDiscount());
        dto.setPublished(b.getPublished());
        dto.setCoverUrl(b.getCoverUrl());
        return dto;
    }
}
