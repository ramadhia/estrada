package http

import (
	"github.com/gin-gonic/gin"
	"github.com/ramadhia/estrada/be/internal/handler/http/middleware"
)

// setupRouting contains REST path and handler configuration
// @title Estrada-BE API
// @version 1.0
// @description Estrada-BE API service REST API specification
// @in header
func (h *DefaultHttpServer) setupRouting() {
	router := h.engine
	cfg := h.config

	// middleware groups
	secureMiddlewares := []gin.HandlerFunc{
		middleware.NewHmacJwtMiddleware([]byte(cfg.App.JwtSecret)),
	}

	router.GET("/ping", func(context *gin.Context) {
		context.String(200, "Ok")
	})

	router.GET("traffics", h.handlers.traffic.FetchTraffic)
	router.GET("traffics-cte", h.handlers.traffic.FetchTrafficCTE)
	router.PUT("traffics", h.handlers.traffic.UpsertTraffic)
	router.DELETE("traffics/:id", h.handlers.traffic.DeleteTraffic).Use(secureMiddlewares...)

}
