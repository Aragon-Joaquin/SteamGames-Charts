package essentials

import (
	"serverGo/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"

	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
	"github.com/vektah/gqlparser/v2/ast"
)

func PlaygroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func QueryHandler(port string) gin.HandlerFunc {
	//? creates a new Server instance using the schema from the .graphqls file
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	//? the transport just handles differents types of request (http, form, ws) on the desired methods
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	//? sets a Least Recently User cache of 1000 bytes? i think
	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	//? introspection just allows the client to know the schema shape
	srv.Use(extension.Introspection{})
	//? client sends a hash of the graphql query. if the server recognizes it, instead of proccesing it again, sends the one on the cache
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})
	return func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	}
}
