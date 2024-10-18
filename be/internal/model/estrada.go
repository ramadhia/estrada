package model

type TblTraffic struct {
	ID          *int   `json:"id"`
	ChannelName string `json:"channel_name"`
	ChannelID   string `json:"channel_id"`
	CarType     string `json:"car_type"`
	Jml         int    `json:"jml"`
	Ctddate     string `json:"ctddate"`
	Ctdtime     string `json:"ctdtime"`

	TblCctv *TblCctv `json:"tbl_cctv,omitempty"`
}

type TblKeteranganCctv struct {
	ID         int    `json:"id"`
	Polda      string `json:"polda"`
	NamaCctv   string `json:"nama_cctv"`
	StatusCctv string `json:"status_cctv"`
	Keterangan string `json:"keterangan"`
}

type TblKendaraan struct {
	ID             int    `json:"id"`
	JenisKendaraan string `json:"jenis_kendaraan"`
}

type TblCctv struct {
	ID         *int   `json:"id"`
	NamaCctv   string `json:"nama_cctv"`
	Polda      string `json:"polda"`
	ChannelID  string `json:"channel_id"`
	StatusCctv string `json:"status_cctv"`
}
