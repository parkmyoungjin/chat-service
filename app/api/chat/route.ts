import { NextResponse } from 'next/server';

// 환경 변수에서 설정 가져오기
const apiKey = process.env.OPENAI_API_KEY;
const apiType = process.env.OPENAI_API_TYPE || 'openai';
const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const orgId = process.env.OPENAI_ORG_ID || '';
const useMock = process.env.OPENAI_USE_MOCK === 'true';

if (!apiKey && !useMock) {
  console.error('OPENAI_API_KEY가 설정되지 않았습니다.');
}

console.log('API 구성:', {
  useMock,
  type: apiType,
  baseUrl: baseUrl,
  model: model,
  keyPrefix: apiKey?.substring(0, 7) + '...',
  hasOrgId: !!orgId
});

// 모의 응답 생성 함수
function generateMockResponse(userMessage: string): string {
  // 몇 가지 기본 응답 패턴
  const responses = [
    `당신의 메시지 "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"에 대한 모의 응답입니다. 실제 AI가 응답하려면 유효한 API 키가 필요합니다.`,
    `안녕하세요! 이것은 테스트 응답입니다. 당신의 질문: "${userMessage.substring(0, 20)}${userMessage.length > 20 ? '...' : ''}"`,
    `ChatGPT 클론이 작동 중입니다. 이것은 API 키 없이 생성된 테스트 응답입니다.`,
    `테스트 모드입니다. 실제 AI 응답을 받으려면 유효한 OpenAI API 키를 설정하세요.`,
  ];
  
  // 랜덤 응답 선택
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '올바른 메시지 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    console.log('요청 메시지:', JSON.stringify(messages));

    // 메시지 형식 변환
    const formattedMessages = messages.map((message: any) => ({
      role: message.role,
      content: message.content,
    }));

    // 모의 응답 모드인 경우
    if (useMock) {
      console.log('모의 응답 모드 사용 중');
      const userMessage = messages[messages.length - 1].content;
      const mockResponse = generateMockResponse(userMessage);
      
      return NextResponse.json({
        content: mockResponse
      });
    }

    try {
      // API 엔드포인트 구성
      const chatEndpoint = `${baseUrl}/chat/completions`;
      console.log('사용할 API 엔드포인트:', chatEndpoint);

      // 요청 헤더 설정
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };

      // 조직 ID가 있으면 추가
      if (orgId) {
        headers['OpenAI-Organization'] = orgId;
      }

      // API 요청 본문
      const requestBody: any = {
        model: model,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      };

      // sk-proj- 키인 경우 특별 처리 (예: 다른 필드 필요)
      if (apiKey?.startsWith('sk-proj-')) {
        console.log('프로젝트 API 키 감지됨, 요청 형식 조정');
        // 필요한 경우 requestBody 필드 조정
      }

      // API 호출
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      // API 응답 상태 로깅
      console.log('API 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 에러 텍스트:', errorText);
        
        let errorData;
        let errorMessage = "알 수 없는 오류";
        
        try {
          errorData = JSON.parse(errorText);
          console.error('파싱된 에러 데이터:', errorData);
          
          // 오류 메시지 추출 시도
          if (errorData.error) {
            if (typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            } else if (errorData.error.message) {
              errorMessage = errorData.error.message;
            } else if (errorData.error.type) {
              errorMessage = errorData.error.type;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error('JSON 파싱 오류:', e);
          errorData = { error: errorText };
          errorMessage = errorText;
        }
        
        console.error('API 에러 데이터:', errorData, '추출된 메시지:', errorMessage);
        
        // API 키나 권한 문제인 경우
        if (response.status === 401 || response.status === 403) {
          return NextResponse.json({
            content: `API 인증에 문제가 있습니다 (${response.status}). API 키와 엔드포인트를 확인해주세요.`,
          });
        }
        
        // API 연결 문제인 경우
        if (response.status === 404) {
          return NextResponse.json({
            content: `API 엔드포인트를 찾을 수 없습니다 (404). 현재 엔드포인트: ${chatEndpoint}`,
          });
        }
        
        // 요청 한도 초과 문제인 경우 (429 Too Many Requests)
        if (response.status === 429) {
          return NextResponse.json({
            content: `API 요청 한도를 초과했습니다 (429). 잠시 후 다시 시도하세요. 오류 상세: ${errorMessage}`,
          });
        }

        // 기타 오류 처리
        return NextResponse.json({
          content: `API 호출 중 오류가 발생했습니다 (${response.status}). 오류 메시지: ${errorMessage}`,
        });
      }

      const data = await response.json();
      console.log('API 응답 데이터 키:', Object.keys(data));

      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return NextResponse.json({
          content: data.choices[0].message.content,
        });
      } else {
        console.error('예상치 못한 API 응답 형식:', data);
        return NextResponse.json({
          content: "API 응답 형식이 예상과 다릅니다. 개발자 콘솔을 확인해주세요.",
        });
      }
    } catch (apiError: any) {
      console.error('API 호출 에러:', apiError);
      
      // API 오류 발생 시 상세 정보 포함
      return NextResponse.json({
        content: `API 호출 중 오류가 발생했습니다: ${apiError.message}\n가능한 해결 방법: 1) API 키 확인 2) 올바른 API 엔드포인트 설정 3) 네트워크 연결 확인`,
      });
    }
  } catch (error: any) {
    console.error('서버 에러:', error);
    
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.', 
        details: error.message || '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 