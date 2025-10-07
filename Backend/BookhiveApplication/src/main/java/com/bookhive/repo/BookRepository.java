package com.bookhive.repo;

import com.bookhive.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {
    List<Book> findByPublishedTrueOrderByIdAsc();
}
