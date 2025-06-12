package routes

import (
	"net/http"
	e "serverGo/essentials"
	u "serverGo/utils"
	t "serverGo/utils/types"

	"github.com/gin-gonic/gin"
)

func GetTotalUsers() gin.HandlerFunc {
	return func(c *gin.Context) {
		end, err := u.MakeSubEndpoint(t.TotalUsers)

		if err != nil {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusInternalServerError, Message: err.Error()})
			return
		}

		ctx := c.Request.Context()
		end.FetchSubEndpoint(ctx)
		res := <-end.ResChan

		if res.Error != nil {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusBadRequest, Message: res.Error.Error()})
			return
		}

		var response map[string]t.GamesByConcurrentPlayers
		resMap, err2 := u.UnmarshalMapping(response, &res.BodyResponse, "response")

		if err2 != nil || len(resMap.Ranks) == 0 {
			e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusBadRequest, Message: "Unsuccesful request."})
			return
		}

		c.JSON(http.StatusOK, gin.H{"response": resMap})
	}
}
