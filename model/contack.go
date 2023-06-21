package model

type Contact struct {
	ID      int    `gorm:"type:int;primaryKey"`
	Name    string `gorm:"type:varchar(50);not null" json:"name" form:"name"`
	Email   string `gorm:"type:varchar(50)" json:"email" form:"email"`
	Message string `gorm:"type:text;not null" json:"message" form:"message"`
}
type ContackRequest struct {
	Name    string `form:"fullname"`
	Email   string `form:"email"`
	Message string `form:"message"`
}