package com.skillsync.utility;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorInfo {
    private int errorCode;
    private String errorMessage;
    private String uri;
    private List<String> validationErrors;

    public ErrorInfo(int errorCode, String errorMessage, String uri) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.uri = uri;
    }
}
