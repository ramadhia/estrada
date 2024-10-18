package provider

import (
	"github.com/ramadhia/estrada/be/internal/config"
	"github.com/ramadhia/estrada/be/internal/repository"
	"github.com/ramadhia/estrada/be/internal/usecase"

	"gorm.io/gorm"
)

type Provider struct {
	config config.Config
	db     *gorm.DB

	// initialize usecase
	trafficUc usecase.TrafficUsecase

	// initialize repository
	trafficRepo repository.TrafficRepository
}

func NewProvider() *Provider {
	return &Provider{}
}

func (p *Provider) Config() config.Config {
	return p.config
}

func (p *Provider) SetConfig(c config.Config) {
	p.config = c
}

func (p *Provider) DB() *gorm.DB {
	return p.db
}

func (p *Provider) SetDB(d *gorm.DB) {
	p.db = d
}

func (p *Provider) TrafficUseCase() usecase.TrafficUsecase {
	return p.trafficUc
}

func (p *Provider) SetTrafficUseCase(u usecase.TrafficUsecase) {
	p.trafficUc = u
}

func (p *Provider) TrafficRepo() repository.TrafficRepository {
	return p.trafficRepo
}

func (p *Provider) SetTrafficRepo(r repository.TrafficRepository) {
	p.trafficRepo = r
}
