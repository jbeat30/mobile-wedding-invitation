/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * bcrypt 해시 생성 스크립트
 *
 * 사용법:
 *   node scripts/generate-bcrypt-hash.js [비밀번호]
 *   pnpm run hash-password [비밀번호]
 *
 * 예시:
 *   node scripts/generate-bcrypt-hash.js myPassword123
 *   pnpm run hash-password myPassword123
 *
 * 비밀번호를 입력하지 않으면 대화형으로 입력받습니다.
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

// Salt rounds (높을수록 보안성 높지만 느림)
const SALT_ROUNDS = 10;

/**
 * bcrypt 해시 생성
 * @param {string} password - 평문 비밀번호
 * @returns {string} bcrypt 해시
 */
function generateHash(password) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

/**
 * 대화형으로 비밀번호 입력받기
 * @returns {Promise<string>}
 */
function promptPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('비밀번호를 입력하세요: ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * SQL 쿼리 생성 (참고용)
 * @param {string} hash - bcrypt 해시
 * @param {string} username - 사용자명
 */
function generateSQLQueries(hash, username = 'admin') {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Supabase SQL 쿼리 (참고용)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('1️⃣ 기존 계정 비밀번호 수정:');
  console.log(`\nUPDATE admin_users
SET password_hash = '${hash}',
    updated_at = NOW()
WHERE username = '${username}';\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('2️⃣ 새 계정 생성:');
  console.log(`\nINSERT INTO admin_users (username, password_hash, name, role, is_active)
VALUES (
  '${username}',
  '${hash}',
  '관리자',
  'admin',
  true
);\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 메인 함수
 */
async function main() {
  console.log('\n🔐 bcrypt 해시 생성기\n');

  // 커맨드 라인 인자에서 비밀번호 가져오기
  let password = process.argv[2];

  // 비밀번호가 없으면 대화형으로 입력받기
  if (!password) {
    password = await promptPassword();
  }

  // 비밀번호 검증
  if (!password || password.trim() === '') {
    console.error('❌ 오류: 비밀번호가 비어있습니다.');
    process.exit(1);
  }

  // 해시 생성
  const hash = generateHash(password);

  // 결과 출력
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ bcrypt 해시 생성 완료');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`원본 비밀번호: ${password}`);
  console.log(`Salt Rounds:  ${SALT_ROUNDS}`);
  console.log(`\nbcrypt 해시:\n${hash}\n`);

  // SQL 쿼리 생성 (선택사항)
  const username = process.argv[3] || 'admin';
  generateSQLQueries(hash, username);

  console.log('💡 팁: 위 SQL을 복사하여 Supabase SQL Editor에서 실행하세요.\n');
}

// 스크립트 실행
main().catch((error) => {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
});
