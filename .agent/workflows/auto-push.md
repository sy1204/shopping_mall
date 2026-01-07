---
description: 코드 수정 후 자동으로 git commit & push 실행
---

# Auto Push Workflow

코드 수정이 완료되면 다음 단계를 자동으로 실행합니다:

// turbo-all

1. 변경된 파일 스테이징
```bash
git add -A
```

2. 커밋 메시지 작성 및 커밋
```bash
git commit -m "[변경 내용 요약]"
```

3. 원격 저장소에 푸시
```bash
git push
```

## 주의사항
- 커밋 메시지는 변경 내용을 간결하게 요약합니다
- 빌드 에러가 있는 경우 푸시하지 않습니다
