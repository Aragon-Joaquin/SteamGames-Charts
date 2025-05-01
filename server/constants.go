package main

const (
	API_URL = "http://api.steampowered.com/ISteamUserStats/"
)

var API_ENDPOINTS = map[string]string{
	"getPlayerData": "GetPlayerSummaries/v0002/",
	"getFriends":    "GetFriendList/v0001/",
	"getStats":      "GetUserStatsForGame/v0002/",
}
