package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// ControlService handles communication with Control Service API
type ControlService struct {
	BaseURL    string
	HTTPClient *http.Client
}

// CreateDeviceRequest represents request for creating device
type CreateDeviceRequest struct {
	DeviceID   string `json:"deviceId"`
	DeviceType string `json:"deviceType"`
	UserID     string `json:"userId"`
}

// CreateDeviceResponse represents response from device creation
type CreateDeviceResponse struct {
	Success   bool      `json:"success"`
	Message   string    `json:"message"`
	DeviceID  string    `json:"deviceId"`
	UserID    string    `json:"userId"`
	Status    string    `json:"status"`
	IsOnline  bool      `json:"isOnline"`
	CreatedAt time.Time `json:"createdAt"`
}

// DeviceState represents device state
type DeviceState struct {
	DeviceID   string                 `json:"deviceId"`
	DeviceType string                 `json:"deviceType"`
	Status     string                 `json:"status"`
	State      map[string]interface{} `json:"state"`
	UpdatedAt  time.Time              `json:"updatedAt"`
}

// ExecuteCommandRequest represents command execution request
type ExecuteCommandRequest struct {
	Command string  `json:"command"`
	Value   float64 `json:"value"`
}

// ExecuteCommandResponse represents command execution response
type ExecuteCommandResponse struct {
	Success  bool                   `json:"success"`
	Message  string                 `json:"message"`
	DeviceID string                 `json:"deviceId"`
	NewState map[string]interface{} `json:"newState"`
}

// UpdateDeviceRequest represents device update request
type UpdateDeviceRequest struct {
	State  map[string]interface{} `json:"state,omitempty"`
}

// UpdateDeviceResponse represents device update response
type UpdateDeviceResponse struct {
	Success   bool      `json:"success"`
	Message   string    `json:"message"`
	DeviceID  string    `json:"deviceId"`
	Status    string    `json:"status"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ErrorResponse represents error response
type ErrorResponse struct {
	Error     string    `json:"error"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// NewControlService creates a new control service client
func NewControlService(baseURL string) *ControlService {
	return &ControlService{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// CreateDevice creates a new device in Control Service
func (s *ControlService) CreateDevice(deviceID, deviceType, userID string) (*CreateDeviceResponse, error) {
	url := fmt.Sprintf("%s/api/v1/devices", s.BaseURL)

	reqBody := CreateDeviceRequest{
		DeviceID:   deviceID,
		DeviceType: deviceType,
		UserID:     userID,
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
		var errResp ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return nil, fmt.Errorf("error creating device: %s - %s", errResp.Error, errResp.Message)
	}

	var result CreateDeviceResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &result, nil
}

// GetDeviceState retrieves current device state
func (s *ControlService) GetDeviceState(deviceID string) (*DeviceState, error) {
	url := fmt.Sprintf("%s/api/v1/devices/%s", s.BaseURL, deviceID)

	resp, err := s.HTTPClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errResp ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return nil, fmt.Errorf("error getting device state: %s - %s", errResp.Error, errResp.Message)
	}

	var state DeviceState
	if err := json.NewDecoder(resp.Body).Decode(&state); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &state, nil
}

// UpdateDevice updates device status or state
func (s *ControlService) UpdateDevice(deviceID string, state map[string]interface{}) (*UpdateDeviceResponse, error) {
	url := fmt.Sprintf("%s/api/v1/devices/%s", s.BaseURL, deviceID)

	reqBody := UpdateDeviceRequest{}
	if state != nil {
		reqBody.State = state
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("error marshalling request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPatch, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errResp ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return nil, fmt.Errorf("error updating device: %s - %s", errResp.Error, errResp.Message)
	}

	var result UpdateDeviceResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &result, nil
}

// ExecuteCommand executes a command on device
func (s *ControlService) ExecuteCommand(deviceID, command string, value float64) (*ExecuteCommandResponse, error) {
	url := fmt.Sprintf("%s/api/v1/devices/%s/command", s.BaseURL, deviceID)

	reqBody := ExecuteCommandRequest{
		Command:    command,
		Value:   value,
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

	if resp.StatusCode != http.StatusOK {
		var errResp ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return nil, fmt.Errorf("error executing command: %s - %s", errResp.Error, errResp.Message)
	}

	var result ExecuteCommandResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("error decoding response: %w", err)
	}

	return &result, nil
}

// DeleteDevice soft deletes a device
func (s *ControlService) DeleteDevice(deviceID string) error {
	url := fmt.Sprintf("%s/api/v1/devices/%s", s.BaseURL, deviceID)

	req, err := http.NewRequest(http.MethodDelete, url, nil)
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error executing request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		var errResp ErrorResponse
		if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
			return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
		}
		return fmt.Errorf("error deleting device: %s", errResp.Message)
	}

	return nil
}
