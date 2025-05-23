export interface ApiResponse {
  success: boolean;
  data: unknown;
  error: {
    code: string;
    message: string;
  };
  time_stamp: string;
}

export interface DocData {
  document_id: number;
  template_id: number;
  template_code: string;
  template_name: string;
  title: string;
  status: '서명 대기' | '서명 완료' | '반송' | '문서 삭제';
  creator_id: number;
  creator_name: string;
  recipient_id: number;
  recipient_name: string;
  created_at: string;
  updated_at: string;
  return_reason: string | null;
}

export interface FileData {
  id: number;
  material_id: number;
  title: string;
  user_id: number;
  user_name: string;
  file_content?: string;
  format: string;
  created_at: string;
  updated_at: string;
}

export interface SsafyDocData {
  document_id: number;
  template_id: number;
  template_code: string;
  template_name: string;
  title: string;
  status: string;
  creator_id: number;
  creator_name: string;
  created_at: string;
  updated_at: string;
  creator_signature: string;
}
