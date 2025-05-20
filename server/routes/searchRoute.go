package routes

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	e "serverGo/essentials"
	"serverGo/graph"
	u "serverGo/utils"
	t "serverGo/utils/types"
)

type UserStruct struct {
	VanityUrl string `json:"vanityUrl"`
}

func SearchUser() gin.HandlerFunc {
	var req UserStruct
	return func(c *gin.Context) {
		if err := c.BindJSON(&req); err != nil {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusBadRequest, Message: "VanityUrl is missing from the Body Request."})
			return
		}

		end, err := u.MakeSubEndpoint("VanityUrl", u.QueriesStruct{Key: "vanityurl", Val: req.VanityUrl})

		if err != nil {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusInternalServerError, Message: err.Error()})
			return
		}

		ctx := c.Request.Context()
		end.FetchSubEndpoint(ctx)
		res := <-end.ResChan

		var response map[string]t.ResolveVanityURL
		resMap, err2 := u.UnmarshalMapping(response, &res.BodyResponse, "response")

		if err2 != nil || resMap.Success != 1 {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusBadRequest, Message: "Unsuccesful request."})
			return
		}

		steamInt, err3 := strconv.ParseInt(resMap.Steamid, 10, 64)

		if err3 != nil {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusBadRequest, Message: resMap.Message})
			return
		}

		var gqlClient *graph.Resolver

		resp, err := gqlClient.Query().GetPlayerSummaries(ctx, []int64{steamInt})

		if err != nil {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusBadRequest, Message: err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"response": resp})

	}
}
