package main

import (
	"game/ws"

	"github.com/gin-gonic/gin"
)

func main() {

	hub := ws.NewHub()
	go hub.Run()

	engine := gin.New()

	engine.Static("/static", "./static")

	engine.Use(
		gin.Recovery(),
		// gin.Logger(),
	)

	engine.GET("/", func(c *gin.Context) {
		c.File("index.html")
	})

	engine.GET("/ws", func(c *gin.Context) {
		ws.ServeWs(hub, c.Writer, c.Request)
	})

	engine.Run(":8080")
}
