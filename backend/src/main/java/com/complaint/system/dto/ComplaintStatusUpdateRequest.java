package com.complaint.system.dto;

import com.complaint.system.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public class ComplaintStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    private String remarks;

    public ComplaintStatusUpdateRequest() {
    }

    public ComplaintStatusUpdateRequest(ComplaintStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
