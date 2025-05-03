package essentials

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
	limiter := rate.NewLimiter(rate.Limit(time.Second), 2)

	return func(c *gin.Context) {
		if limiter.Allow() {
			c.Next()
		} else {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"message": "Limit exceeded",
			})
		}

	}
}

func Timeout(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		finished := make(chan struct{})

		go func() {
			c.Next()
			finished <- struct{}{}
		}()

		select {
		case <-finished:
		case <-ctx.Done():
			c.JSON(http.DefaultMaxIdleConnsPerHost, gin.H{
				"error": "Request took too long.",
			})
			c.Abort()
		}
	}
}
