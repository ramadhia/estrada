from pydantic import BaseModel


class POIModel(BaseModel):
    latitude: float
    longitude: float
