package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.72

import (
	"context"
	"errors"
	"serverGo/graph/model"
	u "serverGo/utils"
	t "serverGo/utils/types"
	"strconv"
)

// GetGameDetails is the resolver for the getGameDetails field.
func (r *queryResolver) GetGameDetails(ctx context.Context, steamAppid int64) (*model.GDetailsRes, error) {
	end, err := u.ConstructEndpoint(t.GetGameDetails)

	if err != nil {
		return nil, err
	}

	steamidString := strconv.FormatInt(steamAppid, 10)
	end.AddQueries(u.QueriesStruct{Key: "appids", Val: steamidString})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	var wrapper map[string]*model.GDetailsRes

	val, err := u.UnmarshalMapping(wrapper, &resp.BodyResponse, steamidString)

	if err != nil {
		return nil, err
	}

	return val, nil
}

// GetUserOwnedGames is the resolver for the getUserOwnedGames field.
func (r *queryResolver) GetUserOwnedGames(ctx context.Context, steamid int64) (*model.UOGamesRes, error) {
	end, err := u.ConstructEndpoint(t.GetOwnGames)

	if err != nil {
		return nil, err
	}

	steamidString := strconv.FormatInt(steamid, 10)
	end.AddQueries(
		u.QueriesStruct{Key: "steamid", Val: steamidString},
		u.QueriesStruct{Key: "include_played_free_games", Val: "true"},
		u.QueriesStruct{Key: "include_appinfo", Val: "true"})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	var wrapper map[string]*model.UOGamesRes
	res, err := u.UnmarshalMapping(wrapper, &resp.BodyResponse, "response")

	if err != nil {
		return nil, err
	}

	return res, nil
}

// GetPlayerSummaries is the resolver for the getPlayerSummaries field.
func (r *queryResolver) GetPlayerSummaries(ctx context.Context, steamids []int64) (*model.PSummariesRes, error) {
	if len(steamids) >= u.MAX_PLAYERS_SUMMARIES || len(steamids) <= 0 {
		return nil, errors.New("can only fetch between 1 and " + strconv.Itoa(u.MAX_PLAYERS_SUMMARIES) + " steam profiles.")
	}

	end, err := u.ConstructEndpoint(t.GetPlayer)
	if err != nil {
		return nil, err
	}

	end.AddQueries(u.QueriesStruct{Key: "steamids", Val: u.SliceIntoString(steamids)})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	var wrapper map[string]*model.PSummariesRes
	res, err := u.UnmarshalMapping(wrapper, &resp.BodyResponse, "response")

	if err != nil {
		return nil, err
	}

	return res, nil
}

// GetFriendList is the resolver for the getFriendList field.
func (r *queryResolver) GetFriendList(ctx context.Context, steamid int64) (*model.FListRes, error) {
	end, err := u.ConstructEndpoint(t.GetFriends)

	if err != nil {
		return nil, err
	}

	steamidString := strconv.FormatInt(steamid, 10)
	end.AddQueries(u.QueriesStruct{Key: "steamid", Val: steamidString})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	wrapper, err := u.UnmarshalWithoutMapping[*model.FListRes](&resp.BodyResponse)

	if err != nil {
		return nil, err
	}

	return wrapper, nil
}

// GetRecentGames is the resolver for the getRecentGames field.
func (r *queryResolver) GetRecentGames(ctx context.Context, steamid int64) (*model.RGamesRes, error) {
	end, err := u.ConstructEndpoint(t.GetRecentlyPlayed)

	if err != nil {
		return nil, err
	}

	steamidString := strconv.FormatInt(steamid, 10)
	end.AddQueries(u.QueriesStruct{Key: "steamid", Val: steamidString})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	var wrapper map[string]*model.RGamesRes
	res, err := u.UnmarshalMapping(wrapper, &resp.BodyResponse, "response")

	if err != nil {
		return nil, err
	}

	return res, nil
}

// GetSchemaForGame is the resolver for the getSchemaForGame field.
func (r *queryResolver) GetSchemaForGame(ctx context.Context, appid int64) (*model.SchemaForGame, error) {
	end, err := u.ConstructEndpoint(t.GetSchema)

	if err != nil {
		return nil, err
	}

	end.AddQueries(u.QueriesStruct{Key: "appid", Val: strconv.FormatInt(appid, 10)})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	var wrapper map[string]*model.SchemaForGame
	res, err := u.UnmarshalMapping(wrapper, &resp.BodyResponse, "response")

	if err != nil {
		return nil, err
	}

	return res, nil
}

// GetAchievementPercentages is the resolver for the getAchievementPercentages field.
func (r *queryResolver) GetAchievementPercentages(ctx context.Context, gameid int64) (*model.AchievementPercentages, error) {
	end, err := u.ConstructEndpoint(t.GetAchievements)

	if err != nil {
		return nil, err
	}

	end.AddQueries(u.QueriesStruct{Key: "gameid", Val: strconv.FormatInt(gameid, 10)})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	var wrapper map[string]*model.AchievementPercentages
	res, err := u.UnmarshalMapping(wrapper, &resp.BodyResponse, "achievementpercentages")

	if err != nil {
		return nil, err
	}

	return res, nil
}

// GetPlayerBans is the resolver for the getPlayerBans field.
func (r *queryResolver) GetPlayerBans(ctx context.Context, steamids []int64) (*model.PBansRes, error) {
	if len(steamids) >= u.MAX_PLAYERS_SUMMARIES || len(steamids) <= 0 {
		return nil, errors.New("can only fetch between 1 and " + strconv.Itoa(u.MAX_PLAYERS_SUMMARIES) + " steam profiles.")
	}

	end, err := u.ConstructEndpoint(t.GetPlayerBans)
	if err != nil {
		return nil, err
	}

	end.AddQueries(u.QueriesStruct{Key: "steamids", Val: u.SliceIntoString(steamids)})

	go func() {
		u.FetchAPI(ctx, end.URL.String(), r.ResChan)
		defer close(r.ResChan)
	}()

	resp := <-r.ResChan

	if resp.Error != nil {
		return nil, resp.Error
	}

	wrapper, err := u.UnmarshalWithoutMapping[*model.PBansRes](&resp.BodyResponse)

	if err != nil {
		return nil, err
	}

	return wrapper, nil
}

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver {
	return &queryResolver{Resolver: r, ResChan: make(chan *u.ResChanType)}
}

type queryResolver struct {
	*Resolver
	ResChan chan *u.ResChanType
}
