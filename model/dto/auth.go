package dto

type Register struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRes struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}

//todo: add validator
