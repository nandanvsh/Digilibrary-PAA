package main

import (
	"fmt"
	"image"
	"math/rand"
	"net/http"
	"os"

	"encoding/json"
	_ "image/jpeg" // Import untuk mendukung format JPEG
	_ "image/png"  // Import untuk mendukung format PNG
	"log"
	"paa/database"
	"paa/handler"
	"paa/model"
	"paa/repository"
	"time"

	"github.com/go-resty/resty/v2"

	"github.com/gin-gonic/gin"
)
const baseURL = "https://openlibrary.org/search.json?q=*&limit=100"// Mengambil 10 buku secara acak


type Book struct {
	ID       string `json:"OLID"`
	Title            string   `json:"title"`
	CoverID          int      `json:"cover_i"`
	AuthorName       []string `json:"author_name"`
	FirstPublishYear int      `json:"first_publish_year"`
	Publisher        []string `json:"publisher"`
}



var credDB = model.Cred{
	Host:     "localhost",
	User:     "postgres",
	Password: "1234",
	DBName:   "books",
	Port:     5432,
}

func main() {
	db, err := database.ConnectDB(credDB)
	if err != nil {
		log.Fatalf("error connecting database: %v", err)
	}
		// Mengatur seed untuk generator angka acak
	rand.Seed(time.Now().UnixNano())

	file, err := os.Open("static/image/buku.jpg")
	if err != nil {
		fmt.Println("Terjadi kesalahan saat membuka file:", err)
		return
	}
	defer file.Close()

	// Dekode gambar
	img, _, err := image.Decode(file)
	if err != nil {
		fmt.Println("Terjadi kesalahan saat mendekode gambar:", err)
		return
	}

	// Menampilkan informasi gambar
	bounds := img.Bounds()
	width := bounds.Max.X
	height := bounds.Max.Y
	fmt.Println("Lebar gambar:", width)
	fmt.Println("Tinggi gambar:", height)

	repo := repository.NewBooksRepository(db)
	handler := handler.NewBooksHandler(repo)

	r := gin.Default()

	// load file html & css
	r.LoadHTMLGlob("views/*")
	r.Static("/static", "./static")

	// handler api auth
	r.POST("/register", handler.CreateUser)
	r.POST("/login", handler.LoginUser)
	r.POST("/logout", handler.LogoutUser)

	// handler api book
	r.POST("/book", handler.IsLogin, handler.CreateBook)
	r.GET("/book", handler.IsLogin, handler.IsAdmin, handler.GetAllBooks)
	r.POST("/book/:id", handler.IsLogin, handler.UpdateBook)
	r.DELETE("/book/:id", handler.IsLogin, handler.DeleteBook)

	// handler page auth
	r.GET("/", HomeHandler)
	r.GET("/Kontak",ContackHandler)
	r.GET("/login", handler.ShowLoginPage)
	r.GET("/register", handler.ShowRegisterPage)
	r.GET("/daftar",bookssHandler)
	r.GET("/list",ListHandler)
	r.GET("/dasboard", handler.IsLogin, DashboardHandler)
	r.GET("/profile", handler.IsLogin, ProfileHandler)
	r.GET("/request", handler.IsLogin, RequestHandler)

	

	// handler page book
	r.POST("/add-book", handler.IsLogin, handler.ShowAddBookPage)
	r.POST("/edit-book/:id", handler.IsLogin, handler.ShowEditBookPage)
	r.POST("/delete-book/:id", handler.IsLogin, handler.DeletePage)

	// Menampilkan pesan server berjalan
	fmt.Println("Server berjalan di http://localhost:8080")

	r.Run(":8080")
}

//handler untuk halaman Utama("/")
func ListHandler(c *gin.Context) {
	username := c.MustGet("username").(string)
	c.HTML(http.StatusOK, "list-book.html", gin.H{
		"title": "Home",
		"User" : username,
	})
}
func HomeHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "home.html", gin.H{
		"title": "Home",
	})
}
func RequestHandler(c *gin.Context) {
	username := c.MustGet("username").(string)
	c.HTML(http.StatusOK, "request_book.html", gin.H{
		"title": "Home",
		"User" : username,
	})
}
func ContackHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "contact.html", gin.H{
		"title": "Contact Us",

	})
	
}
func ProfileHandler(c *gin.Context) {
	username := c.MustGet("username").(string)
	c.HTML(http.StatusOK, "profile.html", gin.H{
		"title": "Contact Us",
		"User" : username,

	})}
func DashboardHandler(c *gin.Context) {
	username := c.MustGet("username").(string)
	books, err := getRandomBooks()
	if err != nil {
		log.Fatal("Failed to get random books:", err)
	}
	c.HTML(http.StatusOK, "dasboard.html", gin.H{
		"Books": books,
		"title": "Dasboard",
		"User" : username,

	})
}
func bookssHandler(c *gin.Context) {
	// Mengambil data buku secara acak dari Open Library API
	books, err := getRandomBooks()
	if err != nil {
		log.Fatal("Failed to get random books:", err)
	}
	// Menampilkan data buku ke halaman HTML menggunakan template
	c.HTML(http.StatusOK, "boks.html", gin.H{
		"Books": books,
		"title": "Daftar Buku",
	})
}
func getRandomBooks() ([]Book, error) {
		// Membuat klien HTTP menggunakan resty.Client
		client := resty.New()
	
		// Mengirim permintaan GET ke API Open Library
		response, err := client.R().
			SetHeader("Content-Type", "application/json").
			Get(baseURL)
	
		if err != nil {
			return nil, err
		}
		if response.StatusCode() != http.StatusOK {
			return nil, err
		}
		// Menguraikan respons JSON ke dalam variabel yang sesuai
		var data struct {
			Docs []Book `json:"docs"`
		}
		err = json.Unmarshal(response.Body(), &data)
		if err != nil {
			log.Fatal("Failed to parse response:", err)
		}
	
		// Mengacak urutan buku
		rand.Shuffle(len(data.Docs), func(i, j int) {
			data.Docs[i], data.Docs[j] = data.Docs[j], data.Docs[i]
		})	
		// Mengembalikan semua buku
		return data.Docs, nil
	}
	
	


	
	

