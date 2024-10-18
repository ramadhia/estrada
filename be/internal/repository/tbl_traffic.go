package repository

import (
	"context"

	"github.com/ramadhia/estrada/be/internal/model"
)

type TrafficRepository interface {
	FetchTraffic(ctx context.Context, filter FetchTrafficFilter) ([]*model.TblTraffic, error)
	FetchTrafficWithCTE(ctx context.Context, filter FetchTrafficFilter) (interface{}, error)
	UpsertTraffic(ctx context.Context, data model.TblTraffic) (*model.TblTraffic, error)
	DeleteTraffic(ctx context.Context, id string) error
}

type FetchTrafficFilter struct {
	StatusCctv *string
	Offset     *int
	Limit      *int
}
