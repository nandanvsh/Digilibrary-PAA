package handler

import (
	"net/http"
	"paa/model"
	"paa/utils"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetUserByUsername(c *gin.Context) {
	
	profile := c.MustGet("username").(string)
	c.HTML(http.StatusOK, "dasboard.html", gin.H{
		"User":  profile,
		"title": "Dasboard",
	})
}

func (h *Handler) CreateUser(c *gin.Context) {
	var user model.User
	err := c.ShouldBind(&user)

	if err != nil {
		resp := model.Response{
			Data:    nil,
			Message: "error binding user",
		}

		c.HTML(http.StatusBadRequest, "register.html", resp)
		return
	}

	err = h.booksRepo.CreateUser(&user)
	if err != nil {
		resp := model.Response{
			Data:    nil,
			Message: err.Error(),
		}

		c.HTML(http.StatusBadRequest, "register.html", resp)
		return
	}

	h.LoginUser(c)
}

func (h *Handler) LoginUser(c *gin.Context) {
	var user model.LoginRequest
	err := c.ShouldBind(&user)

	if err != nil {
		resp := model.Response{
			Data:    nil,
			Message: "error binding user",
		}

		c.HTML(http.StatusBadRequest, "login.html", resp)

		return
	}

	userGet, err := h.booksRepo.GetUserByUsername(user.Username)
	if err != nil {
		resp := model.Response{
			Data:    nil,
			Message: "error getting user",
		}

		c.HTML(http.StatusBadRequest, "login.html", resp)

		return
	}

	if userGet.Username == "" {
		resp := model.Response{
			Data:    nil,
			Message: "username not found",
		}

		c.HTML(http.StatusBadRequest, "login.html", resp)
		return
	}

	if userGet.Password != user.Password {
		resp := model.Response{
			Data:    nil,
			Message: "password is wrong",
		}

		c.HTML(http.StatusBadRequest, "login.html", resp)
		return
	}

	token, err := utils.GenerateToken(userGet)
	if err != nil {
		resp := model.Response{
			Data:    nil,
			Message: err.Error(),
		}

		c.HTML(http.StatusBadRequest, "login.html", resp)

		return
	}

	utils.SetCookie(c, token)

	c.Redirect(http.StatusFound, "/dasboard")
}

func (h *Handler) LogoutUser(c *gin.Context) {
	utils.DelCookie(c)
	resp := model.Response{
		Data:    nil,
		Message: "logout",
	}

	c.HTML(http.StatusOK, "login.html", resp)
}
