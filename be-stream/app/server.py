from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from app.usecase.stream_usecase import StreamUsecase
from app.model.poi_model import POIModel
from typing import Optional

router = FastAPI()


router.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stream_usecase = StreamUsecase()

@router.get("/")
def streams():
    return {"Hello": "World"}


@router.post("/start-stream")
def start_stream(lat: float, long: float):
    poi = POIModel(latitude=lat, longitude=long)
    stream_usecase.video_feed(poi)
    return {"message": "Stream started"}


@router.post("/stop-stream")
def stop_stream():
    stream_usecase.stop_stream()
    return {"message": "Stream stopped"}


@router.get("/streams")
def streams(
        lat: float,
        long: float,
        state: Optional[str] = None,
):
    try:
        # if state is "start":
        stream = stream_usecase.video_feed(poi=POIModel(latitude=lat, longitude=long))
        # else:
        return StreamingResponse(content=stream, media_type="multipart/x-mixed-replace; boundary=frame")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=500, detail=str(e))
