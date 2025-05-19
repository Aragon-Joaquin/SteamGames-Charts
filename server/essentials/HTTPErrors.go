package essentials

import "github.com/gin-gonic/gin"

type HTTPError struct {
	Message    string
	StatusCode int
}

func SendHttpError(c *gin.Context, httpError *HTTPError) {
	c.AbortWithStatusJSON(httpError.StatusCode, gin.H{"message": httpError.Message, "status": false})
}
