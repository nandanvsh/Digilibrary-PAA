package repository

import (
	"database/sql"
	"fmt"
)

type Book struct {
	ID       int
	Title    string
	Author   string
	Publisher string
	Year     int
}

type BookRepository struct {
	db *sql.DB
}

func NewBookRepository(db *sql.DB) *BookRepository {
	return &BookRepository{db: db}
}

func (r *BookRepository) SearchBooks(title string) ([]Book, error) {
	query := fmt.Sprintf("SELECT * FROM books WHERE title LIKE '%%%s%%'", title)

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []Book

	for rows.Next() {
		var book Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Publisher, &book.Year)
		if err != nil {
			return nil, err
		}
		books = append(books, book)
	}

	return books, nil
}
