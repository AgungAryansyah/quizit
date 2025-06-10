package dto

type Register struct {
	Name     string `json:"name" validate:"required,min=6" binding:"required" example:"user@example.com"`
	Email    string `json:"email" validate:"required,email" binding:"required" example:"strongpassword123"`
	Password string `json:"password" validate:"required,password" binding:"required" example:"strongpassword123"`
}

type LoginReq struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,gte=8"`
}

type LoginRes struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}
