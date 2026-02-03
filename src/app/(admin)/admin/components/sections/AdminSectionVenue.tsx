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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAdminStore } from '@/stores/adminStore';
import { CalendarIcon, Car, ClockIcon, MapPinIcon, SaveIcon, SearchIcon, TrainIcon } from 'lucide-react';
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

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const DateField = ({ label, value, onChange, required = false }: DateFieldProps) => {
  const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <StandardInput
              label={label}
              value={value}
              placeholder="날짜를 선택하세요"
              required={required}
              readOnly
              icon={<CalendarIcon className="h-4 w-4" />}
              onClick={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setOpen(true);
                }
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" sideOffset={10}>
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <CalendarIcon className="h-4 w-4 text-[var(--text-muted)]" />
              결혼식 날짜 선택
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate ?? new Date()}
              onSelect={(date) =>
                onChange(date ? date.toLocaleDateString('en-CA') : '')
              }
            />
            <div className="mt-3 rounded-md border border-[var(--border-light)] bg-[var(--bg-secondary)]/70 px-3 py-2 text-xs text-[var(--text-muted)]">
              선택됨: {value || '없음'}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

type TimeFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const timeHourOptions = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, '0')
);
const timeMinuteOptions = ['00', '15', '30', '45'];

const TimeField = ({ label, value, onChange, required = false }: TimeFieldProps) => {
  const [hour, minute] = value.split(':');
  const resolvedHour = timeHourOptions.includes(hour) ? hour : '12';
  const resolvedMinute = timeMinuteOptions.includes(minute) ? minute : '00';
  const [open, setOpen] = useState(false);

  const handleUpdate = (nextHour: string, nextMinute: string) => {
    onChange(`${nextHour}:${nextMinute}`);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <StandardInput
              label={label}
              type="time"
              value={value}
              placeholder="시간을 선택하세요"
              required={required}
              readOnly
              icon={<ClockIcon className="h-4 w-4" />}
              onClick={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setOpen(true);
                }
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" sideOffset={10}>
          <div className="rounded-[14px] border border-[var(--border-light)] bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <ClockIcon className="h-4 w-4 text-[var(--text-muted)]" />
              결혼식 시간 선택
            </div>
            <div className="rounded-[12px] border border-[var(--border-light)] bg-[var(--bg-secondary)]/70 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-[var(--text-muted)]">시</span>
                  <select
                    className="h-9 w-full rounded-md border border-[var(--border-light)] bg-white/70 px-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)] focus:border-[var(--accent-rose)]"
                    value={resolvedHour}
                    onChange={(event) => handleUpdate(event.target.value, resolvedMinute)}
                  >
                    {timeHourOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}시
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-[var(--text-muted)]">분</span>
                  <select
                    className="h-9 w-full rounded-md border border-[var(--border-light)] bg-white/70 px-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-rose)] focus:border-[var(--accent-rose)]"
                    value={resolvedMinute}
                    onChange={(event) => handleUpdate(resolvedHour, event.target.value)}
                  >
                    {timeMinuteOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-[var(--border-light)] bg-white/80 px-3 py-2 text-xs text-[var(--text-muted)]">
              선택됨: {value || '없음'}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
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
                <DateField
                  label="결혼식 날짜"
                  value={venueInfo.weddingDate}
                  onChange={(value) =>
                    setVenueInfo((prev) => ({ ...prev, weddingDate: value }))
                  }
                  required
                />
                <TimeField
                  label="결혼식 시간"
                  value={venueInfo.weddingTime}
                  onChange={(value) =>
                    setVenueInfo((prev) => ({ ...prev, weddingTime: value }))
                  }
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
