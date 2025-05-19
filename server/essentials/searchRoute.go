package essentials

import (
	"net/http"

	"github.com/gin-gonic/gin"

	u "serverGo/utils"
	t "serverGo/utils/types"

	"serverGo/graph"
)

type UserStruct struct {
	VanityUrl string `json:"vanityUrl"`
}

func SearchUser() gin.HandlerFunc {
	var req UserStruct
	return func(c *gin.Context) {
		if err := c.BindJSON(&req); err != nil {
			SendHttpError(c, &HTTPError{StatusCode: http.StatusBadRequest, Message: "VanityUrl is missing from the Body Request."})
		}

		end, err := u.MakeSubEndpoint("VanityUrl")

		if err != nil {
			SendHttpError(c, &HTTPError{StatusCode: http.StatusInternalServerError, Message: err.Error()})
		}

		ctx := c.Request.Context()
		end.FetchSubEndpoint(ctx, req.VanityUrl)

		res := <-end.ResChan

		var response t.ResolveVanityURL

		if err := u.UnmarshalWithoutMapping(response, &res.BodyResponse); err != nil {
			SendHttpError(c, &HTTPError{StatusCode: http.StatusBadRequest, Message: err.Error()})
		}

		var gqlClient *graph.Resolver

		resp, err := gqlClient.Query().GetPlayerSummaries(ctx, make([]int, response.Steamid))

		if err != nil {
			SendHttpError(c, &HTTPError{StatusCode: http.StatusBadRequest, Message: err.Error()})
		}

		c.JSON(http.StatusOK, gin.H{"response": resp})

	}
}
