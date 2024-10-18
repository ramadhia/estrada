package gorm

import (
	"context"
	"errors"
	"fmt"
	"github.com/ramadhia/estrada/be/internal/model"
	"github.com/ramadhia/estrada/be/internal/repository"
	"gorm.io/gorm"
)

type TrafficGorm struct {
	db *gorm.DB
}

func NewTrafficRepo(db *gorm.DB) *TrafficGorm {
	return &TrafficGorm{
		db: db,
	}
}

func (p *TrafficGorm) FetchTraffic(ctx context.Context, filter repository.FetchTrafficFilter) (ret []*model.TblTraffic, err error) {
	q := p.db.WithContext(ctx)

	if filter.Limit != nil && filter.Offset != nil {
		limit := 5
		if filter.Limit != nil {
			limit = *filter.Limit
		}

		offset := 0
		if filter.Offset != nil {
			offset = *filter.Offset
		}
		q = q.Limit(limit).Offset(offset)
	}

	var items []TblTraffic
	//q = q.Joins("LEFT JOIN tbl_cctv tc ON tbl_traffic.channel_id = tc.channel_id").
	//	Joins("LEFT JOIN tbl_cartype tca ON tbl_traffic.car_type = tca.codetype")
	if err = q.Find(&items).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	fmt.Println(items)

	return TblTraffic{}.ToModels(items), nil
}

func (p *TrafficGorm) FetchTrafficWithCTE(ctx context.Context, filter repository.FetchTrafficFilter) (interface{}, error) {
	q := p.db.WithContext(ctx)
	var results []TrafficCTEResult

	statusCctv := "Y"
	if filter.StatusCctv != nil {
		statusCctv = *filter.StatusCctv
	}

	queryString := fmt.Sprintf(`
		WITH traffics AS (
			SELECT
				tkc.polda,
				tc.nama_cctv,
				tkc.status_cctv,
				DATE(ctddate) AS ctddate,
				date_trunc('minute', ctdtime) - ((extract(minute from ctdtime)::int %% 30) * interval '1 minute') AS waktu_group,
				jml,
				tk.jenis_kendaraan
			FROM tbl_traffic
				LEFT JOIN public.tbl_cctv tc on tbl_traffic.channel_id = tc.channel_id
				LEFT JOIN public.tbl_keterangan_cctv tkc on tc.nama_cctv = tkc.nama_cctv
				LEFT JOIN public.tbl_cartype tca on tbl_traffic.car_type = tca.codetype
				LEFT JOIN public.tbl_kendaraan tk on tca.kendaraan_id = tk.id
			WHERE tkc.status_cctv = '%s'
			AND tc.status_cctv = 'Y'
			)
		SELECT polda, nama_cctv, status_cctv, ctddate, TO_CHAR(waktu_group, 'HH24:MI') AS jam,
			SUM(jml) FILTER (WHERE jenis_kendaraan = 'MOTOR') AS motor,
			SUM(jml) FILTER (WHERE jenis_kendaraan = 'MINIBUS') AS minibus,
			SUM(jml) FILTER (WHERE jenis_kendaraan = 'TRUCK') AS truck,
			SUM(jml) FILTER (WHERE jenis_kendaraan = 'BUS') AS bus,
			SUM(jml) AS jumlah_total
		FROM traffics
		GROUP BY polda, nama_cctv, status_cctv, ctddate,waktu_group
		LIMIT 15
	`, statusCctv)

	if err := q.Raw(queryString).Scan(&results).Error; err != nil {
		return nil, err
	}

	return results, nil
}

func (p *TrafficGorm) UpsertTraffic(ctx context.Context, data model.TblTraffic) (ret *model.TblTraffic, err error) {
	q := p.db.WithContext(ctx)

	var isNewData bool

	if data.ID == nil {
		isNewData = true
	}

	if isNewData {
		newData := TblTraffic{}.FromModel(data)
		if err := q.Create(newData).Error; err != nil {
			return nil, err
		}
		return newData.ToModel(), err
	}

	updateData := TblTraffic{}.FromModel(data)
	rowAffected := q.Model(&TblTraffic{
		ID: data.ID,
	}).Updates(updateData)

	if err := rowAffected.Error; err != nil {
		return nil, err
	}

	return updateData.ToModel(), nil
}

func (p *TrafficGorm) DeleteTraffic(ctx context.Context, id string) (err error) {
	q := p.db.WithContext(ctx)

	q = q.Where("id = ?", id)
	q = q.Delete(&TblTraffic{})
	err = q.Error
	if err != nil {
		return err
	}

	return nil
}

type TblTraffic struct {
	ID          *int     `json:"id"`
	ChannelName string   `json:"channel_name"`
	ChannelID   string   `json:"channel_id"`
	CarType     string   `json:"car_type"`
	Jml         int      `json:"jml"`
	Ctddate     string   `json:"ctddate"`
	Ctdtime     string   `json:"ctdtime"`
	TblCctv     *TblCctv `gorm:"foreignKey:ChannelID;references:ChannelID"`
}

func (TblTraffic) FromModel(model model.TblTraffic) *TblTraffic {
	return &TblTraffic{
		ID:          model.ID,
		ChannelName: model.ChannelName,
		ChannelID:   model.ChannelID,
		CarType:     model.CarType,
		Jml:         model.Jml,
		Ctddate:     model.Ctddate,
		Ctdtime:     model.Ctdtime,
	}
}

func (TblTraffic) TableName() string {
	return "tbl_traffic"
}

func (t TblTraffic) ToModel() *model.TblTraffic {

	var tblCctv *model.TblCctv
	if t.TblCctv != nil {
		tblCctv = t.TblCctv.ToModel()

	}

	m := &model.TblTraffic{
		ID:          t.ID,
		ChannelName: t.ChannelName,
		ChannelID:   t.ChannelID,
		CarType:     t.CarType,
		Jml:         t.Jml,
		Ctddate:     t.Ctddate,
		Ctdtime:     t.Ctdtime,
		TblCctv:     tblCctv,
	}

	return m
}

func (t TblTraffic) ToModels(tblTraffic []TblTraffic) []*model.TblTraffic {
	var models []*model.TblTraffic
	for _, v := range tblTraffic {
		models = append(models, v.ToModel())
	}
	return models
}

type TrafficCTEResult struct {
	Polda       string `json:"polda"`
	NamaCCTV    string `json:"nama_cctv"`
	StatusCCTV  string `json:"status_cctv"`
	Ctddate     string `json:"ctddate"`
	Jam         string `json:"jam"`
	Motor       int    `json:"motor"`
	Minibus     int    `json:"minibus"`
	Truck       int    `json:"truck"`
	Bus         int    `json:"bus"`
	JumlahTotal int    `json:"jumlah_total"`
}

type TblCctv struct {
	ID         *int   `json:"id"`
	NamaCctv   string `json:"nama_cctv"`
	Polda      string `json:"polda"`
	ChannelID  string `json:"channel_id"`
	StatusCctv string `json:"status_cctv"`
}

func (TblCctv) TableName() string {
	return "tbl_cctv"
}

func (t TblCctv) ToModel() *model.TblCctv {
	return &model.TblCctv{
		ID:         t.ID,
		NamaCctv:   t.NamaCctv,
		ChannelID:  t.ChannelID,
		Polda:      t.Polda,
		StatusCctv: t.StatusCctv,
	}
}
