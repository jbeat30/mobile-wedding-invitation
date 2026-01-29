'use client';

import { ReactNode, useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  EyeIcon, 
  EyeOffIcon, 
  InfoIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  UploadIcon,
  XIcon
} from 'lucide-react';
import { Switch } from '@headlessui/react';

interface ModernInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
  name?: string;
  autoComplete?: string;
}

/**
 * 현대적인 입력 필드
 */
export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  success,
  hint,
  icon,
  rightElement,
  className,
  name,
  autoComplete,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={cn('space-y-2', className)}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 입력 필드 */}
      <div className="relative">
        {/* 아이콘 */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            icon && 'pl-10',
            (rightElement || type === 'password') && 'pr-10',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-400/20',
            success && 'border-green-300 focus:border-green-400 focus:ring-green-400/20',
            isFocused && !error && !success && 'border-rose-400 ring-2 ring-rose-400/20'
          )}
          {...props}
        />

        {/* 오른쪽 요소들 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          )}
          
          {success && (
            <CheckCircle2Icon className="w-4 h-4 text-green-500" />
          )}
          
          {error && (
            <AlertCircleIcon className="w-4 h-4 text-red-500" />
          )}
          
          {rightElement}
        </div>
      </div>

      {/* 메시지들 */}
      <div className="space-y-1">
        {hint && !error && !success && (
          <p className="text-xs text-slate-500 flex items-center space-x-1">
            <InfoIcon className="w-3 h-3" />
            <span>{hint}</span>
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 flex items-center space-x-1">
            <AlertCircleIcon className="w-3 h-3" />
            <span>{error}</span>
          </p>
        )}
        
        {success && (
          <p className="text-xs text-green-600 flex items-center space-x-1">
            <CheckCircle2Icon className="w-3 h-3" />
            <span>{success}</span>
          </p>
        )}
      </div>
    </div>
  );
});

ModernInput.displayName = 'ModernInput';

interface ModernTextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  maxLength?: number;
  className?: string;
}

/**
 * 현대적인 텍스트 영역
 */
export const ModernTextarea = ({
  label,
  placeholder,
  value = '',
  onChange,
  rows = 4,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  maxLength,
  className,
  ...props
}: ModernTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = value.length;

  return (
    <div className={cn('space-y-2', className)}>
      {/* 라벨 */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {maxLength && (
            <span className={cn(
              'text-xs',
              currentLength > maxLength * 0.9 ? 'text-orange-500' : 'text-slate-400',
              currentLength >= maxLength ? 'text-red-500' : ''
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* 텍스트 영역 */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed resize-none',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-400/20',
            success && 'border-green-300 focus:border-green-400 focus:ring-green-400/20',
            isFocused && !error && !success && 'border-rose-400 ring-2 ring-rose-400/20'
          )}
          {...props}
        />

        {/* 상태 아이콘 */}
        <div className="absolute top-3 right-3">
          {success && <CheckCircle2Icon className="w-4 h-4 text-green-500" />}
          {error && <AlertCircleIcon className="w-4 h-4 text-red-500" />}
        </div>
      </div>

      {/* 메시지들 */}
      <div className="space-y-1">
        {hint && !error && !success && (
          <p className="text-xs text-slate-500 flex items-center space-x-1">
            <InfoIcon className="w-3 h-3" />
            <span>{hint}</span>
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 flex items-center space-x-1">
            <AlertCircleIcon className="w-3 h-3" />
            <span>{error}</span>
          </p>
        )}
        
        {success && (
          <p className="text-xs text-green-600 flex items-center space-x-1">
            <CheckCircle2Icon className="w-3 h-3" />
            <span>{success}</span>
          </p>
        )}
      </div>
    </div>
  );
};

interface ModernSelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
}

/**
 * 현대적인 선택 박스
 */
export const ModernSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = '선택하세요',
  required = false,
  disabled = false,
  error,
  success,
  hint,
  className
}: ModernSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn('space-y-2', className)}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 선택 박스 */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-400/20',
            success && 'border-green-300 focus:border-green-400 focus:ring-green-400/20',
            isFocused && !error && !success && 'border-rose-400 ring-2 ring-rose-400/20'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 상태 아이콘 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {success && <CheckCircle2Icon className="w-4 h-4 text-green-500" />}
          {error && <AlertCircleIcon className="w-4 h-4 text-red-500" />}
        </div>
      </div>

      {/* 메시지들 */}
      <div className="space-y-1">
        {hint && !error && !success && (
          <p className="text-xs text-slate-500 flex items-center space-x-1">
            <InfoIcon className="w-3 h-3" />
            <span>{hint}</span>
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 flex items-center space-x-1">
            <AlertCircleIcon className="w-3 h-3" />
            <span>{error}</span>
          </p>
        )}
        
        {success && (
          <p className="text-xs text-green-600 flex items-center space-x-1">
            <CheckCircle2Icon className="w-3 h-3" />
            <span>{success}</span>
          </p>
        )}
      </div>
    </div>
  );
};

interface ModernSwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 현대적인 스위치
 */
export const ModernSwitch = ({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className
}: ModernSwitchProps) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11', 
    lg: 'h-7 w-13'
  };

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        {description && (
          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-rose-400/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          checked ? 'bg-rose-500' : 'bg-slate-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            thumbSizeClasses[size],
            checked ? (size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-5' : 'translate-x-6') : 'translate-x-0'
          )}
        />
      </Switch>
    </div>
  );
};

interface ModernFileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  preview?: boolean;
  maxSize?: number; // MB
  className?: string;
}

/**
 * 현대적인 파일 업로드
 */
export const ModernFileUpload = ({
  label,
  accept,
  multiple = false,
  onChange,
  disabled = false,
  error,
  success,
  hint,
  maxSize,
  className
}: ModernFileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // 파일 크기 검증
    if (maxSize) {
      const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`);
        return;
      }
    }

    setSelectedFiles(fileArray);
    onChange?.(fileArray);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onChange?.(newFiles);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* 업로드 영역 */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) {
            handleFileChange(e.dataTransfer.files);
          }
        }}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
          dragOver && !disabled ? 'border-rose-400 bg-rose-50' : 'border-slate-300 hover:border-slate-400',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-300',
          success && 'border-green-300'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-2">
          <UploadIcon className={cn(
            'mx-auto w-8 h-8',
            dragOver ? 'text-rose-500' : 'text-slate-400'
          )} />
          <div>
            <p className="text-sm font-medium text-slate-700">
              {dragOver ? '파일을 여기에 놓으세요' : '파일을 선택하거나 드래그하세요'}
            </p>
            {maxSize && (
              <p className="text-xs text-slate-500 mt-1">
                최대 파일 크기: {maxSize}MB
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 선택된 파일 목록 */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">선택된 파일</p>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메시지들 */}
      <div className="space-y-1">
        {hint && !error && !success && (
          <p className="text-xs text-slate-500 flex items-center space-x-1">
            <InfoIcon className="w-3 h-3" />
            <span>{hint}</span>
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 flex items-center space-x-1">
            <AlertCircleIcon className="w-3 h-3" />
            <span>{error}</span>
          </p>
        )}
        
        {success && (
          <p className="text-xs text-green-600 flex items-center space-x-1">
            <CheckCircle2Icon className="w-3 h-3" />
            <span>{success}</span>
          </p>
        )}
      </div>
    </div>
  );
};