export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * JSON POST 요청 공통 처리
 * @param url string
 * @param body JsonValue
 * @returns Promise<Response>
 */
export const postJson = async (url: string, body: JsonValue) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
