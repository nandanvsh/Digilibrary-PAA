package model

type User struct {
	ID       int    `gorm:"type:int;primaryKey"`
	Username string `gorm:"type:varchar(20);not null;unique" json:"username" form:"username"`
	Password string `gorm:"type:varchar(20);not null" json:"password" form:"password"`
	IsAdmin  bool   `gorm:"type:bool;not null; default:false" json:"user_type"`
}

type LoginRequest struct {
	Username string `form:"username"`
	Password string `form:"password"`
}
