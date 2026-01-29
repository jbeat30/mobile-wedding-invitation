'use client';

import { useState } from 'react';
import { MapPinIcon, SearchIcon, Car, TrainIcon } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
  detailed_address?: string;
  latitude?: number;
  longitude?: number;
}

interface AdminSectionVenueProps {
  venue?: Venue;
  sectionTitles?: {
    wedding?: string;
  };
}

/**
 * 예식장 정보 관리 섹션
 */
export const AdminSectionVenue = ({ venue, sectionTitles }: AdminSectionVenueProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const venues = [
    { id: '1', name: '더컨벤션 웨딩홀', address: '서울시 강남구 테헤란로 123' },
    { id: '2', name: '그랜드 볼룸', address: '서울시 서초구 서초대로 456' },
    { id: '3', name: '로얄 웨딩홀', address: '서울시 송파구 올림픽로 789' },
  ];

  const handleVenueSelect = (_selectedVenue: Venue) => {
    // 예식장 선택 시 주소 자동 입력
    setIsSearchOpen(false);
  };

  const handleDirectInput = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="p-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MapPinIcon className="w-8 h-8 mr-3 text-blue-600" />
          예식장 정보
        </h1>
        <p className="text-gray-600 mt-2 text-base">예식장 정보와 오시는 길을 관리하세요</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 예식장 기본 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" />
            예식장 기본 정보
          </h2>

          <div className="space-y-6">
            {/* 섹션 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                섹션 제목
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={sectionTitles?.wedding || '예식 안내'}
                placeholder="예: 예식 안내"
              />
            </div>

            {/* 예식장 이름 검색/입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예식장 이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  defaultValue={venue?.name || ''}
                  placeholder="클릭하여 예식장 검색 또는 직접 입력"
                  onClick={() => setIsSearchOpen(true)}
                  readOnly
                />
                <SearchIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={venue?.address || ''}
                placeholder="예식장 주소가 자동으로 입력됩니다"
              />
            </div>

            {/* 상세 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 주소 (선택)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={venue?.detailed_address || ''}
                placeholder="예: 3층 그랜드볼룸"
              />
            </div>

            {/* 예식 일시 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예식 날짜
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예식 시간
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 교통 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Car className="w-5 h-5 mr-2 text-green-600" />
            교통 안내
          </h2>

          <div className="space-y-6">
            {/* 지하철 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <TrainIcon className="w-4 h-4 mr-1" />
                지하철
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="지하철 이용 안내를 입력하세요"
              />
            </div>

            {/* 버스 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Car className="w-4 h-4 mr-1" />
                버스
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="버스 이용 안내를 입력하세요"
              />
            </div>

            {/* 자가용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Car className="w-4 h-4 mr-1" />
                자가용 & 주차
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="자가용 및 주차 안내를 입력하세요"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-8 flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          변경사항 저장
        </button>
      </div>

      {/* 예식장 검색 다이얼로그 */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">예식장 검색</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예식장 이름을 입력하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                {venues
                  .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((venue) => (
                    <div
                      key={venue.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleVenueSelect(venue)}
                    >
                      <div className="font-medium text-gray-900">{venue.name}</div>
                      <div className="text-sm text-gray-600">{venue.address}</div>
                    </div>
                  ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDirectInput}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  직접 입력
                </button>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};