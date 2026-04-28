# Current Task

## Objectives of the work

`MessageList`의 메시지 렌더링 로직을 DOM 기반으로 정리한다.

## Target Files

- `src/components/chattingRoom/body/messageListView.ts`
- `src/components/chattingRoom/body/messageItemView.ts`

## What to pay special attention to in this work

- date separator 로직은 기존 동작과 동일하게 유지한다.
- 메시지 객체 캐싱 구조는 변경하지 않는다.
- `helperInjectTemplate`, `createFragment` 사용 패턴은 유지한다.