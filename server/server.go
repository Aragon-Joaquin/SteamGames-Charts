package main

import (
	"log"
	"os"
	e "serverGo/essentials"
	u "serverGo/utils"
	"time"

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
	r.Use(e.Timeout(time.Second * 4))
	r.Use(e.GinContextMiddleware())

	//* routes
	r.GET("/", e.PlaygroundHandler())
	r.POST("/query", e.QueryHandler(port))

	if err := r.Run(":" + port); err != nil {
		log.Fatalln(err)
	}
}
