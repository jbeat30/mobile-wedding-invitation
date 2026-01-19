'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import {
  addRsvpFieldAction,
  deleteRsvpFieldAction,
  updateRsvpAction,
  updateRsvpFieldAction,
  updateRsvpTitleAction,
} from '@/app/(admin)/admin/actions/rsvp';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { SelectField } from '@/components/ui/SelectField';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { TextArea, TextInput } from '@/components/ui/TextInput';

type AdminSectionRsvpProps = {
  rsvp: AdminDashboardData['rsvp'];
  rsvpFields: AdminDashboardData['rsvpFields'];
  rsvpResponses: AdminDashboardData['rsvpResponses'];
  sectionTitles: AdminDashboardData['sectionTitles'];
  rsvpPage: number;
  setRsvpPage: Dispatch<SetStateAction<number>>;
};

/**
 * RSVP 섹션
 * @param props AdminSectionRsvpProps
 * @returns JSX.Element
 */
export const AdminSectionRsvp = ({
  rsvp,
  rsvpFields,
  rsvpResponses,
  sectionTitles,
  rsvpPage,
  setRsvpPage,
}: AdminSectionRsvpProps) => {
  return (
    <div className="flex flex-col gap-6">
      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 설정</h2>
        <form action={updateRsvpAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-[14px] md:col-span-2">
            <input type="checkbox" name="rsvp_enabled" defaultChecked={rsvp.enabled} />
            RSVP 사용
          </label>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_deadline">마감 일시</FieldLabel>
            <TextInput
              id="rsvp_deadline"
              name="rsvp_deadline"
              placeholder="예: 2024-12-25 14:00"
              defaultValue={rsvp.deadline || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="rsvp_consent_title">개인정보 동의 제목</FieldLabel>
            <TextInput
              id="rsvp_consent_title"
              name="rsvp_consent_title"
              defaultValue={rsvp.consent_title || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="rsvp_consent_retention">보관 기간</FieldLabel>
            <TextInput
              id="rsvp_consent_retention"
              name="rsvp_consent_retention"
              defaultValue={rsvp.consent_retention || ''}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_consent_description">동의 설명</FieldLabel>
            <TextArea
              id="rsvp_consent_description"
              name="rsvp_consent_description"
              defaultValue={rsvp.consent_description || ''}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <FieldLabel htmlFor="rsvp_consent_notice">안내 문구</FieldLabel>
            <TextArea
              id="rsvp_consent_notice"
              name="rsvp_consent_notice"
              defaultValue={rsvp.consent_notice || ''}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="sm">
              저장하기
            </Button>
          </div>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 필드</h2>
        <form action={updateRsvpTitleAction} className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="rsvp_section_title">RSVP 섹션 타이틀</FieldLabel>
            <TextInput
              id="rsvp_section_title"
              name="rsvp_section_title"
              defaultValue={sectionTitles.rsvp}
            />
          </div>
          <Button type="submit" size="sm" className="self-end">
            타이틀 저장
          </Button>
        </form>

        <div className="mt-6 rounded-[12px] border border-[var(--border-light)] bg-white/70 p-4">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">필드 추가</h3>
          <form action={addRsvpFieldAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="rsvp_id" value={rsvp.id} />
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="rsvp_field_key">필드 키</FieldLabel>
              <SelectField id="rsvp_field_key" name="rsvp_field_key" defaultValue="attendance">
                <option value="attendance">참석 여부</option>
                <option value="companions">동반 인원</option>
                <option value="meal">식사 여부</option>
                <option value="notes">비고</option>
              </SelectField>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="rsvp_field_label">라벨</FieldLabel>
              <TextInput id="rsvp_field_label" name="rsvp_field_label" />
            </div>
            <label className="flex items-center gap-2 text-[14px] md:col-span-2">
              <input type="checkbox" name="rsvp_field_required" />
              필수 항목
            </label>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="rsvp_field_placeholder">플레이스홀더</FieldLabel>
              <TextInput id="rsvp_field_placeholder" name="rsvp_field_placeholder" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="rsvp_field_options">옵션 (줄바꿈)</FieldLabel>
              <TextArea id="rsvp_field_options" name="rsvp_field_options" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="rsvp_field_sort_order">정렬 순서</FieldLabel>
              <TextInput id="rsvp_field_sort_order" name="rsvp_field_sort_order" type="number" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="sm">
                추가하기
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-[12px] border border-[var(--border-light)] bg-white/70">
          {rsvpFields.length ? (
            <div className="divide-y divide-[var(--border-light)]">
              {rsvpFields.map((field) => {
                const formId = `rsvp_field_${field.id}`;
                return (
                  <div key={field.id} className="flex flex-col gap-4 px-4 py-4">
                    <form id={formId} action={updateRsvpFieldAction} className="grid gap-3">
                      <input type="hidden" name="rsvp_field_id" value={field.id} />
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <FieldLabel htmlFor={`field_key_${field.id}`}>필드 키</FieldLabel>
                          <SelectField
                            id={`field_key_${field.id}`}
                            name="rsvp_field_key"
                            defaultValue={field.field_key}
                          >
                            <option value="attendance">참석 여부</option>
                            <option value="companions">동반 인원</option>
                            <option value="meal">식사 여부</option>
                            <option value="notes">비고</option>
                          </SelectField>
                        </div>
                        <div className="flex flex-col gap-2">
                          <FieldLabel htmlFor={`field_label_${field.id}`}>라벨</FieldLabel>
                          <TextInput
                            id={`field_label_${field.id}`}
                            name="rsvp_field_label"
                            defaultValue={field.label}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-[14px]">
                        <input
                          type="checkbox"
                          name="rsvp_field_required"
                          defaultChecked={field.required}
                        />
                        필수 항목
                      </label>
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={`field_placeholder_${field.id}`}>
                          플레이스홀더
                        </FieldLabel>
                        <TextInput
                          id={`field_placeholder_${field.id}`}
                          name="rsvp_field_placeholder"
                          defaultValue={field.placeholder || ''}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={`field_options_${field.id}`}>
                          옵션 (줄바꿈)
                        </FieldLabel>
                        <TextArea
                          id={`field_options_${field.id}`}
                          name="rsvp_field_options"
                          defaultValue={(field.options || []).join('\n')}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={`field_sort_${field.id}`}>정렬 순서</FieldLabel>
                        <TextInput
                          id={`field_sort_${field.id}`}
                          name="rsvp_field_sort_order"
                          type="number"
                          defaultValue={field.sort_order}
                        />
                      </div>
                    </form>
                    <div className="flex items-center justify-end gap-2">
                      <Button type="submit" size="sm" form={formId}>
                        저장
                      </Button>
                      <form action={deleteRsvpFieldAction}>
                        <input type="hidden" name="rsvp_field_id" value={field.id} />
                        <Button type="submit" variant="danger" size="sm">
                          삭제
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-[12px] text-[var(--text-muted)]">
              등록된 필드가 없습니다
            </div>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">RSVP 응답 목록</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="overflow-hidden rounded-[12px] border border-[var(--border-light)] bg-white/70">
            <div className="grid grid-cols-5 gap-2 border-b border-[var(--border-light)] px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)]">
              <span>이름</span>
              <span>참석</span>
              <span>인원</span>
              <span>식사</span>
              <span>작성일</span>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {(() => {
                const pageSize = 8;
                const totalPages = Math.max(1, Math.ceil(rsvpResponses.length / pageSize));
                const currentPage = Math.min(rsvpPage, totalPages);
                const startIndex = (currentPage - 1) * pageSize;
                const pageItems = rsvpResponses.slice(startIndex, startIndex + pageSize);

                return pageItems.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-5 gap-2 px-4 py-3 text-[13px] text-[var(--text-primary)]"
                  >
                    <span className="font-medium">{entry.name}</span>
                    <span>{entry.attendance}</span>
                    <span>{entry.companions || '-'}</span>
                    <span>{entry.meal || '-'}</span>
                    <span className="text-[var(--text-muted)]">
                      {new Date(entry.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="flex items-center justify-between text-[12px] text-[var(--text-muted)]">
            <span>총 {rsvpResponses.length}건</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRsvpPage((prev) => Math.max(1, prev - 1))}
                className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() =>
                  setRsvpPage((prev) =>
                    Math.min(Math.max(1, Math.ceil(rsvpResponses.length / 8)), prev + 1)
                  )
                }
                className="rounded-[8px] border border-[var(--border-light)] px-2 py-1 text-[12px] text-[var(--text-secondary)]"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
};
