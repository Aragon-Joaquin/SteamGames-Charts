package essentials

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
)

func PlaygroundHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		playgroundHandler := playground.Handler("GraphQL playground", "/")
		playgroundHandler.ServeHTTP(c.Writer, c.Request)
	}
}

func QueryHandler(srv *handler.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	}
}
