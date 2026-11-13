package com.complaint.system.dto;

import jakarta.validation.constraints.NotNull;

public class ComplaintAssignRequest {

    @NotNull(message = "Staff ID is required")
    private Long staffId;

    private String remarks;

    public ComplaintAssignRequest() {
    }

    public ComplaintAssignRequest(Long staffId, String remarks) {
        this.staffId = staffId;
        this.remarks = remarks;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
