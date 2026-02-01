'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  updateLocationAction,
  updateLocationSectionTitleAction,
  updateTransportationAction,
  updateWeddingInfoSectionAction,
} from '@/app/(admin)/admin/actions/content';
import { StandardCard, StandardInput, StandardButton } from '@/components/admin/StandardComponents';
import { useAdminStore } from '@/stores/adminStore';
import { Car, MapPinIcon, SaveIcon, SearchIcon, TrainIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type AdminSectionVenueProps = {
  data: AdminDashboardData;
};

const getLocalDateTime = (isoValue?: string) => {
  if (!isoValue) {
    return { date: '', time: '' };
  }
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', time: '' };
  }
  return {
    date: parsed.toLocaleDateString('en-CA'),
    time: parsed.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  };
};

const buildIsoDateTime = (date: string, time: string) => {
  if (!date || !time) return '';
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return '';
  }
  const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  return localDate.toISOString();
};

/**
 * 예식장 정보 관리 섹션
 */
export const AdminSectionVenue = ({ data }: AdminSectionVenueProps) => {
  const {
    openPlaceSearchModal,
    openPostcodeModal,
    selectedVenue,
    setSelectedVenue,
    locationCoords,
  } = useAdminStore();

  const initialDateTime = useMemo(
    () => getLocalDateTime(data.event?.date_time),
    [data.event?.date_time]
  );

  const [venueInfo, setVenueInfo] = useState({
    weddingDate: initialDateTime.date,
    weddingTime: initialDateTime.time,
    placeName: data.event?.venue || data.location?.place_name || '',
    address: data.event?.address || data.location?.address || '',
  });

  const [weddingMeta, setWeddingMeta] = useState({
    weddingSectionTitle: data.sectionTitles?.wedding || '',
    notices: (data.location?.notices || []).join('\n'),
  });

  const [transportation, setTransportation] = useState({
    locationSectionTitle: data.sectionTitles?.location || '',
    subway: (data.transportation?.subway || []).join('\n'),
    bus: (data.transportation?.bus || []).join('\n'),
    car: data.transportation?.car || '',
    parking: data.transportation?.parking || '',
  });

  const [saving, setSaving] = useState({
    venue: false,
    wedding: false,
    transport: false,
  });

  useEffect(() => {
    setVenueInfo({
      weddingDate: initialDateTime.date,
      weddingTime: initialDateTime.time,
      placeName: data.event?.venue || data.location?.place_name || '',
      address: data.event?.address || data.location?.address || '',
    });
    setWeddingMeta({
      weddingSectionTitle: data.sectionTitles?.wedding || '',
      notices: (data.location?.notices || []).join('\n'),
    });
    setTransportation({
      locationSectionTitle: data.sectionTitles?.location || '',
      subway: (data.transportation?.subway || []).join('\n'),
      bus: (data.transportation?.bus || []).join('\n'),
      car: data.transportation?.car || '',
      parking: data.transportation?.parking || '',
    });
  }, [data, initialDateTime.date, initialDateTime.time]);

  useEffect(() => {
    if (!selectedVenue) return;
    setVenueInfo((prev) => ({
      ...prev,
      placeName: selectedVenue.name || prev.placeName,
      address: selectedVenue.address || prev.address,
    }));
    setSelectedVenue(null);
  }, [selectedVenue, setSelectedVenue]);

  const handlePlaceSearch = () => {
    setSelectedVenue({ name: venueInfo.placeName, address: venueInfo.address });
    openPlaceSearchModal();
  };

  const handleAddressSearch = () => {
    setSelectedVenue({ name: venueInfo.placeName, address: venueInfo.address });
    openPostcodeModal();
  };

  const handleSaveVenueInfo = async () => {
    setSaving((prev) => ({ ...prev, venue: true }));
    try {
      const isoDateTime = buildIsoDateTime(venueInfo.weddingDate, venueInfo.weddingTime);
      if (!isoDateTime) {
        toast.error('예식 날짜와 시간을 확인해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('event_date_time', isoDateTime);
      formData.append('event_venue', venueInfo.placeName);
      formData.append('event_address', venueInfo.address);
      if (Number.isFinite(locationCoords.lat)) {
        formData.append('location_latitude', String(locationCoords.lat));
      }
      if (Number.isFinite(locationCoords.lng)) {
        formData.append('location_longitude', String(locationCoords.lng));
      }

      await updateLocationAction(formData);
      toast.success('예식장 기본 정보가 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving((prev) => ({ ...prev, venue: false }));
    }
  };

  const handleSaveWeddingMeta = async () => {
    setSaving((prev) => ({ ...prev, wedding: true }));
    try {
      const isoDateTime = buildIsoDateTime(venueInfo.weddingDate, venueInfo.weddingTime);
      if (!isoDateTime) {
        toast.error('예식 날짜와 시간을 확인해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('wedding_section_title', weddingMeta.weddingSectionTitle);
      formData.append('location_notices', weddingMeta.notices);
      formData.append('event_date_time', isoDateTime);
      formData.append('event_venue', venueInfo.placeName);
      formData.append('event_address', venueInfo.address);

      await updateWeddingInfoSectionAction(formData);
      toast.success('예식 안내 문구가 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving((prev) => ({ ...prev, wedding: false }));
    }
  };

  const handleSaveTransportation = async () => {
    setSaving((prev) => ({ ...prev, transport: true }));
    try {
      const titleFormData = new FormData();
      titleFormData.append('location_section_title', transportation.locationSectionTitle);
      await updateLocationSectionTitleAction(titleFormData);

      const formData = new FormData();
      formData.append('location_id', data.location.id);
      formData.append('transport_subway', transportation.subway);
      formData.append('transport_bus', transportation.bus);
      formData.append('transport_car', transportation.car);
      formData.append('transport_parking', transportation.parking);
      await updateTransportationAction(formData);

      toast.success('교통 안내가 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving((prev) => ({ ...prev, transport: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <MapPinIcon className="w-7 h-7 text-blue-600 mt-1" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예식장 정보</h1>
          <p className="text-gray-600 mt-1">예식장 정보와 오시는 길을 관리하세요</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <StandardCard title="예식 안내 문구">
            <div className="space-y-4">
              <StandardInput
                label="예식 섹션 타이틀"
                value={weddingMeta.weddingSectionTitle}
                onChange={(value) =>
                  setWeddingMeta((prev) => ({ ...prev, weddingSectionTitle: value }))
                }
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">안내 문구 (줄바꿈)</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={weddingMeta.notices}
                  onChange={(event) =>
                    setWeddingMeta((prev) => ({ ...prev, notices: event.target.value }))
                  }
                  placeholder="예식 안내 문구를 입력하세요"
                />
              </div>
              <div className="flex justify-end">
                <StandardButton
                  size="sm"
                  loading={saving.wedding}
                  onClick={handleSaveWeddingMeta}
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  안내 문구 저장
                </StandardButton>
              </div>
            </div>
          </StandardCard>

          <StandardCard title="예식장 기본 정보">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StandardInput
                  label="결혼식 날짜"
                  type="date"
                  value={venueInfo.weddingDate}
                  onChange={(value) => setVenueInfo((prev) => ({ ...prev, weddingDate: value }))}
                  required
                />
                <StandardInput
                  label="결혼식 시간"
                  type="time"
                  value={venueInfo.weddingTime}
                  onChange={(value) => setVenueInfo((prev) => ({ ...prev, weddingTime: value }))}
                  required
                />
              </div>
              <StandardInput
                label="예식장 이름"
                placeholder="예식장 이름을 입력하세요"
                value={venueInfo.placeName}
                onChange={(value) => setVenueInfo((prev) => ({ ...prev, placeName: value }))}
                required
              />
              <div>
                <StandardInput
                  label="주소"
                  placeholder="예식장 주소를 입력하세요"
                  value={venueInfo.address}
                  onChange={(value) => setVenueInfo((prev) => ({ ...prev, address: value }))}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <StandardButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handlePlaceSearch}
                  >
                    <SearchIcon className="w-4 h-4 mr-1" />
                    장소 검색
                  </StandardButton>
                  <StandardButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleAddressSearch}
                  >
                    <SearchIcon className="w-4 h-4 mr-1" />
                    주소 검색
                  </StandardButton>
                </div>
              </div>
              <div className="flex justify-end">
                <StandardButton
                  size="sm"
                  loading={saving.venue}
                  onClick={handleSaveVenueInfo}
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  기본 정보 저장
                </StandardButton>
              </div>
            </div>
          </StandardCard>
        </div>

        <StandardCard title="교통 안내">
          <div className="space-y-4">
            <StandardInput
              label="오시는 길 섹션 타이틀"
              value={transportation.locationSectionTitle}
              onChange={(value) =>
                setTransportation((prev) => ({ ...prev, locationSectionTitle: value }))
              }
            />
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <TrainIcon className="w-4 h-4 mr-1" />
                지하철 (줄바꿈)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={transportation.subway}
                onChange={(event) =>
                  setTransportation((prev) => ({ ...prev, subway: event.target.value }))
                }
                placeholder="지하철 이용 안내를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Car className="w-4 h-4 mr-1" />
                버스 (줄바꿈)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={transportation.bus}
                onChange={(event) =>
                  setTransportation((prev) => ({ ...prev, bus: event.target.value }))
                }
                placeholder="버스 이용 안내를 입력하세요"
              />
            </div>
            <StandardInput
              label="자가용"
              value={transportation.car}
              onChange={(value) => setTransportation((prev) => ({ ...prev, car: value }))}
              placeholder="자가용 및 주차 안내를 입력하세요"
            />
            <StandardInput
              label="주차"
              value={transportation.parking}
              onChange={(value) => setTransportation((prev) => ({ ...prev, parking: value }))}
              placeholder="주차 안내를 입력하세요"
            />
            <div className="flex justify-end">
              <StandardButton
                size="sm"
                loading={saving.transport}
                onClick={handleSaveTransportation}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                교통 안내 저장
              </StandardButton>
            </div>
          </div>
        </StandardCard>
      </div>
    </div>
  );
};
