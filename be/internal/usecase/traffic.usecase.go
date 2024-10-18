package usecase

import (
	"context"
	"github.com/ramadhia/estrada/be/internal/model"
)

type TrafficUsecase interface {
	FetchTraffic(ctx context.Context, claim model.Claim) (*FetchTrafficResponse, error)
	FetchTrafficCTE(ctx context.Context, statusCctv *string) (*FetchTrafficResponse, error)
	UpsertTraffic(ctx context.Context, claim model.Claim, data model.TblTraffic) (*FetchTrafficResponse, error)
	DeleteTraffic(ctx context.Context, claim model.Claim, id string) error
}

type FetchTrafficResponse struct {
	Data interface{} `json:"data"`
	//ID          int    `json:"id"`
	//ChannelName string `json:"channel_name"`
	//ChannelID   string `json:"channel_id"`
	//CarType     string `json:"car_type"`
	//Jml         int    `json:"jml"`
	//Ctddate     string `json:"ctddate"`
	//Ctdtime     string `json:"ctdtime"`
}
