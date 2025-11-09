package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

// TelemetryService handles communication with Telemetry Service API
type TelemetryService struct {
	BaseURL    string
	HTTPClient *http.Client
}

// TelemetrySubmitRequest represents request for submitting telemetry
type TelemetrySubmitRequest struct {
	DeviceID string                 `json:"deviceId"`
	Data     map[string]interface{} `json:"data"`
}

// TelemetrySubmitResponse represents response from telemetry submission
type TelemetrySubmitResponse struct {
	Success  bool   `json:"success"`
	Message  string `json:"message"`
	RecordID string `json:"recordId"`
}

// TelemetryDataPoint represents a single telemetry data point
type TelemetryDataPoint struct {
	Timestamp string                 `json:"timestamp"`
	Data      map[string]interface{} `json:"data"`
}

// TelemetryListResponse represents response with telemetry history
type TelemetryListResponse struct {
	DeviceID string               `json:"deviceId"`
	From     string               `json:"from"`
	To       string               `json:"to"`
	Total    int                  `json:"total"`
	Limit    int                  `json:"limit"`
	Offset   int                  `json:"offset"`
	Data     []TelemetryDataPoint `json:"data"`
}

// TelemetryQueryParams represents query parameters for telemetry retrieval
type TelemetryQueryParams struct {
	DeviceID string
	From     time.Time
	To       time.Time
	Limit    *int
	Offset   *int
}

// TelemetryErrorResponse represents error response
type TelemetryErrorResponse struct {
	Error     string    `json:"error"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// NewTelemetryService creates a new telemetry service client
func NewTelemetryService(baseURL string) *TelemetryService {
	return &TelemetryService{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// SubmitTelemetry submits telemetry data from device
func (s *TelemetryService) SubmitTelemetry(deviceID string, data map[string]interface{}) (*TelemetrySubmitResponse, error) {
	url := fmt.Sprintf("%s/api/v1/telemetry", s.BaseURL)

	reqBody := TelemetrySubmitRequest{
		DeviceID: deviceID,
		Data:     data,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("error marshalling request: %w", err)
	}

	resp, err := s.HTTPClient.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		var errResp TelemetryErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return nil, fmt.Errorf("error submitting telemetry: %s - %s", errResp.Error, errResp.Message)
	}

	var result TelemetrySubmitResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &result, nil
}

// GetTelemetry retrieves telemetry history for device
func (s *TelemetryService) GetTelemetry(params TelemetryQueryParams) (*TelemetryListResponse, error) {
	baseURL := fmt.Sprintf("%s/api/v1/telemetry", s.BaseURL)

	// Build query parameters
	queryParams := url.Values{}
	queryParams.Add("deviceId", params.DeviceID)
	queryParams.Add("from", params.From.Format(time.RFC3339))
	queryParams.Add("to", params.To.Format(time.RFC3339))

	if params.Limit != nil {
		queryParams.Add("limit", strconv.Itoa(*params.Limit))
	}

	if params.Offset != nil {
		queryParams.Add("offset", strconv.Itoa(*params.Offset))
	}

	fullURL := fmt.Sprintf("%s?%s", baseURL, queryParams.Encode())

	resp, err := s.HTTPClient.Get(fullURL)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errResp TelemetryErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return nil, fmt.Errorf("error getting telemetry: %s - %s", errResp.Error, errResp.Message)
	}

	var result TelemetryListResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &result, nil
}

