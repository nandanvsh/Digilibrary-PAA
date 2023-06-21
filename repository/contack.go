package repository

import (
	"paa/model"

	"gorm.io/gorm"
)
type ContactRepository struct {
	Db *gorm.DB
}

func (r *ContactRepository) SaveContact(contact *model.Contact) error {
	return r.Db.Create(contact).Error
}