package com.complaint.system.service;

import com.complaint.system.dto.DashboardStatsResponse;
import com.complaint.system.entity.Category;
import com.complaint.system.entity.Complaint;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.RoleType;
import com.complaint.system.repository.CategoryRepository;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ReportService(ComplaintRepository complaintRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        List<Complaint> complaints = complaintRepository.findAll();
        long total = complaints.size();
        stats.setTotalComplaints(total);

        long pending = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.SUBMITTED || c.getStatus() == ComplaintStatus.UNDER_REVIEW)
                .count();
        stats.setPendingComplaints(pending);

        long inProgress = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.ASSIGNED || c.getStatus() == ComplaintStatus.IN_PROGRESS)
                .count();
        stats.setInProgressComplaints(inProgress);

        long resolved = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED)
                .count();
        stats.setResolvedComplaints(resolved);

        long rejected = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.REJECTED)
                .count();
        stats.setRejectedComplaints(rejected);

        long escalated = complaints.stream()
                .filter(Complaint::isEscalated)
                .count();
        stats.setEscalatedComplaints(escalated);

        stats.setTotalUsers(userRepository.count());
        stats.setTotalStaff(userRepository.findByRoleName(RoleType.ROLE_STAFF).size());

        double resRate = total > 0 ? ((double) resolved / total) * 100 : 0.0;
        stats.setResolutionRate(Math.round(resRate * 10.0) / 10.0);

        // Average resolution days
        List<Complaint> resolvedList = complaints.stream()
                .filter(c -> c.getResolvedAt() != null && c.getCreatedAt() != null)
                .toList();

        if (!resolvedList.isEmpty()) {
            double totalDays = resolvedList.stream()
                    .mapToDouble(c -> Duration.between(c.getCreatedAt(), c.getResolvedAt()).toHours() / 24.0)
                    .sum();
            double avgDays = Math.round((totalDays / resolvedList.size()) * 10.0) / 10.0;
            stats.setAvgResolutionDays(avgDays);
        } else {
            stats.setAvgResolutionDays(0.0);
        }

        // 1. Category Distribution (Pie Chart)
        Map<String, Long> categoryCount = complaints.stream()
                .collect(Collectors.groupingBy(c -> c.getCategory().getName(), Collectors.counting()));

        List<Map<String, Object>> catList = new ArrayList<>();
        categoryCount.forEach((cat, cnt) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", cat);
            map.put("value", cnt);
            catList.add(map);
        });
        stats.setCategoryDistribution(catList);

        // 2. Monthly Trend (Line Chart)
        DateTimeFormatter monthYearFormat = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Long> monthlyCount = complaints.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getCreatedAt().format(monthYearFormat),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        List<Map<String, Object>> monthList = new ArrayList<>();
        monthlyCount.forEach((m, cnt) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", m);
            map.put("complaints", cnt);
            monthList.add(map);
        });
        stats.setMonthlyTrends(monthList);

        // 3. Resolution Time Comparison by Category (Bar Chart)
        List<Category> allCategories = categoryRepository.findAll();
        List<Map<String, Object>> resComp = new ArrayList<>();

        for (Category cat : allCategories) {
            List<Complaint> catResolved = resolvedList.stream()
                    .filter(c -> c.getCategory().getId().equals(cat.getId()))
                    .toList();

            double avgCatDays = 0.0;
            if (!catResolved.isEmpty()) {
                double catDays = catResolved.stream()
                        .mapToDouble(c -> Duration.between(c.getCreatedAt(), c.getResolvedAt()).toHours() / 24.0)
                        .sum();
                avgCatDays = Math.round((catDays / catResolved.size()) * 10.0) / 10.0;
            }

            Map<String, Object> m = new HashMap<>();
            m.put("category", cat.getName());
            m.put("avgDays", avgCatDays > 0 ? avgCatDays : 1.5); // sensible fallback default if no complaints yet
            resComp.add(m);
        }
        stats.setResolutionTimeComparison(resComp);

        return stats;
    }

    public ByteArrayInputStream exportComplaintsToCsv(List<Complaint> complaints) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Write CSV Header
            writer.println("Complaint ID,Title,Category,Priority,Status,User,Assigned Staff,Escalated,Created At,Resolved At");

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            for (Complaint c : complaints) {
                String assigned = c.getAssignedStaff() != null ? c.getAssignedStaff().getFullName() : "Unassigned";
                String resolvedAt = c.getResolvedAt() != null ? c.getResolvedAt().format(dtf) : "N/A";
                String createdAt = c.getCreatedAt() != null ? c.getCreatedAt().format(dtf) : "N/A";

                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        c.getComplaintNumber(),
                        c.getTitle().replace("\"", "\"\""),
                        c.getCategory().getName(),
                        c.getPriority().name(),
                        c.getStatus().name(),
                        c.getUser().getFullName(),
                        assigned,
                        c.isEscalated() ? "YES" : "NO",
                        createdAt,
                        resolvedAt
                );
            }
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}
