'use client';

import type { AdminDashboardData } from '@/app/(admin)/admin/data';
import { updateClosingAction } from '@/app/(admin)/admin/actions/content';
import { StandardButton, StandardCard, StandardInput } from '@/components/admin/StandardComponents';
import { SaveIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

type AdminSectionClosingProps = {
  closing: AdminDashboardData['closing'];
};

/**
 * 마무리 인삿말 섹션
 * @param props AdminSectionClosingProps
 * @returns JSX.Element
 */
export const AdminSectionClosing = ({ closing }: AdminSectionClosingProps) => {
  const [form, setForm] = useState({
    sectionTitle: closing.section_title || '',
    message: closing.message || '',
    copyright: closing.copyright || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('closing_section_title', form.sectionTitle);
      formData.append('closing_message', form.message);
      formData.append('closing_copyright', form.copyright);
      await updateClosingAction(formData);
      toast.success('마무리 인삿말이 저장되었습니다.');
    } catch (_error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <StandardCard
      title="마무리 인삿말"
      actions={
        <StandardButton size="sm" loading={saving} onClick={handleSave}>
          <SaveIcon className="w-4 h-4 mr-2" />
          저장
        </StandardButton>
      }
    >
      <div className="space-y-4">
        <StandardInput
          label="섹션 타이틀"
          value={form.sectionTitle}
          onChange={(value) => setForm((prev) => ({ ...prev, sectionTitle: value }))}
          placeholder="입력하세요"
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">메시지</label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            placeholder="입력하세요"
          />
        </div>
        <StandardInput
          label="저작권 표기"
          value={form.copyright}
          onChange={(value) => setForm((prev) => ({ ...prev, copyright: value }))}
          placeholder="입력하세요"
        />
      </div>
    </StandardCard>
  );
};
