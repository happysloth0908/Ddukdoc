import { http, HttpResponse } from 'msw';

export const mypageHandlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get(`https://example.com/api/docs?send_receive_status=1`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      success: true,
      data: {
        content: [
          {
            id: 1, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 2, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 3, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 4, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 5, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 6, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 7, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 8, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 9, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
          {
            id: 10, // number - 문서 고유 식별자
            template_id: 1, // number - 문서 종류 번호
            template_code: 'G2', //String - 문서 종류 코드
            template_name: '차용증', // string - 문서 종류 이름
            title: '03.12 전아현 차용증', // string - 문서 제목
            status: '서명 대기', // string - 문서 현재 상태
            creator_id: 1, // number - 발신자 ID
            creator_name: '김발신', // string - 발신자 이름
            recipient_id: 31, // number - 수신자 ID
            recipient_name: '이수신', // string - 수신자 이름
            created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
            updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
            return_reason: null, // string | null - 반송 사유 (없을 경우 null)
          },
        ],
        page_number: 1,
        total_pages: 10,
        total_elements: 150,
        page_size: 10,
        first: true,
        last: false,
      },
      error: null,
    });
  }),
];
