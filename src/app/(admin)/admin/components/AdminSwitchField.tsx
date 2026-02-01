'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type AdminSwitchFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
  className?: string;
};

/**
 * 관리자 스위치 필드
 * @param props AdminSwitchFieldProps
 * @returns JSX.Element
 */
export const AdminSwitchField = ({
  id,
  name,
  label,
  defaultChecked = false,
  className,
}: AdminSwitchFieldProps) => {
  const [checked, setChecked] = useState(defaultChecked);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

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
  }, [checked, notifyChange]);

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <Label htmlFor={id} className="text-[14px] text-[var(--text-primary)]">
        {label}
      </Label>
      <Switch
        id={id}
        data-admin-switch="true"
        checked={checked}
        onCheckedChange={setChecked}
        className="focus-visible:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
      />
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        value={checked ? 'on' : ''}
        data-admin-track="true"
      />
    </div>
  );
};
