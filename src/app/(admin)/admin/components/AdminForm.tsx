'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useActionState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Toast } from '@/components/ui/Toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AdminFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
  submittedAt?: number;
};

type AdminFormProps = {
  action: (formData: FormData) => Promise<
    void | { ok?: boolean; message?: string; fieldErrors?: Record<string, string> }
  >;
  successMessage?: string;
  errorMessage?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  className?: string;
  formId?: string;
  children: ReactNode;
};

type AdminFormContextValue = {
  isDirty: boolean;
  isEmpty: boolean;
  fieldErrors: Record<string, string>;
};

const AdminFormContext = createContext<AdminFormContextValue | null>(null);

/**
 * 관리자 폼 상태 조회
 * @returns AdminFormContextValue
 */
export const useAdminFormState = () => {
  const context = useContext(AdminFormContext);
  return context ?? { isDirty: true, isEmpty: false, fieldErrors: {} };
};

export const useAdminFieldError = (name: string) => {
  const { fieldErrors } = useAdminFormState();
  return fieldErrors[name];
};

export const AdminFieldError = ({ name }: { name: string }) => {
  const message = useAdminFieldError(name);
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
};

type AdminFormValueMap = Record<string, string[]>;

/**
 * 추적 가능한 폼 요소만 수집
 * @param form HTMLFormElement
 * @returns HTMLElement[]
 */
const getTrackableElements = (form: HTMLFormElement) => {
  return Array.from(form.elements).filter(
    (
      element
    ): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
      if (
        !(
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        )
      ) {
        return false;
      }
      if (!element.name) return false;
      if (element instanceof HTMLInputElement && element.type === 'file') {
        return false;
      }
      if (element instanceof HTMLInputElement && element.type === 'hidden') {
        return element.dataset.adminTrack === 'true';
      }
      return element.type !== 'submit' && element.type !== 'button';
    }
  );
};

/**
 * 비어있음 체크 대상 요소 필터링
 * @param form HTMLFormElement
 * @returns HTMLElement[]
 */
const getValueElements = (form: HTMLFormElement) => {
  return getTrackableElements(form).filter((element) => {
    if (element instanceof HTMLInputElement) {
      if (['checkbox', 'radio', 'hidden', 'file', 'submit', 'button'].includes(element.type)) {
        return false;
      }
    }
    return true;
  });
};

/**
 * 폼 값 스냅샷 생성
 * @param form HTMLFormElement
 * @returns AdminFormValueMap
 */
const getFormValues = (form: HTMLFormElement): AdminFormValueMap => {
  const values: AdminFormValueMap = {};
  const elements = getTrackableElements(form);
  elements.forEach((element) => {
    const name = element.name;
    const currentValues = values[name] ?? [];
    if (element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')) {
      currentValues.push(element.checked ? 'on' : '');
    } else {
      currentValues.push(element.value);
    }
    values[name] = currentValues;
  });
  return values;
};

/**
 * 폼 값 비교용 시리얼라이즈
 * @param values AdminFormValueMap
 * @returns string
 */
const serializeFormValues = (values: AdminFormValueMap) => {
  return Object.keys(values)
    .sort()
    .map((key) => `${key}:${values[key].join('|')}`)
    .join('||');
};

/**
 * 폼이 비어있는지 판정
 * @param values AdminFormValueMap
 * @returns boolean
 */
const isFormEmpty = (form: HTMLFormElement) => {
  const elements = getValueElements(form);
  if (elements.length === 0) {
    return false;
  }
  return elements.every((element) => element.value.trim().length === 0);
};

/**
 * 관리자 저장 폼 래퍼
 * @param props AdminFormProps
 * @returns JSX.Element
 */
