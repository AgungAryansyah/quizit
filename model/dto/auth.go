package dto

type Register struct {
	Name     string `json:"name" validate:"required,min=6" binding:"required" example:"new user"`
	Email    string `json:"email" validate:"required,email" binding:"required" example:"user@example.com"`
	Password string `json:"password" validate:"required,password" binding:"required" example:"Strong_Password123"`
}

type LoginReq struct {
	Email    string `json:"email" validate:"required,email" binding:"required" example:"user@example.com"`
	Password string `json:"password" validate:"required,gte=8" binding:"required" example:"Strong_Password123"`
}

type LoginRes struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}
