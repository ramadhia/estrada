package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/ramadhia/estrada/be/internal/handler/http/middleware"
	"github.com/ramadhia/estrada/be/internal/handler/http/response"
	"github.com/ramadhia/estrada/be/internal/model"
	"github.com/ramadhia/estrada/be/internal/provider"
)

type Traffic struct {
	provider *provider.Provider
}

func NewTraffic(appContainer *provider.Provider) *Traffic {
	if appContainer == nil {
		panic("nil container")
	}
	return &Traffic{provider: appContainer}
}

func (t *Traffic) FetchTraffic(c *gin.Context) {
	// auth
	//claim, err := middleware.GetClaim(c)
	//if err != nil {
	//	_ = c.AbortWithError(http.StatusUnauthorized, err)
	//	return
	//}

	useCase := t.provider.TrafficUseCase()
	result, err := useCase.FetchTraffic(c.Request.Context(), model.Claim{
		ID: "test",
	})
	if err != nil {
		response.JSONError(c, err)
		return
	}

	response.JSONSuccessWithPayload(c, result)
}

func (t *Traffic) FetchTrafficCTE(c *gin.Context) {

	var req FetchTrafficCteRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		response.JSONError(c, err)
		return
	}

	useCase := t.provider.TrafficUseCase()
	result, err := useCase.FetchTrafficCTE(c.Request.Context(), req.StatusCctv)
	if err != nil {
		response.JSONError(c, err)
		return
	}

	response.JSONSuccessWithPayload(c, result)
}

func (t *Traffic) UpsertTraffic(c *gin.Context) {
	// auth
	claim, err := middleware.GetClaim(c)
	if err != nil {
		response.SendErrorResponse(c, response.ErrUnauthorized, err.Error())
		return
	}

	// validation
	var req TblTrafficRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.JSONError(c, err)
		return
	}

	if err := req.Validate(); err != nil {
		response.JSONError(c, err)
		return
	}

	useCase := t.provider.TrafficUseCase()
	result, err := useCase.UpsertTraffic(c.Request.Context(), claim, model.TblTraffic{
		ID:          req.ID,
		ChannelName: req.ChannelName,
		ChannelID:   req.ChannelID,
		CarType:     req.CarType,
		Jml:         req.Jml,
		Ctddate:     req.Ctddate,
		Ctdtime:     req.Ctdtime,
	})
	if err != nil {
		response.JSONError(c, err)
		return
	}

	response.JSONSuccessWithPayload(c, result)
}

func (t *Traffic) DeleteTraffic(c *gin.Context) {
	// auth
	claim, err := middleware.GetClaim(c)
	if err != nil {
		response.SendErrorResponse(c, response.ErrUnauthorized, err.Error())
		return
	}

	id := c.Param("id")
	if id == "" {
		err := fmt.Errorf("missing traffic id")
		response.JSONError(c, err)
		return
	}

	useCase := t.provider.TrafficUseCase()
	err = useCase.DeleteTraffic(c.Request.Context(), claim, id)
	if err != nil {
		response.JSONError(c, err)
		return
	}

	response.JSONSuccessWithPayload(c, "ok!")
}

type TblTrafficRequest struct {
	ID          *int   `json:"id"`
	ChannelName string `json:"channel_name"`
	ChannelID   string `json:"channel_id"`
	CarType     string `json:"car_type"`
	Jml         int    `json:"jml"`
	Ctddate     string `json:"ctddate"`
	Ctdtime     string `json:"ctdtime"`
}

func (t TblTrafficRequest) Validate() error {
	if t.ChannelName == "" {
		return fmt.Errorf("missing traffic channel name")
	}

	return nil
}

type FetchTrafficCteRequest struct {
	StatusCctv *string `form:"status_cctv"`
}
