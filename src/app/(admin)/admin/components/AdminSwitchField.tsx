'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <Label htmlFor={id} className="text-[13px] text-[var(--text-primary)]">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={setChecked} />
      <input type="hidden" name={name} value={checked ? 'on' : ''} />
    </div>
  );
};
