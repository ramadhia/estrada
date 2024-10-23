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
    WHERE tkc.status_cctv = 'IN'
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
