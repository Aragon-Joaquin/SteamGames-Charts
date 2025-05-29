package main

import (
	"log"
	"net/http"
	"os"
	e "serverGo/essentials"
	ro "serverGo/routes"
	u "serverGo/utils"

	"github.com/gin-gonic/gin"
)

const (
	defaultPort = "8080"
	CLIENT_URL  = "http://localhost:4200"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	u.ReadEnv()

	r := gin.Default()
	r.SetTrustedProxies([]string{CLIENT_URL})

	//* middlewares
	r.Use(e.RateLimiter())
	r.Use(e.CORS([]string{CLIENT_URL}))
	r.Use(e.Timeout(u.MAX_TIMEOUT_TIME))
	// r.Use(e.GinContextMiddleware())

	//* routes
	r.GET("/", e.PlaygroundHandler())
	r.POST("/search/user", ro.SearchUser())
	r.POST("/query", e.QueryHandler(port))

	r.NoRoute(func(c *gin.Context) {
		e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusNotFound, Message: "Page not found"})
	})

	if err := r.Run(":" + port); err != nil {
		log.Fatalln(err)
	}
}
