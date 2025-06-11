package dto

type HttpSuccess struct {
	Message string `json:"message" example:"Succes"`
	Payload any    `json:"payload"`
}

type HttpError struct {
	Message string `json:"messgae" example:"Error type"`
	Error   string `json:"error" example:"Error message"`
}
