type KakaoPlacesSearchStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoLatLngBounds {
  extend(latlng: KakaoLatLng): void;
}

interface KakaoMapInstance {
  setCenter(latlng: KakaoLatLng): void;
  getLevel(): number;
  setLevel(level: number): void;
  setBounds(bounds: KakaoLatLngBounds): void;
}

interface KakaoMarker {
  setMap(map: KakaoMapInstance | null): void;
  setPosition(latlng: KakaoLatLng): void;
}

interface KakaoPlaces {
  keywordSearch(
    keyword: string,
    callback: (data: KakaoPlace[], status: KakaoPlacesSearchStatus) => void
  ): void;
}

interface KakaoServices {
  Places: new () => KakaoPlaces;
  Status: {
    OK: KakaoPlacesSearchStatus;
    ZERO_RESULT: KakaoPlacesSearchStatus;
    ERROR: KakaoPlacesSearchStatus;
  };
}

interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
  services: KakaoServices;
  load(callback: () => void): void;
}

interface KakaoNamespace {
  maps: KakaoMaps;
}

type DaumPostcodeSize = {
  width: number;
  height: number;
};

type DaumPostcodeResult = {
  address: string;
  roadAddress: string;
  buildingName?: string;
};

interface Window {
  kakao?: KakaoNamespace;
  daum?: {
    Postcode: new (options: {
      oncomplete: (data: DaumPostcodeResult) => void;
      onresize?: (size: DaumPostcodeSize) => void;
      width?: string | number;
      height?: string | number;
    }) => { embed: (container: HTMLElement) => void };
  };
}
