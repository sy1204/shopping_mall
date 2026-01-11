/**
 * 후속 질문 생성 (다양한 표현 사용)
 */
function generateFollowUpQuestion(
    conversationType: ConversationType,
    responseLength: number,
    tone: UserTone
): string | null {
    // 응답이 너무 길면 후속 질문 추가 안 함
    if (responseLength > 200) return null;

    // 랜덤 선택 함수
    const randomChoice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // 격식 있는 톤
    if (tone === UserTone.FORMAL) {
        const formalOptions: Record<ConversationType, string[]> = {
            [ConversationType.GREETING]: [
                '어떤 도움이 필요하신가요?',
                '무엇을 도와드릴까요?',
                '어떤 상품을 찾고 계신가요?'
            ],
            [ConversationType.SMALL_TALK]: [
                '무엇을 도와드릴까요?',
                '어떤 도움이 필요하신가요?'
            ],
            [ConversationType.QUESTION]: [
                '더 궁금하신 점이 있으신가요?',
                '추가로 알고 싶으신 내용이 있나요?',
                '다른 궁금한 점이 있으신가요?'
            ],
            [ConversationType.REQUEST]: [
                '다른 스타일도 보여드릴까요?',
                '다른 옵션도 살펴보시겠어요?',
                '비슷한 다른 제품도 궁금하신가요?',
                '추가로 보여드릴 제품이 있을까요?'
            ],
            [ConversationType.FEEDBACK]: [
                '어떤 부분이 마음에 드셨나요?',
                '어떤 점이 좋으셨나요?',
                '더 자세히 알려주시겠어요?'
            ],
            [ConversationType.CLOSING]: ['']
        };
        const options = formalOptions[conversationType];
        return options.length > 0 ? randomChoice(options) : null;
    }

    // 친근한 톤
    const friendlyOptions: Record<ConversationType, string[]> = {
        [ConversationType.GREETING]: [
            '어떤 도움이 필요하세요?',
            '뭘 도와드릴까요?',
            '어떤 걸 찾으세요?'
        ],
        [ConversationType.SMALL_TALK]: [
            '무엇을 도와드릴까요?',
            '뭘 도와드릴까요?'
        ],
        [ConversationType.QUESTION]: [
            '더 궁금한 점 있으세요?',
            '다른 궁금한 거 있어요?',
            '추가로 알고 싶은 게 있나요?'
        ],
        [ConversationType.REQUEST]: [
            '다른 스타일도 볼까요?',
            '다른 것도 보여드릴까요?',
            '비슷한 다른 제품도 볼래요?',
            '다른 옵션도 궁금하세요?'
        ],
        [ConversationType.FEEDBACK]: [
            '어떤 부분이 좋으셨어요?',
            '어떤 점이 마음에 드셨어요?',
            '더 알려주실래요?'
        ],
        [ConversationType.CLOSING]: ['']
    };

    const options = friendlyOptions[conversationType];
    return options.length > 0 ? randomChoice(options) : null;
}
