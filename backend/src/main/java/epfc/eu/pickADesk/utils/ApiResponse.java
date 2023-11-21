package epfc.eu.pickADesk.utils;

import lombok.Getter;

@Getter

public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    // Constructors

    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(boolean success) {
        this.success = success;
    }

    // Getters and setters

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setData(Object data) {
        this.data = data;
    }
}

