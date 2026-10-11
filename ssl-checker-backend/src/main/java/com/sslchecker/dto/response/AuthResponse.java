package com.sslchecker.dto.response;

public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String fullName, String role, String message) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.message = message;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String email;
        private String fullName;
        private String role;
        private String message;

        public Builder token(String token) { this.token = token; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder message(String message) { this.message = message; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, email, fullName, role, message);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
