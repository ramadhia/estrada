export interface PublicChargeStation {
    id: number;
    name: string;
    coordinates: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    createdAt: string;
    operatingHours: string;
    chargePoints: ChargePoint[];
    total: ChargePointTotal | null;
}

export interface ChargePoint {
    id: number;
    chargePointConnectors: ChargePointConnector[];
}

export interface ChargePointConnector {
    id: number;
    chargePointId: number;
    position: string;
    connector: string;
    maxPower: number;
    available: boolean;
    enumConnector: EnumConnector;
    tariff: Tariff;
}

export interface EnumConnector {
    type: string;
}

export interface Tariff {
    id: number;
    priceKwh: number;
    adminFee: number;
    connectionFee: number;
    currencyId: number;
    pjnFee: number;
    priceKwhOriginal: number;
    connectionFeeOriginal: number;
    discountPercentageKwh: number;
    discountPercentageSurcharge: number;
    discountPercentageAdminFee: number;
    tax: Tax;
}

export interface Tax {
    id: number;
    amount: number;
}

export interface ChargePointTotal {
    count: number;
}


export interface PublicChargeStationResponse {
    publicChargeStation: PublicChargeStation[];
}