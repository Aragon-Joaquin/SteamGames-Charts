package main

import (
	"log"
	"net/http"
	"os"
	"serverGo/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

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

	//* playground
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)

	//* route
	http.Handle("/query", srv)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalln(err)
	}
}
