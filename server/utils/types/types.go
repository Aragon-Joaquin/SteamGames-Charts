package types

type ResolveVanityURL struct {
	Success bool   `json:"success"`
	Steamid int    `json:"steamid,omitempty"`
	Message string `json:"message,omitempty"`
}

type ISubEndpoints interface {
	ResolveVanityURL
}

type EndpointsStruct struct {
	Endpoint  string
	IsPrivate bool
}
