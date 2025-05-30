package types

// ! resolve vanity
type ResolveVanityURL struct {
	Success int    `json:"success"`
	Steamid string `json:"steamid,omitempty"`
	Message string `json:"message,omitempty"`
}

// ! games + players active
type GamesByConcurrentPlayers struct {
	Last_update uint32 `json:"last_update,omitempty"`
	Ranks       []struct {
		Rank               int    `json:"rank"`
		Appid              uint32 `json:"appid"`
		Concurrent_in_game uint32 `json:"concurrent_in_game"`
		Peak_in_game       uint32 `json:"peak_in_game"`
	}
}

// * all endpoints
type ISubEndpoints interface {
	ResolveVanityURL
	GamesByConcurrentPlayers
}

// * Endpoint Struct
type Steam_Endpoints int

const (
	STORE_STEAMPOWERED Steam_Endpoints = iota
	API_STEAMPOWERED
)

func (s Steam_Endpoints) ApiUrl() string {
	return [...]string{
		"https://store.steampowered.com",
		"https://api.steampowered.com",
	}[s]
}

type EndpointsStruct struct {
	Endpoint   string
	IsPrivate  bool
	DomainName Steam_Endpoints
}
