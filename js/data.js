/**
 * LMS Data Layer — localStorage CRUD + seed data
 */

const LMS = (() => {
    const KEYS = {
        users: 'lms_users',
        classes: 'lms_classes',
        announcements: 'lms_announcements',
        assignments: 'lms_assignments',
        submissions: 'lms_submissions',
        materials: 'lms_materials',
        messages: 'lms_messages',
        notifications: 'lms_notifications',
        enrollments: 'lms_enrollments',
        seeded: 'lms_seeded',
    };

    /* ===================== UTILS ===================== */
    const uid = () => '_' + Math.random().toString(36).substr(2, 9);
    const now = () => new Date().toISOString();
    const get = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));
    const getOne = (key, id) => get(key).find(x => x.id === id);

    /* ===================== COLORS ===================== */
    const CLASS_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#38bdf8', '#a855f7', '#ec4899', '#14b8a6'];
    let _colorIdx = 0;
    const nextColor = () => CLASS_COLORS[_colorIdx++ % CLASS_COLORS.length];

    /* ===================== SEED ===================== */
    function seed() {
        if (localStorage.getItem(KEYS.seeded)) return;

        // Demo users
        const teacher = { id: 'u_teacher1', name: 'Dr. Ananya Sharma', email: 'teacher@lms.com', password: 'password', role: 'teacher', avatar: 'AS', createdAt: now() };
        const student1 = { id: 'u_student1', name: 'Rahul Mehta', email: 'student@lms.com', password: 'password', role: 'student', avatar: 'RM', createdAt: now() };
        const student2 = { id: 'u_student2', name: 'Priya Patel', email: 'priya@lms.com', password: 'password', role: 'student', avatar: 'PP', createdAt: now() };
        const student3 = { id: 'u_student3', name: 'Arjun Kumar', email: 'arjun@lms.com', password: 'password', role: 'student', avatar: 'AK', createdAt: now() };
        set(KEYS.users, [teacher, student1, student2, student3]);

        // Demo classes
        const cls1 = { id: 'cls_1', name: 'Introduction to Computer Science', subject: 'CS101', section: 'A', teacherId: 'u_teacher1', joinCode: 'CS101A', color: '#6366f1', studentCount: 3, createdAt: now() };
        const cls2 = { id: 'cls_2', name: 'Data Structures & Algorithms', subject: 'CS201', section: 'B', teacherId: 'u_teacher1', joinCode: 'DS201B', color: '#10b981', studentCount: 2, createdAt: now() };
        const cls3 = { id: 'cls_3', name: 'Web Development', subject: 'WD301', section: 'C', teacherId: 'u_teacher1', joinCode: 'WD301C', color: '#f59e0b', studentCount: 1, createdAt: now() };
        set(KEYS.classes, [cls1, cls2, cls3]);

        // Enrollments
        const enrollments = [
            { id: uid(), classId: 'cls_1', studentId: 'u_student1', joinedAt: now() },
            { id: uid(), classId: 'cls_1', studentId: 'u_student2', joinedAt: now() },
            { id: uid(), classId: 'cls_1', studentId: 'u_student3', joinedAt: now() },
            { id: uid(), classId: 'cls_2', studentId: 'u_student1', joinedAt: now() },
            { id: uid(), classId: 'cls_2', studentId: 'u_student2', joinedAt: now() },
            { id: uid(), classId: 'cls_3', studentId: 'u_student1', joinedAt: now() },
        ];
        set(KEYS.enrollments, enrollments);

        // Announcements
        const ann1 = {
            id: 'ann_1', classId: 'cls_1', authorId: 'u_teacher1', text: 'Welcome everyone to CS101! Please review the course syllabus attached below. Our first lecture will be on Tuesday covering Algorithms & Complexity.', attachments: ['Syllabus.pdf'], timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), comments: [
                { id: uid(), authorId: 'u_student1', text: 'Thank you! Looking forward to this course.', timestamp: new Date(Date.now() - 2.5 * 24 * 3600000).toISOString() },
                { id: uid(), authorId: 'u_student2', text: 'Can we get the reading material early?', timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString() },
            ]
        };
        const ann2 = { id: 'ann_2', classId: 'cls_1', authorId: 'u_teacher1', text: 'Reminder: Assignment 1 on Binary Search Trees is due this Friday midnight. Please submit through the Classwork tab.', attachments: [], timestamp: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), comments: [] };
        const ann3 = { id: 'ann_3', classId: 'cls_2', authorId: 'u_teacher1', text: 'Welcome to DS201! We will begin with Linked Lists and move to Trees. Prerequisite: Please ensure you are comfortable with recursion.', attachments: ['DS_Overview.pdf'], timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), comments: [] };
        set(KEYS.announcements, [ann1, ann2, ann3]);

        // Assignments
        const future1 = new Date(Date.now() + 5 * 24 * 3600000).toISOString();
        const future2 = new Date(Date.now() + 2 * 24 * 3600000).toISOString();
        const past1 = new Date(Date.now() - 3 * 24 * 3600000).toISOString();
        const asgn1 = { id: 'asgn_1', classId: 'cls_1', title: 'Binary Search Tree Implementation', description: 'Implement a BST in the language of your choice. Include insert, delete, and search operations with complete test cases.', dueDate: future1, totalMarks: 100, attachments: ['BST_Instructions.pdf'], createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString() };
        const asgn2 = { id: 'asgn_2', classId: 'cls_1', title: 'Algorithm Complexity Quiz', description: 'Answer all 10 questions about Big-O notation, time, and space complexity.', dueDate: future2, totalMarks: 50, attachments: [], createdAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString() };
        const asgn3 = { id: 'asgn_3', classId: 'cls_1', title: 'Introduction to Sorting', description: 'Implement Bubble Sort, Merge Sort, and Quick Sort. Analyse their time complexities.', dueDate: past1, totalMarks: 75, attachments: [], createdAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString() };
        const asgn4 = { id: 'asgn_4', classId: 'cls_2', title: 'Linked List Operations', description: 'Implement singly and doubly linked list with all basic operations.', dueDate: future1, totalMarks: 80, attachments: ['LinkedList_Guide.pdf'], createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString() };
        const asgn5 = { id: 'asgn_5', classId: 'cls_3', title: 'Responsive Portfolio Page', description: 'Create a personal portfolio webpage using HTML and CSS only. Must be fully responsive.', dueDate: future2, totalMarks: 100, attachments: [], createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString() };
        set(KEYS.assignments, [asgn1, asgn2, asgn3, asgn4, asgn5]);

        // Submissions
        const sub1 = { id: 'sub_1', assignmentId: 'asgn_3', studentId: 'u_student1', content: 'Attached my implementation of all three sorting algorithms.', fileUrl: 'sorting_rahul.zip', submittedAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString(), grade: 70, feedback: 'Good work! Quick Sort could be optimized. Overall solid submission.' };
        const sub2 = { id: 'sub_2', assignmentId: 'asgn_3', studentId: 'u_student2', content: 'Here is my sorting implementation with detailed comments.', fileUrl: 'sorting_priya.zip', submittedAt: new Date(Date.now() - 3.5 * 24 * 3600000).toISOString(), grade: 68, feedback: 'Nice attempt. Merge Sort was slightly incorrect. Please review the merge step.' };
        const sub3 = { id: 'sub_3', assignmentId: 'asgn_1', studentId: 'u_student1', content: 'BST implementation with all three operations and 15 test cases.', fileUrl: 'bst_rahul.zip', submittedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), grade: null, feedback: null };
        set(KEYS.submissions, [sub1, sub2, sub3]);

        // Materials
        const mats = [
            { id: 'mat_1', classId: 'cls_1', title: 'Course Syllabus CS101', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString() },
            { id: 'mat_2', classId: 'cls_1', title: 'Lecture 1 - Introduction to Algorithms', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 8 * 24 * 3600000).toISOString() },
            { id: 'mat_3', classId: 'cls_1', title: 'Big-O Notation Video', type: 'video', url: 'https://www.youtube.com/watch?v=v4cd1O4zkGw', uploadedAt: new Date(Date.now() - 6 * 24 * 3600000).toISOString() },
            { id: 'mat_4', classId: 'cls_1', title: 'Data Structures Reference', type: 'link', url: 'https://visualgo.net', uploadedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString() },
            { id: 'mat_5', classId: 'cls_2', title: 'DS201 Course Overview', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 9 * 24 * 3600000).toISOString() },
            { id: 'mat_6', classId: 'cls_3', title: 'HTML & CSS Reference Sheet', type: 'doc', url: '#', uploadedAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString() },
        ];
        set(KEYS.materials, mats);

        // Notifications for students
        const notifs = [
            { id: uid(), userId: 'u_student1', type: 'assignment', text: 'New assignment: Binary Search Tree Implementation in CS101', read: false, timestamp: new Date(Date.now() - 7 * 24 * 3600000).toISOString() },
            { id: uid(), userId: 'u_student1', type: 'grade', text: 'Your Sorting assignment has been graded: 70/75', read: false, timestamp: new Date(Date.now() - 1 * 24 * 3600000).toISOString() },
            { id: uid(), userId: 'u_student1', type: 'announcement', text: 'New announcement in CS101: Assignment 1 reminder', read: true, timestamp: new Date(Date.now() - 1 * 24 * 3600000).toISOString() },
            { id: uid(), userId: 'u_student2', type: 'assignment', text: 'New assignment: Algorithm Complexity Quiz in CS101', read: false, timestamp: new Date(Date.now() - 4 * 24 * 3600000).toISOString() },
        ];
        set(KEYS.notifications, notifs);

        localStorage.setItem(KEYS.seeded, '1');
    }

    /* ===================== AUTH ===================== */
    const Auth = {
        getCurrentUser: () => JSON.parse(sessionStorage.getItem('lms_user') || 'null'),
        setCurrentUser: (user) => sessionStorage.setItem('lms_user', JSON.stringify(user)),
        logout: () => { sessionStorage.removeItem('lms_user'); window.location.href = '/index.html'; },
        login(email, password) {
            const users = get(KEYS.users);
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
            if (!user) return null;
            Auth.setCurrentUser(user);
            return user;
        },
        register(data) {
            const users = get(KEYS.users);
            if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) return { error: 'Email already registered' };
            const user = { id: uid(), ...data, avatar: data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2), createdAt: now() };
            users.push(user);
            set(KEYS.users, users);
            Auth.setCurrentUser(user);
            return { user };
        },
        requireAuth(role) {
            const user = Auth.getCurrentUser();
            if (!user) { window.location.href = '/index.html'; return null; }
            if (role && user.role !== role) {
                window.location.href = user.role === 'teacher' ? '/teacher/dashboard.html' : '/student/dashboard.html';
                return null;
            }
            return user;
        }
    };

    /* ===================== CLASSES ===================== */
    const Classes = {
        getAll: () => get(KEYS.classes),
        getById: (id) => getOne(KEYS.classes, id),
        getByTeacher: (teacherId) => get(KEYS.classes).filter(c => c.teacherId === teacherId),
        getByStudent: (studentId) => {
            const enroll = get(KEYS.enrollments).filter(e => e.studentId === studentId).map(e => e.classId);
            return get(KEYS.classes).filter(c => enroll.includes(c.id));
        },
        create(data) {
            const classes = get(KEYS.classes);
            const cls = { id: uid(), ...data, color: nextColor(), studentCount: 0, createdAt: now() };
            classes.push(cls);
            set(KEYS.classes, classes);
            return cls;
        },
        joinByCode(code, studentId) {
            const classes = get(KEYS.classes);
            const cls = classes.find(c => c.joinCode.toLowerCase() === code.toLowerCase());
            if (!cls) return { error: 'Invalid join code' };
            const enrollments = get(KEYS.enrollments);
            if (enrollments.find(e => e.classId === cls.id && e.studentId === studentId)) return { error: 'Already enrolled in this class' };
            enrollments.push({ id: uid(), classId: cls.id, studentId, joinedAt: now() });
            set(KEYS.enrollments, enrollments);
            // Update student count
            const idx = classes.findIndex(c => c.id === cls.id);
            classes[idx].studentCount = (classes[idx].studentCount || 0) + 1;
            set(KEYS.classes, classes);
            return { class: cls };
        },
        getStudents(classId) {
            const enrollments = get(KEYS.enrollments).filter(e => e.classId === classId);
            const users = get(KEYS.users);
            return enrollments.map(e => ({ ...users.find(u => u.id === e.studentId), joinedAt: e.joinedAt })).filter(Boolean);
        },
        removeStudent(classId, studentId) {
            const enrollments = get(KEYS.enrollments).filter(e => !(e.classId === classId && e.studentId === studentId));
            set(KEYS.enrollments, enrollments);
            const classes = get(KEYS.classes);
            const idx = classes.findIndex(c => c.id === classId);
            if (idx >= 0) { classes[idx].studentCount = Math.max(0, (classes[idx].studentCount || 1) - 1); set(KEYS.classes, classes); }
        },
        delete(id) { set(KEYS.classes, get(KEYS.classes).filter(c => c.id !== id)); }
    };

    /* ===================== ANNOUNCEMENTS ===================== */
    const Announcements = {
        getByClass: (classId) => get(KEYS.announcements).filter(a => a.classId === classId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
        create(data) {
            const list = get(KEYS.announcements);
            const ann = { id: uid(), ...data, timestamp: now(), comments: [] };
            list.unshift(ann);
            set(KEYS.announcements, list);
            // Notify enrolled students
            const students = Classes.getStudents(data.classId);
            const cls = Classes.getById(data.classId);
            students.forEach(s => Notifications.create(s.id, 'announcement', `New announcement in ${cls.name}`));
            return ann;
        },
        addComment(annId, comment) {
            const list = get(KEYS.announcements);
            const idx = list.findIndex(a => a.id === annId);
            if (idx < 0) return;
            list[idx].comments.push({ id: uid(), ...comment, timestamp: now() });
            set(KEYS.announcements, list);
        },
        delete(id) { set(KEYS.announcements, get(KEYS.announcements).filter(a => a.id !== id)); }
    };

    /* ===================== ASSIGNMENTS ===================== */
    const Assignments = {
        getByClass: (classId) => get(KEYS.assignments).filter(a => a.classId === classId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        getByStudent: (studentId) => {
            const enroll = get(KEYS.enrollments).filter(e => e.studentId === studentId).map(e => e.classId);
            return get(KEYS.assignments).filter(a => enroll.includes(a.classId));
        },
        getById: (id) => getOne(KEYS.assignments, id),
        create(data) {
            const list = get(KEYS.assignments);
            const asgn = { id: uid(), ...data, createdAt: now() };
            list.push(asgn);
            set(KEYS.assignments, list);
            // Notify students
            const students = Classes.getStudents(data.classId);
            const cls = Classes.getById(data.classId);
            students.forEach(s => Notifications.create(s.id, 'assignment', `New assignment: ${data.title} in ${cls.name}`));
            return asgn;
        },
        delete(id) { set(KEYS.assignments, get(KEYS.assignments).filter(a => a.id !== id)); }
    };

    /* ===================== SUBMISSIONS ===================== */
    const Submissions = {
        getByAssignment: (asgnId) => get(KEYS.submissions).filter(s => s.assignmentId === asgnId),
        getByStudent: (studentId) => get(KEYS.submissions).filter(s => s.studentId === studentId),
        getByStudentAndAssignment: (studentId, asgnId) => get(KEYS.submissions).find(s => s.studentId === studentId && s.assignmentId === asgnId),
        submit(data) {
            const list = get(KEYS.submissions);
            const existing = list.findIndex(s => s.studentId === data.studentId && s.assignmentId === data.assignmentId);
            const sub = { id: existing >= 0 ? list[existing].id : uid(), ...data, submittedAt: now(), grade: null, feedback: null };
            if (existing >= 0) list[existing] = sub; else list.push(sub);
            set(KEYS.submissions, list);
            // Notify teacher
            const asgn = Assignments.getById(data.assignmentId);
            if (asgn) {
                const cls = Classes.getById(asgn.classId);
                if (cls) Notifications.create(cls.teacherId, 'submission', `New submission for ${asgn.title}`);
            }
            return sub;
        },
        grade(subId, grade, feedback) {
            const list = get(KEYS.submissions);
            const idx = list.findIndex(s => s.id === subId);
            if (idx < 0) return;
            list[idx] = { ...list[idx], grade, feedback };
            set(KEYS.submissions, list);
            // Notify student
            const asgn = Assignments.getById(list[idx].assignmentId);
            if (asgn) Notifications.create(list[idx].studentId, 'grade', `Your submission for ${asgn.title} has been graded: ${grade}/${asgn.totalMarks}`);
            return list[idx];
        }
    };

    /* ===================== MATERIALS ===================== */
    const Materials = {
        getByClass: (classId) => get(KEYS.materials).filter(m => m.classId === classId).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
        create(data) {
            const list = get(KEYS.materials);
            const mat = { id: uid(), ...data, uploadedAt: now() };
            list.push(mat);
            set(KEYS.materials, list);
            return mat;
        },
        delete(id) { set(KEYS.materials, get(KEYS.materials).filter(m => m.id !== id)); }
    };

    /* ===================== NOTIFICATIONS ===================== */
    const Notifications = {
        getByUser: (userId) => get(KEYS.notifications).filter(n => n.userId === userId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
        getUnreadCount: (userId) => get(KEYS.notifications).filter(n => n.userId === userId && !n.read).length,
        create(userId, type, text) {
            const list = get(KEYS.notifications);
            list.push({ id: uid(), userId, type, text, read: false, timestamp: now() });
            set(KEYS.notifications, list);
        },
        markRead(id) {
            const list = get(KEYS.notifications);
            const idx = list.findIndex(n => n.id === id);
            if (idx >= 0) { list[idx].read = true; set(KEYS.notifications, list); }
        },
        markAllRead(userId) {
            const list = get(KEYS.notifications).map(n => n.userId === userId ? { ...n, read: true } : n);
            set(KEYS.notifications, list);
        }
    };

    /* ===================== MESSAGES ===================== */
    const Messages = {
        getConversations(userId) {
            const msgs = get(KEYS.messages).filter(m => m.fromId === userId || m.toId === userId);
            const partners = [...new Set(msgs.map(m => m.fromId === userId ? m.toId : m.fromId))];
            const users = get(KEYS.users);
            return partners.map(pid => {
                const partner = users.find(u => u.id === pid);
                const thread = msgs.filter(m => m.fromId === pid || m.toId === pid).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
                return { partner, lastMessage: thread[0], unread: thread.filter(m => m.toId === userId && !m.read).length };
            });
        },
        getThread(userId, partnerId) {
            return get(KEYS.messages).filter(m => (m.fromId === userId && m.toId === partnerId) || (m.fromId === partnerId && m.toId === userId)).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        },
        send(fromId, toId, text) {
            const list = get(KEYS.messages);
            const msg = { id: uid(), fromId, toId, text, timestamp: now(), read: false };
            list.push(msg);
            set(KEYS.messages, list);
            Notifications.create(toId, 'message', `New message from someone`);
            return msg;
        },
        markRead(fromId, toId) {
            const list = get(KEYS.messages).map(m => m.fromId === fromId && m.toId === toId ? { ...m, read: true } : m);
            set(KEYS.messages, list);
        }
    };

    /* ===================== HELPERS ===================== */
    const Helpers = {
        getUser: (id) => getOne(KEYS.users, id),
        formatDate(iso) {
            if (!iso) return '';
            const d = new Date(iso);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        },
        formatDateTime(iso) {
            if (!iso) return '';
            const d = new Date(iso);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' at ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        },
        timeAgo(iso) {
            if (!iso) return '';
            const diff = Date.now() - new Date(iso).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return 'just now';
            if (mins < 60) return `${mins}m ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs}h ago`;
            const days = Math.floor(hrs / 24);
            return `${days}d ago`;
        },
        dueDateStatus(iso) {
            if (!iso) return { label: '', cls: '' };
            const diff = new Date(iso).getTime() - Date.now();
            const days = Math.ceil(diff / (1000 * 3600 * 24));
            if (days < 0) return { label: `Overdue by ${Math.abs(days)}d`, cls: 'overdue' };
            if (days === 0) return { label: 'Due today', cls: 'soon' };
            if (days <= 2) return { label: `Due in ${days}d`, cls: 'soon' };
            return { label: `Due ${Helpers.formatDate(iso)}`, cls: 'ok' };
        },
        getInitials: (name) => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??',
        gradeClass(score, total) {
            const pct = total > 0 ? (score / total) * 100 : 0;
            if (pct >= 75) return 'high';
            if (pct >= 50) return 'medium';
            return 'low';
        }
    };

    // Initialize
    seed();

    return { Auth, Classes, Announcements, Assignments, Submissions, Materials, Notifications, Messages, Helpers, uid, now };
})();
