CREATE TABLE IF NOT EXISTS tbl_traffic
(
    id serial PRIMARY KEY,
    channel_name varchar(255),
    channel_id varchar(100),
    car_type varchar(100),
    jml int,
    ctddate date,
    ctdtime time
);

CREATE TABLE IF NOT EXISTS tbl_keterangan_cctv
(
   id serial PRIMARY KEY,
   polda varchar(255),
   nama_cctv varchar(255),
   status_cctv varchar(10),
   keterangan varchar(100)
);

CREATE TABLE IF NOT EXISTS tbl_kendaraan
(
    id serial PRIMARY KEY,
    jenis_kendaraan varchar(50)
);

CREATE TABLE IF NOT EXISTS tbl_cartype
(
    id serial PRIMARY KEY,
    codetype varchar(100),
    cartype varchar(255),
    kendaraan_id int
);

CREATE TABLE IF NOT EXISTS tbl_cctv
(
    id serial PRIMARY KEY,
    nama_cctv varchar(255),
    polda varchar (255),
    channel_id varchar(100),
    status_cctv varchar(10)
);
