'use client';

import { useEffect, useState } from 'react';
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
};

/**
 * 관리자 셀렉트 필드
 * @param props AdminSelectFieldProps
 * @returns JSX.Element
 */
export const AdminSelectField = ({ id, name, defaultValue, options }: AdminSelectFieldProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </>
  );
};
