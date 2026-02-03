'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdminSelectOption = {
  value: string;
  label: string;
};

type AdminSelectFieldProps = {
  id?: string;
  name: string;
  defaultValue: string;
  options: AdminSelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

/**
 * 관리자 셀렉트 필드
 * @param props AdminSelectFieldProps
 * @returns JSX.Element
 */
export const AdminSelectField = ({
  id,
  name,
  defaultValue,
  options,
  placeholder,
  disabled = false,
}: AdminSelectFieldProps) => {
  const normalizedDefault = String(defaultValue || '').trim();
  const hasMatch = options.some((option) => option.value === normalizedDefault);
  const resolvedDefault = hasMatch ? normalizedDefault : '';
  const [value, setValue] = useState(resolvedDefault);
  const currentLabel =
    options.find((option) => option.value === value)?.label || value || '';
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const nextDefault = String(defaultValue || '').trim();
    const matched = options.some((option) => option.value === nextDefault);
    const resolved = matched ? nextDefault : '';
    setValue(resolved);
  }, [defaultValue, options]);

  /**
   * 변경 이벤트 전달
   * @returns void
   */
  const notifyChange = useCallback(() => {
    if (!hiddenInputRef.current) return;
    hiddenInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    hiddenInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    notifyChange();
  }, [value, notifyChange]);

  return (
    <>
      {disabled ? (
        <Input id={id} value={currentLabel} readOnly />
      ) : (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder ?? '선택하세요'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        value={value}
        data-admin-track="true"
      />
    </>
  );
};
