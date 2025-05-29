package essentials

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
	// 3 request per second
	limiter := rate.NewLimiter(1, 3)
	return func(c *gin.Context) {
		if limiter.Allow() {
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"message": "Request limit exceeded",
			})
		}

	}
}

// the timeout works before the c.Next() is executed
// after that, if an endpoint or the server has delay it messed up everything
func Timeout(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		finished := make(chan struct{})

		go func() {
			c.Next()

			finished <- struct{}{}
			defer close(finished)
		}()

		select {
		case <-finished:
		case <-ctx.Done():

			c.AbortWithStatusJSON(http.StatusRequestTimeout, gin.H{
				"message": "Request took too long: " + time.Since(start).Round(time.Millisecond).String(),
			})

		}
	}

}

func CORS(originsUrl []string) gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     originsUrl,
		AllowMethods:     []string{"PUT", "GET"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

// type GinContextKey struct{}

// func GinContextMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		ctx := context.WithValue(c.Request.Context(), GinContextKey{}, c)
// 		c.Request = c.Request.WithContext(ctx)
// 		c.Next()
// 	}
// }
