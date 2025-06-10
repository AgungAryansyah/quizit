package dto

type HttpSuccess struct {
	Message string `json:"message" example:"Succes"`
	Payload any    `json:"payload" example:"{\"id\": 1, \"name\": \"John Doe\"}"`
}

type HttpError struct {
	Message string `json:"messgae" example:"Invalid token"`
	Error   error  `json:"error" example:"Article not found"`
}
