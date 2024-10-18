import cv2
from app.model.poi_model import POIModel
from app.service.rtsp_service import RTSPService


class StreamUsecase:
    def __init__(self) -> None:
        self.test = "test"
        self.rtsp_service = None

    def video_feed(self, poi: POIModel):
        POI_MAP = {
            (-7.7896205, 110.3630185): "rtsp://satansheir:letyur13@36.91.174.51:554/cam/realmonitor?channel=144&subtype=0",
            (-7.7898668, 110.3620978): "rtsp://satansheir:letyur13@36.91.174.51:554/cam/realmonitor?channel=12&subtype=0",
            (123, 123): "test"
        }

        if self.rtsp_service is not None:
            self.stop_stream()

        coordinates = (poi.latitude, poi.longitude)
        rtsp_url = POI_MAP.get(coordinates)
        if rtsp_url:
            self.rtsp_service = RTSPService(rtsp_url)
            poi_lat_long = f"{poi.latitude},{poi.longitude}"
            self.rtsp_service.start(poi_lat_long)
            return self.rtsp_service.stream_generator()
        else:
            raise ValueError("POI tidak ditemukan")

    def stop_stream(self):
        if self.rtsp_service is not None:
            self.rtsp_service.stop()
            self.rtsp_service = None