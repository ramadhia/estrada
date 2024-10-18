package traffic

import (
	"context"
	"fmt"
	"github.com/ramadhia/estrada/be/internal/config"
	"github.com/ramadhia/estrada/be/internal/model"
	"github.com/ramadhia/estrada/be/internal/provider"
	"github.com/ramadhia/estrada/be/internal/repository"
	"github.com/ramadhia/estrada/be/internal/usecase"
	"github.com/shortlyst-ai/go-helper"
)

type TrafficImpl struct {
	config      config.Config
	trafficRepo repository.TrafficRepository
}

func NewTraffic(p *provider.Provider) *TrafficImpl {
	return &TrafficImpl{
		config:      p.Config(),
		trafficRepo: p.TrafficRepo(),
	}
}

func (t TrafficImpl) FetchTraffic(ctx context.Context, claim model.Claim) (*usecase.FetchTrafficResponse, error) {
	fmt.Println(t.config)
	data, err := t.trafficRepo.FetchTraffic(ctx, repository.FetchTrafficFilter{
		Offset: helper.Pointer(1),
		Limit:  helper.Pointer(5),
	})
	if err != nil {
		return nil, err
	}

	return &usecase.FetchTrafficResponse{
		Data: data,
	}, nil
}

func (t TrafficImpl) FetchTrafficCTE(ctx context.Context, statusCctv *string) (*usecase.FetchTrafficResponse, error) {
	fmt.Println(statusCctv)
	data, err := t.trafficRepo.FetchTrafficWithCTE(ctx, repository.FetchTrafficFilter{
		StatusCctv: statusCctv,
	})
	if err != nil {
		return nil, err
	}

	return &usecase.FetchTrafficResponse{
		Data: data,
	}, nil
}

func (t TrafficImpl) UpsertTraffic(ctx context.Context, claim model.Claim, data model.TblTraffic) (*usecase.FetchTrafficResponse, error) {
	res, err := t.trafficRepo.UpsertTraffic(ctx, data)
	if err != nil {
		return nil, err
	}

	return &usecase.FetchTrafficResponse{
		Data: res,
	}, nil
}

func (t TrafficImpl) DeleteTraffic(ctx context.Context, claim model.Claim, id string) error {
	err := t.trafficRepo.DeleteTraffic(ctx, id)
	if err != nil {
		return err
	}

	return nil
}
