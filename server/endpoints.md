#### Game details - No key required

https://store.steampowered.com/api/appdetails?appids=214170

(this is not documented. is just scraping)

- steam_appid (ID - int)
- name
<!-- - is_free (boolean) -->
- required_age
- short_description
- supported_languages (this is plain html)
- developers (array string)
- publisher (array string)
- price_overview
  - currency (string)
  - initial (int)
  - final (int)
  - discount_percent (int)
  - final_formatted: (string)
- genres (array string)
- release_date
  - date
- header_image (img string)

#### User owned games

https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXXXX&steamid=76561197960435530&format=json

- appid
- playtime_forever (in minutes)
- playtime_windows_forever (in minutes)
- playtime_linux_forever (in minutes)
- playtime_mac_forever (in minutes)
- rtime_last_played (unix i think)

#### GetFriendList

in some future
http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197960435530&relationship=friend

#### GetPlayerSummaries

http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=76561197960435530

- personastate (1,2,3,4,5,6)
- personaname (string)
- profileurl (url to steam)
- avatarfull (big img)
- lastlogoff (unix int)
<!-- - loccountrycode (country abbreviation) - in some future maybe-->
