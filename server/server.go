package main

import (
	"log"
	"os"
	e "serverGo/essentials"
	ro "serverGo/routes"
	u "serverGo/utils"

	"github.com/gin-gonic/gin"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	u.ReadEnv()

	r := gin.Default()
	r.SetTrustedProxies([]string{"http://localhost:4200"})

	//* middlewares
	r.Use(e.RateLimiter())
	r.Use(e.Timeout(u.MAX_TIMEOUT_TIME))
	// r.Use(e.GinContextMiddleware())

	//* routes
	r.GET("/", e.PlaygroundHandler())
	r.GET("/search/user", ro.SearchUser())
	r.POST("/query", e.QueryHandler(port))

	if err := r.Run(":" + port); err != nil {
		log.Fatalln(err)
	}
}
