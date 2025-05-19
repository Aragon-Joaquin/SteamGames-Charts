package types

type ResolveVanityURL struct {
	Success int    `json:"success"`
	Steamid string `json:"steamid,omitempty"`
	Message string `json:"message,omitempty"`
}

type ISubEndpoints interface {
	ResolveVanityURL
}

type EndpointsStruct struct {
	Endpoint  string
	IsPrivate bool
}
