package main

import (
	"log"
	"net/http"
	"os"
	e "serverGo/essentials"
	ro "serverGo/routes"
	u "serverGo/utils"
	"time"

	"github.com/gin-contrib/cache"
	"github.com/gin-contrib/cache/persistence"
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
	store := persistence.NewInMemoryStore(time.Second)
	r.SetTrustedProxies([]string{CLIENT_URL})

	//* middlewares
	r.Use(e.RateLimiter())
	r.Use(e.CORS([]string{CLIENT_URL}))
	r.Use(e.Timeout(u.MAX_TIMEOUT_TIME))

	//* routes
	r.GET("/", e.PlaygroundHandler())
	r.POST("/query", e.QueryHandler(port))

	r.POST("/search/user", ro.SearchUser())
	r.GET("/search/totalUsers", cache.CachePage(store, time.Minute, ro.GetTotalUsers()))

	r.NoRoute(func(c *gin.Context) {
		e.SendHttpError(c, &e.HTTPError{StatusCode: http.StatusNotFound, Message: "Route not found or non existing. Check if the http method and/or url is correct."})
	})

	if err := r.Run(":" + port); err != nil {
		log.Fatalln(err)
	}
}
