import { http, HttpResponse } from 'msw';

// const url = import.meta.env.VITE_MSW_URL;
const url = import.meta.env.VITE_API_URL;

export const mypageHandlers = [
  // Intercept "GET https://example.com/user" requests...

  http.get(`${url}/api/docs?send_receive_status=1`, () => {
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

  http.get(`${url}/api/docs/1`, () => {
    return HttpResponse.json({
      success: true, // boolean - API 호출 성공 여부
      data: {
        docs_info: {
          id: 1, // number - 문서 고유 식별자
          template_id: 1, // string - 문서 종류 id
          template_code: 'G1', // string - 문서 종류 code
          template_name: '차용증', // string - 문서 종류 이름
          title: '3.11 신지혜 차용증', // string - 문서 제목
          status: '서명 대기', // string - 문서 현재 상태
          creator_id: 1234, // number - 발신자 ID
          creator_name: '홍길동', // string - 발신자 이름
          recipient_id: 5678, // number - 수신자 ID
          recipient_name: '김철수', // string - 수신자 이름
          created_at: '2024-12-04T15:30:00Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:05:20Z', // string (ISO 8601) - 수정 시간
          return_reason: null, // string | null - 반송 사유 (없을 경우 null)
        },
        field: [
          {
            field_id: 1, // number - 문서 필드 ID
            role_id: 2, //number - 1: 공통 , 2: 채권자, 3: 채무자, 4: 고용인 , 5: 고용주, 6: 교육생
            field_name: 'company_name', // string - 필드 식별 이름
            is_required: true, // boolean - 필수 입력 여부
            type: 'checkbox', // string - 필드 유형 (checkbox, text, date 등)
            order: 3, // number - 화면 표시 순서
            group: '채무자 정보', // string - 필드 그룹
            field_value: '홍길동', // string - 실제 입력 값
          },
          // 여러 필드가 배열로 제공됨
        ],
        signature: {
          creator_signature: 'xxx.png', // string | null - 발신자 서명 이미지 경로 (없을 경우 null)
          recipient_signature: null, // string | null - 수신자 서명 이미지 경로 (없을 경우 null)
        },
        user_role_info: {
          creator_role_id: 2, //number - 2: 채권자, 3: 채무자, 4: 고용인 , 5: 고용주, 6: 교육생
          recipient_role_id: 3, //number - 2: 채권자, 3: 채무자, 4: 고용인 , 5: 고용주, 6: 교육생
        },
      },
      error: null, // string | null - 오류 메시지 (오류가 없을 경우 null)
      timestamp: '2024-12-04T16:10:22Z', // string (ISO 8601) - 응답 생성 시간
    });
  }),

  http.get(`${url}/api/docs/2`, () => {
    return HttpResponse.json({
      success: false,
      data: null,
      error: {
        code: 'P002',
        message: '핀코드 입력이 필요합니다.',
      },
      timestamp: '2024-12-04 16:09:12', // timestamp - 에러 발생 시각
    });
  }),

  http.get(`${url}/api/materials/1`, () => {
    return HttpResponse.json({
      success: true, // boolean - API 호출 성공 여부
      data: [
        // array - 이미지 정보 목록
        {
          id: 1, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 2, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 3, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 4, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 5, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 6, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 7, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 8, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 9, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        {
          id: 10, // number - 증빙자료 ID
          title: '계좌 사진', // string - 파일 제목
          user_id: 1234, // number - 사용자 ID
          user_name: '홍길동', // string - 사진 저장 주체 이름
          format: 'jpeg', // string - 기타 자료 확장자
          created_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 생성 시간
          updated_at: '2024-12-04T16:10:22Z', // string (ISO 8601) - 수정 시간
        },
        // 여러 이미지 정보가 배열로 제공됨
      ],
      error: null, // string | null - 오류 메시지 (오류가 없을 경우 null)
      timestamp: '2024-12-04T16:10:22Z', // string (ISO 8601) - 응답 생성 시간
    });
  }),

  http.get(`${url}/api/materials/1/1`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        material_id: 1,
        title: '짱구',
        user_id: 1,
        user_name: 'AdminUser',
        file_url:
          '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',
        file_format: 'jpg',
        created_at: '2025-03-27T12:53:31.141891',
        updated_at: '2025-03-27T12:53:31.141891',
      },
      error: null,
      timestamp: '2025-03-27T12:54:10.0576993',
    });
  }),
];
