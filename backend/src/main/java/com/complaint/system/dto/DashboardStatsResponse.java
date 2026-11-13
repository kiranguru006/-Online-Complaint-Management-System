package com.complaint.system.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalComplaints;
    private long pendingComplaints; // SUBMITTED + UNDER_REVIEW
    private long inProgressComplaints; // ASSIGNED + IN_PROGRESS
    private long resolvedComplaints; // RESOLVED + CLOSED
    private long rejectedComplaints;
    private long escalatedComplaints;
    private long totalUsers;
    private long totalStaff;
    private double resolutionRate; // percentage
    private double avgResolutionDays;
    private List<Map<String, Object>> categoryDistribution;
    private List<Map<String, Object>> monthlyTrends;
    private List<Map<String, Object>> resolutionTimeComparison;

    public DashboardStatsResponse() {
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getPendingComplaints() {
        return pendingComplaints;
    }

    public void setPendingComplaints(long pendingComplaints) {
        this.pendingComplaints = pendingComplaints;
    }

    public long getInProgressComplaints() {
        return inProgressComplaints;
    }

    public void setInProgressComplaints(long inProgressComplaints) {
        this.inProgressComplaints = inProgressComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getRejectedComplaints() {
        return rejectedComplaints;
    }

    public void setRejectedComplaints(long rejectedComplaints) {
        this.rejectedComplaints = rejectedComplaints;
    }

    public long getEscalatedComplaints() {
        return escalatedComplaints;
    }

    public void setEscalatedComplaints(long escalatedComplaints) {
        this.escalatedComplaints = escalatedComplaints;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public double getResolutionRate() {
        return resolutionRate;
    }

    public void setResolutionRate(double resolutionRate) {
        this.resolutionRate = resolutionRate;
    }

    public double getAvgResolutionDays() {
        return avgResolutionDays;
    }

    public void setAvgResolutionDays(double avgResolutionDays) {
        this.avgResolutionDays = avgResolutionDays;
    }

    public List<Map<String, Object>> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<Map<String, Object>> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<Map<String, Object>> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<Map<String, Object>> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public List<Map<String, Object>> getResolutionTimeComparison() {
        return resolutionTimeComparison;
    }

    public void setResolutionTimeComparison(List<Map<String, Object>> resolutionTimeComparison) {
        this.resolutionTimeComparison = resolutionTimeComparison;
    }
}
