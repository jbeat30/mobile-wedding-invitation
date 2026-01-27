import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';

interface AdminState {
  // 메인 데이터
  data: AdminDashboardData | null;
  isLoading: boolean;
  error: string | null;
  
  // 네비게이션
  activeTab: string;
  sidebarCollapsed: boolean;
  
  // 모달/팝업 상태
  modals: {
    postcodeOpen: boolean;
    placeSearchOpen: boolean;
  };
  
  // 페이지네이션
  pagination: {
    guestbook: number;
    rsvp: number;
  };
  
  // 갤러리 관리
  gallery: {
    items: AdminDashboardData['galleryImages'];
    draggedImageId: string | null;
    dragOverImageId: string | null;
    orderSaved: boolean;
  };
  
  // 계좌 폼
  accountForms: {
    groom: boolean;
    bride: boolean;
  };
  
  // 위치 좌표
  locationCoords: {
    lat: number;
    lng: number;
  };
  
  // 장소 검색
  placeSearch: {
    query: string;
    results: KakaoPlace[];
    status: string | null;
    error: string | null;
  };
}

interface AdminActions {
  // 데이터 관리
  setData: (data: AdminDashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 네비게이션
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  
  // 모달 제어
  openPostcodeModal: () => void;
  closePostcodeModal: () => void;
  openPlaceSearchModal: () => void;
  closePlaceSearchModal: () => void;
  
  // 페이지네이션
  setGuestbookPage: (page: number) => void;
  setRsvpPage: (page: number) => void;
  
  // 갤러리
  setGalleryItems: (items: AdminDashboardData['galleryImages']) => void;
  setDraggedImageId: (id: string | null) => void;
  setDragOverImageId: (id: string | null) => void;
  setOrderSaved: (saved: boolean) => void;
  
  // 계좌 폼
  toggleAccountForm: (type: 'groom' | 'bride') => void;
  
  // 위치
  setLocationCoords: (coords: { lat: number; lng: number }) => void;
  
  // 장소 검색
  setPlaceSearchQuery: (query: string) => void;
  setPlaceSearchResults: (results: KakaoPlace[]) => void;
  setPlaceSearchStatus: (status: string | null) => void;
  setPlaceSearchError: (error: string | null) => void;
  
  // 초기화
  resetState: () => void;
}

type KakaoPlace = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
  x: string;
  y: string;
};

const initialState: AdminState = {
  data: null,
  isLoading: false,
  error: null,
  activeTab: 'overview',
  sidebarCollapsed: false,
  modals: {
    postcodeOpen: false,
    placeSearchOpen: false,
  },
  pagination: {
    guestbook: 1,
    rsvp: 1,
  },
  gallery: {
    items: [],
    draggedImageId: null,
    dragOverImageId: null,
    orderSaved: false,
  },
  accountForms: {
    groom: false,
    bride: false,
  },
  locationCoords: {
    lat: 37.5665,
    lng: 126.978,
  },
  placeSearch: {
    query: '',
    results: [],
    status: null,
    error: null,
  },
};

export const useAdminStore = create<AdminState & AdminActions>()(
  devtools(
    subscribeWithSelector(
      immer((set, _get) => ({
        ...initialState,
        
        // 데이터 관리
        setData: (data) => set((state) => {
          state.data = data;
          state.gallery.items = data.galleryImages;
          state.locationCoords = {
            lat: data.location.latitude,
            lng: data.location.longitude,
          };
        }),
        
        setLoading: (loading) => set((state) => {
          state.isLoading = loading;
        }),
        
        setError: (error) => set((state) => {
          state.error = error;
        }),
        
        // 네비게이션
        setActiveTab: (tab) => set((state) => {
          state.activeTab = tab;
        }),
        
        toggleSidebar: () => set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),
        
        // 모달 제어
        openPostcodeModal: () => set((state) => {
          state.modals.postcodeOpen = true;
        }),
        
        closePostcodeModal: () => set((state) => {
          state.modals.postcodeOpen = false;
        }),
        
        openPlaceSearchModal: () => set((state) => {
          state.modals.placeSearchOpen = true;
          state.placeSearch.error = null;
          state.placeSearch.status = null;
          state.placeSearch.results = [];
        }),
        
        closePlaceSearchModal: () => set((state) => {
          state.modals.placeSearchOpen = false;
          state.placeSearch.status = null;
          state.placeSearch.error = null;
        }),
        
        // 페이지네이션
        setGuestbookPage: (page) => set((state) => {
          state.pagination.guestbook = page;
        }),
        
        setRsvpPage: (page) => set((state) => {
          state.pagination.rsvp = page;
        }),
        
        // 갤러리
        setGalleryItems: (items) => set((state) => {
          state.gallery.items = items;
        }),
        
        setDraggedImageId: (id) => set((state) => {
          state.gallery.draggedImageId = id;
        }),
        
        setDragOverImageId: (id) => set((state) => {
          state.gallery.dragOverImageId = id;
        }),
        
        setOrderSaved: (saved) => set((state) => {
          state.gallery.orderSaved = saved;
        }),
        
        // 계좌 폼
        toggleAccountForm: (type) => set((state) => {
          state.accountForms[type] = !state.accountForms[type];
        }),
        
        // 위치
        setLocationCoords: (coords) => set((state) => {
          state.locationCoords = coords;
        }),
        
        // 장소 검색
        setPlaceSearchQuery: (query) => set((state) => {
          state.placeSearch.query = query;
        }),
        
        setPlaceSearchResults: (results) => set((state) => {
          state.placeSearch.results = results;
        }),
        
        setPlaceSearchStatus: (status) => set((state) => {
          state.placeSearch.status = status;
        }),
        
        setPlaceSearchError: (error) => set((state) => {
          state.placeSearch.error = error;
        }),
        
        // 초기화
        resetState: () => set(() => ({ ...initialState })),
      }))
    ),
    { name: 'admin-store' }
  )
);