export const AdminForm = ({
  action,
  successMessage = '저장 완료',
  errorMessage = '저장에 실패했습니다',
  confirmTitle = '저장하시겠어요?',
  confirmDescription = '확인 버튼을 누르면 즉시 반영됩니다.',
  className,
  formId,
  children,
}: AdminFormProps) => {
  const queryClient = useQueryClient();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const allowSubmitRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const initialValuesRef = useRef<string>('');

  const [state, formAction] = useActionState<AdminFormState, FormData>(
    async (_prevState, formData) => {
      try {
        const result = await action(formData);
        if (result && typeof result === 'object' && 'ok' in result && result.ok === false) {
          return {
            status: 'error',
            message: result.message,
            fieldErrors: result.fieldErrors,
            submittedAt: Date.now(),
          };
        }
        return { status: 'success', submittedAt: Date.now() };
      } catch (error) {
        console.error('Admin form submit failed:', error);
        const message = error instanceof Error && error.message ? error.message : undefined;
        return { status: 'error', message, submittedAt: Date.now() };
      }
    },
    { status: 'idle' }
  );

  useEffect(() => {
    if (state.status === 'idle') {
      return;
    }
    if (state.status === 'error') {
      if (state.fieldErrors && Object.keys(state.fieldErrors).length > 0) {
        setFieldErrors(state.fieldErrors);
        return;
      }
      setFieldErrors({});
    }
    const message =
      state.status === 'success'
        ? successMessage
        : state.message || errorMessage;
    setToastMessage(message);
    setToastOpen(true);
    if (state.status === 'success') {
      setFieldErrors({});
      void queryClient.invalidateQueries({ queryKey: ['adminData'] });
    }
    const timer = window.setTimeout(() => setToastOpen(false), 2000);
    return () => window.clearTimeout(timer);
  }, [
    state.status,
    state.submittedAt,
    state.message,
    state.fieldErrors,
    successMessage,
    errorMessage,
    queryClient,
  ]);

  /**
   * 폼 상태 재계산
   * @returns void
   */
  const evaluateFormState = useCallback(() => {
    if (!formRef.current) return;
    const values = getFormValues(formRef.current);
    const serialized = serializeFormValues(values);
    setIsDirty(serialized !== initialValuesRef.current);
    setIsEmpty(isFormEmpty(formRef.current));
  }, []);

  const applyFieldErrors = useCallback(
    (nextFieldErrors: Record<string, string>) => {
      if (!formRef.current) return;
      const form = formRef.current;
      form.querySelectorAll('[data-admin-field-error="true"]').forEach((node) => node.remove());
      form
        .querySelectorAll('.admin-field-error')
        .forEach((node) => node.classList.remove('admin-field-error'));
      form
        .querySelectorAll('[aria-invalid="true"]')
        .forEach((node) => node.removeAttribute('aria-invalid'));

      if (!nextFieldErrors || Object.keys(nextFieldErrors).length === 0) {
        return;
      }

      const escapeName =
        typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
          ? CSS.escape
          : (value: string) => value.replace(/["\\]/g, '\\$&');

      Object.entries(nextFieldErrors).forEach(([name, message]) => {
        const selector = `[name="${escapeName(name)}"]`;
        const element = form.querySelector(selector) as HTMLElement | null;
        if (!element) return;

        const wrapper = element.closest('[data-admin-field-wrapper="true"]') as HTMLElement | null;
        const errorNode = document.createElement('p');
        errorNode.dataset.adminFieldError = 'true';
        errorNode.className = 'admin-field-error-message';
        errorNode.textContent = message;

        if (wrapper) {
          const hasDropzone = Boolean(wrapper.querySelector('[data-admin-dropzone="true"]'));
          const trigger = wrapper.querySelector('[role="combobox"]') as HTMLElement | null;
          if (hasDropzone) {
            wrapper.classList.add('admin-field-error');
          }
          if (trigger) {
            trigger.classList.add('admin-field-error');
            trigger.setAttribute('aria-invalid', 'true');
          }
          wrapper.insertAdjacentElement('afterend', errorNode);
          return;
        }

        element.classList.add('admin-field-error');
        element.setAttribute('aria-invalid', 'true');
        element.insertAdjacentElement('afterend', errorNode);
      });
    },
    []
  );

  const clearFieldError = useCallback((name?: string | null) => {
    if (!name) return;
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  useEffect(() => {
    applyFieldErrors(fieldErrors);
  }, [applyFieldErrors, fieldErrors]);

  useEffect(() => {
    if (!formRef.current) return;
    const values = getFormValues(formRef.current);
    initialValuesRef.current = serializeFormValues(values);
    setIsDirty(false);
    setIsEmpty(isFormEmpty(formRef.current));
  }, []);

  useEffect(() => {
    if (state.status !== 'success') return;
    if (!formRef.current) return;
    const values = getFormValues(formRef.current);
    initialValuesRef.current = serializeFormValues(values);
    setIsDirty(false);
    setIsEmpty(isFormEmpty(formRef.current));
  }, [state.status, state.submittedAt]);

  /**
   * 저장 전 확인 다이얼로그 열기
   * @param event React.FormEvent<HTMLFormElement>
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (allowSubmitRef.current) {
      allowSubmitRef.current = false;
      return;
    }
    event.preventDefault();
    setConfirmOpen(true);
  };

  /**
   * 확인 후 실제 저장 요청
   * @returns void
   */
  const handleConfirm = () => {
    allowSubmitRef.current = true;
    setConfirmOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <AdminFormContext.Provider value={{ isDirty, isEmpty, fieldErrors }}>
      <form
        ref={formRef}
        id={formId}
        action={formAction}
        className={className}
        onSubmit={handleSubmit}
        onInput={(event) => {
          evaluateFormState();
          clearFieldError((event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).name);
        }}
        onChange={(event) => {
          evaluateFormState();
          clearFieldError((event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).name);
        }}
      >
        {children}
      </form>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="admin-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-admin-variant="cancel">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toast
        isOpen={toastOpen}
        message={toastMessage}
        containerClassName="justify-end pr-6"
      />
    </AdminFormContext.Provider>
  );
};
