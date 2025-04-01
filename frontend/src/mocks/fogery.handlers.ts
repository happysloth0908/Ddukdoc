// src/mocks/handlers/verification.handlers.ts
import { http, HttpResponse } from 'msw';

// Define the base URL that your API client is using
const API_BASE_URL = 'http://localhost:8080';

export const forgeryHandlers = [
  // Match the complete URL
  http.post(`${API_BASE_URL}/api/verification`, async ({ request }) => {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return new HttpResponse(
        JSON.stringify({
          success: false,
          data: null,
          error: 'Invalid content type. Expected multipart/form-data',
          timestamp: new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    try {
      // For debugging: Log that the handler caught the request
      console.log('MSW intercepted verification request');

      // Uncomment to see form data content
      // const formData = await request.formData();
      // console.log('File received:', formData.get('file'));

      // Success case response
      return HttpResponse.json({
        success: true,
        data: 'success',
        error: null,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });

      // Failure case (comment out the success response when testing this)
      /*
      return HttpResponse.json({
        success: false,
        data: 'fail',
        error: null,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
      */
    } catch (err) {
      console.error('Verification API error:', err);
      return HttpResponse.json(
        {
          success: false,
          data: null,
          error: 'Internal server error',
          timestamp: new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),
        },
        { status: 500 }
      );
    }
  }),

  // Add a handler for the root path that was also failing
  http.get(`${API_BASE_URL}/`, () => {
    return HttpResponse.json({
      success: true,
      message: 'MSW is intercepting root requests',
    });
  }),
];
