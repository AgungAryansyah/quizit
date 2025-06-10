package dto

type HttpSuccess struct {
	Message string `json:"message" example:"Succes"`
	Payload any    `json:"payload"`
}

type HttpError struct {
	Message string `json:"messgae" example:"Invalid token"`
	Error   error  `json:"error" example:"Article not found"`
}
