package com.complaint.system.config;

import com.complaint.system.entity.*;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import com.complaint.system.enums.RoleType;
import com.complaint.system.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final FeedbackRepository feedbackRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           CategoryRepository categoryRepository,
                           ComplaintRepository complaintRepository,
                           ComplaintUpdateRepository complaintUpdateRepository,
                           FeedbackRepository feedbackRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.complaintRepository = complaintRepository;
        this.complaintUpdateRepository = complaintUpdateRepository;
        this.feedbackRepository = feedbackRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Roles
        Role userRole = roleRepository.save(new Role(RoleType.ROLE_USER));
        Role staffRole = roleRepository.save(new Role(RoleType.ROLE_STAFF));
        Role adminRole = roleRepository.save(new Role(RoleType.ROLE_ADMIN));

        // 2. Departments
        Department itDept = departmentRepository.save(new Department("Information Technology", "IT Hardware, Network and Software Systems", "it-support@demo.com"));
        Department facilitiesDept = departmentRepository.save(new Department("Facilities & Maintenance", "Physical infrastructure, repairs, and utilities", "facilities@demo.com"));
        Department billingDept = departmentRepository.save(new Department("Finance & Billing", "Invoicing, payments, and account refunds", "billing@demo.com"));
        Department adminDept = departmentRepository.save(new Department("Administration", "General administration and user services", "admin-dept@demo.com"));

        // 3. Categories
        Category catNetwork = categoryRepository.save(new Category("Network & Internet", "Wi-Fi, LAN drops, and VPN connectivity", itDept, true));
        Category catHardware = categoryRepository.save(new Category("Hardware & Devices", "Laptops, monitors, printers, and peripherals", itDept, true));
        Category catFacilities = categoryRepository.save(new Category("HVAC & Utilities", "Air conditioning, lighting, electrical and plumbing", facilitiesDept, true));
        Category catOffice = categoryRepository.save(new Category("Office Equipment", "Desks, ergonomic chairs, and office fixtures", facilitiesDept, true));
        Category catBilling = categoryRepository.save(new Category("Billing & Accounts", "Subscription discrepancies, invoices, and charges", billingDept, true));
        Category catSoftware = categoryRepository.save(new Category("Software & Accounts", "Application licensing, portal access, and passwords", itDept, true));

        // 4. Demo Users
        // Admin: admin@demo.com / Admin@123
        User admin = new User("System Administrator", "admin@demo.com", passwordEncoder.encode("Admin@123"), "+1 555-0100", adminRole);
        admin.setDepartment(adminDept);
        admin = userRepository.save(admin);

        // Staff: staff@demo.com / Staff@123
        User staff = new User("Alex Morgan (Staff)", "staff@demo.com", passwordEncoder.encode("Staff@123"), "+1 555-0101", staffRole);
        staff.setDepartment(itDept);
        staff = userRepository.save(staff);

        // Additional Staff
        User staffFacilities = new User("Carlos Reyes (Facilities Staff)", "carlos.staff@demo.com", passwordEncoder.encode("Staff@123"), "+1 555-0102", staffRole);
        staffFacilities.setDepartment(facilitiesDept);
        userRepository.save(staffFacilities);

        // User: user@demo.com / User@123
        User user = new User("Sarah Jenkins", "user@demo.com", passwordEncoder.encode("User@123"), "+1 555-0103", userRole);
        user = userRepository.save(user);

        // Additional User
        User user2 = new User("David Miller", "david.m@demo.com", passwordEncoder.encode("User@123"), "+1 555-0104", userRole);
        userRepository.save(user2);

        // 5. Sample Complaints
        // Complaint 1: In Progress
        Complaint c1 = new Complaint();
        c1.setComplaintNumber("CMP-2026-0001");
        c1.setTitle("High latency and frequent Wi-Fi disconnection on 3rd floor");
        c1.setDescription("Every afternoon around 2 PM the wireless network drops repeatedly across East Wing, interrupting video conference meetings.");
        c1.setCategory(catNetwork);
        c1.setUser(user);
        c1.setAssignedStaff(staff);
        c1.setPriority(Priority.HIGH);
        c1.setStatus(ComplaintStatus.IN_PROGRESS);
        c1.setLocation("Building A, 3rd Floor East Wing");
        c1.setCreatedAt(LocalDateTime.now().minusDays(3));
        c1.setUpdatedAt(LocalDateTime.now().minusDays(1));
        c1 = complaintRepository.save(c1);

        complaintUpdateRepository.save(new ComplaintUpdate(c1, user, null, ComplaintStatus.SUBMITTED, "Complaint submitted by Sarah Jenkins"));
        complaintUpdateRepository.save(new ComplaintUpdate(c1, admin, ComplaintStatus.SUBMITTED, ComplaintStatus.ASSIGNED, "Assigned to Alex Morgan for inspection"));
        complaintUpdateRepository.save(new ComplaintUpdate(c1, staff, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, "Inspecting access points AP-301 and AP-302. Replacing faulty switch module."));

        // Complaint 2: Under Review
        Complaint c2 = new Complaint();
        c2.setComplaintNumber("CMP-2026-0002");
        c2.setTitle("Air conditioning unit leaking condensation in Conference Room B");
        c2.setDescription("Water is dripping from the ceiling unit onto the projector table. Potential hazard for electronic devices.");
        c2.setCategory(catFacilities);
        c2.setUser(user);
        c2.setPriority(Priority.URGENT);
        c2.setStatus(ComplaintStatus.UNDER_REVIEW);
        c2.setLocation("Main Office, 2nd Floor Conference Room B");
        c2.setCreatedAt(LocalDateTime.now().minusDays(1));
        c2.setUpdatedAt(LocalDateTime.now().minusHours(12));
        c2 = complaintRepository.save(c2);

        complaintUpdateRepository.save(new ComplaintUpdate(c2, user, null, ComplaintStatus.SUBMITTED, "Initial submission with urgent priority"));
        complaintUpdateRepository.save(new ComplaintUpdate(c2, admin, ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, "Triage in progress; notifying building facilities manager."));

        // Complaint 3: Resolved with Feedback
        Complaint c3 = new Complaint();
        c3.setComplaintNumber("CMP-2026-0003");
        c3.setTitle("Broken hydraulic lift on ergonomic desk chair");
        c3.setDescription("The chair sinks to minimum height immediately upon sitting down. Back support lever is also loose.");
        c3.setCategory(catOffice);
        c3.setUser(user);
        c3.setAssignedStaff(staffFacilities);
        c3.setPriority(Priority.MEDIUM);
        c3.setStatus(ComplaintStatus.RESOLVED);
        c3.setLocation("Floor 1, Workstation 42");
        c3.setCreatedAt(LocalDateTime.now().minusDays(5));
        c3.setUpdatedAt(LocalDateTime.now().minusDays(2));
        c3.setResolvedAt(LocalDateTime.now().minusDays(2));
        c3 = complaintRepository.save(c3);

        complaintUpdateRepository.save(new ComplaintUpdate(c3, user, null, ComplaintStatus.SUBMITTED, "Complaint submitted"));
        complaintUpdateRepository.save(new ComplaintUpdate(c3, admin, ComplaintStatus.SUBMITTED, ComplaintStatus.ASSIGNED, "Assigned to Carlos Reyes"));
        complaintUpdateRepository.save(new ComplaintUpdate(c3, staffFacilities, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, "Ordered replacement chair from storage."));
        complaintUpdateRepository.save(new ComplaintUpdate(c3, staffFacilities, ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, "New ergonomic chair delivered and installed at Workstation 42."));

        feedbackRepository.save(new Feedback(c3, user, 5, "Remarkable response time! Carlos replaced the chair very promptly. Excellent service!"));

        // Complaint 4: Escalated (>7 days overdue)
        Complaint c4 = new Complaint();
        c4.setComplaintNumber("CMP-2026-0004");
        c4.setTitle("Freight elevator safety door sensor malfunction");
        c4.setDescription("The heavy goods elevator doors keep bouncing back without closing properly on ground floor loading dock.");
        c4.setCategory(catFacilities);
        c4.setUser(user2);
        c4.setAssignedStaff(staffFacilities);
        c4.setPriority(Priority.URGENT);
        c4.setStatus(ComplaintStatus.IN_PROGRESS);
        c4.setLocation("Loading Dock A, Ground Level");
        c4.setEscalated(true); // Demonstrating escalation flag
        c4.setCreatedAt(LocalDateTime.now().minusDays(10));
        c4.setUpdatedAt(LocalDateTime.now().minusDays(3));
        c4 = complaintRepository.save(c4);

        complaintUpdateRepository.save(new ComplaintUpdate(c4, user2, null, ComplaintStatus.SUBMITTED, "Submitted urgent ticket"));
        complaintUpdateRepository.save(new ComplaintUpdate(c4, admin, ComplaintStatus.SUBMITTED, ComplaintStatus.ASSIGNED, "Assigned to facilities"));
        complaintUpdateRepository.save(new ComplaintUpdate(c4, staffFacilities, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, "Parts requested from elevator vendor."));
        complaintUpdateRepository.save(new ComplaintUpdate(c4, null, ComplaintStatus.IN_PROGRESS, ComplaintStatus.IN_PROGRESS, "ESCALATION: Complaint has remained unresolved for more than 7 days."));

        // Complaint 5: Billing inquiry
        Complaint c5 = new Complaint();
        c5.setComplaintNumber("CMP-2026-0005");
        c5.setTitle("Duplicate charge on monthly software license subscription");
        c5.setDescription("Statement reflects two charges of $120 for invoice #INV-8891 on the same card on November 2nd.");
        c5.setCategory(catBilling);
        c5.setUser(user);
        c5.setPriority(Priority.LOW);
        c5.setStatus(ComplaintStatus.SUBMITTED);
        c5.setLocation("Virtual / Account Billing");
        c5.setCreatedAt(LocalDateTime.now().minusHours(5));
        c5.setUpdatedAt(LocalDateTime.now().minusHours(5));
        c5 = complaintRepository.save(c5);

        complaintUpdateRepository.save(new ComplaintUpdate(c5, user, null, ComplaintStatus.SUBMITTED, "Submitted billing dispute with invoice copy attached"));

        // 6. Notifications
        notificationRepository.save(new Notification(user, "Complaint Status: IN_PROGRESS", "Your Wi-Fi complaint (CMP-2026-0001) is currently being investigated by staff.", c1.getId(), c1.getComplaintNumber()));
        notificationRepository.save(new Notification(user, "Complaint Resolved: CMP-2026-0003", "Your ergonomic chair complaint has been marked RESOLVED. Please provide your rating!", c3.getId(), c3.getComplaintNumber()));
        notificationRepository.save(new Notification(staff, "New Assignment: CMP-2026-0001", "You have been assigned to investigate Wi-Fi disconnection on 3rd floor.", c1.getId(), c1.getComplaintNumber()));
        notificationRepository.save(new Notification(admin, "Escalation Alert: CMP-2026-0004", "Freight elevator safety door sensor has exceeded 7 days without resolution.", c4.getId(), c4.getComplaintNumber()));
    }
}
