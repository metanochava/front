import { labelOf as label, joinLabels as join } from 'src/components/record/viewRoutes'

// The academica records' pages (view_<model>, components/record/RecordViewPage):
// per model, the header (title, subtitle, icon) and the tabs after "Details" -
// the related models' records that point at it (model + the field of that
// model, fk). A tab shows only with list_<model>.

const tab = (name, label, icon, model, fk) => ({ name, label, icon, model, fk })

export const academicaViews = {
  Student: { label: 'Student',
    icon: null,
    title: (r) => label(r.person),
    subtitle: (r) => r.number,
    defaultTab: 'personal',
    tabs: [
      { name: 'personal', label: 'Personal', icon: 'person', person: 'person', permission: 'view_person' },
      tab('guardians', 'Guardians', 'family_restroom', 'Guardian', 'student'),
      tab('enrolments', 'Enrolments', 'how_to_reg', 'Enrolment', 'student')
    ]
  },
  Guardian: { label: 'Guardian', icon: 'family_restroom', title: (r) => label(r.person), subtitle: (r) => join(r.student, r.relationship) },
  Enrolment: { label: 'Enrolment',
    icon: 'how_to_reg',
    title: (r) => label(r.student),
    subtitle: (r) => join(r.academic_year, r.grade_level, r.class_group),
    tabs: [
      tab('grades', 'Grades', 'grading', 'Grade', 'enrolment'),
      tab('attendance', 'Attendance', 'fact_check', 'StudentAttendance', 'enrolment'),
      tab('tuition', 'Tuition', 'payments', 'TuitionCharge', 'enrolment'),
      { name: 'history', label: 'History', icon: 'history', action: 'history', permission: 'view_enrolment',
        columns: [{ name: 'created_at', label: 'Date', date: true }, { name: 'from_status', label: 'From' },
          { name: 'to_status', label: 'To' }, { name: 'reason', label: 'Reason' }, { name: 'created_by', label: 'By' }] }
    ]
  },
  ClassGroup: { label: 'Class',
    icon: 'groups',
    title: (r) => r.name,
    subtitle: (r) => join(r.academic_year, r.grade_level, r.shift),
    tabs: [
      tab('enrolments', 'Students', 'how_to_reg', 'Enrolment', 'class_group'),
      tab('teaching', 'Teaching assignments', 'co_present', 'TeachingAssignment', 'class_group'),
      tab('assessments', 'Assessments', 'assignment', 'Assessment', 'class_group')
    ]
  },
  AcademicYear: { label: 'Academic year',
    icon: 'event',
    title: (r) => r.name,
    subtitle: (r) => [r.start_date, r.end_date].filter(Boolean).join(' – '),
    tabs: [
      tab('periods', 'Academic periods', 'date_range', 'AcademicPeriod', 'academic_year'),
      tab('classes', 'Classes', 'groups', 'ClassGroup', 'academic_year'),
      tab('enrolments', 'Enrolments', 'how_to_reg', 'Enrolment', 'academic_year')
    ]
  },
  AcademicPeriod: { label: 'Academic period',
    icon: 'date_range',
    title: (r) => r.name,
    subtitle: (r) => label(r.academic_year),
    tabs: [
      tab('assessments', 'Assessments', 'assignment', 'Assessment', 'period'),
      tab('teaching', 'Teaching assignments', 'co_present', 'TeachingAssignment', 'period')
    ]
  },
  GradingScale: { label: 'Grading scale',
    icon: 'grade',
    title: (r) => r.name,
    tabs: [tab('levels', 'Education levels', 'stairs', 'EducationLevel', 'grading_scale')]
  },
  EducationLevel: { label: 'Education level',
    icon: 'stairs',
    title: (r) => r.name,
    subtitle: (r) => r.code,
    tabs: [tab('programmes', 'Programmes', 'menu_book', 'Programme', 'level')]
  },
  Programme: { label: 'Programme',
    icon: 'menu_book',
    title: (r) => r.name,
    subtitle: (r) => join(r.code, r.level),
    tabs: [
      tab('grades', 'Grade levels', 'format_list_numbered', 'GradeLevel', 'programme'),
      tab('enrolments', 'Enrolments', 'how_to_reg', 'Enrolment', 'programme'),
      tab('tuition', 'Tuition rules', 'rule', 'TuitionRule', 'programme')
    ]
  },
  GradeLevel: { label: 'Grade level',
    icon: 'format_list_numbered',
    title: (r) => r.name,
    subtitle: (r) => label(r.programme),
    tabs: [
      tab('curriculum', 'Curriculum', 'checklist', 'CurriculumItem', 'grade_level'),
      tab('classes', 'Classes', 'groups', 'ClassGroup', 'grade_level'),
      tab('enrolments', 'Enrolments', 'how_to_reg', 'Enrolment', 'grade_level'),
      tab('tuition', 'Tuition rules', 'rule', 'TuitionRule', 'grade_level')
    ]
  },
  Subject: { label: 'Subject',
    icon: 'subject',
    title: (r) => r.name,
    subtitle: (r) => r.code,
    tabs: [
      tab('curriculum', 'Curriculum', 'checklist', 'CurriculumItem', 'subject'),
      tab('teaching', 'Teaching assignments', 'co_present', 'TeachingAssignment', 'subject'),
      tab('assessments', 'Assessments', 'assignment', 'Assessment', 'subject'),
      tab('attendance', 'Attendance', 'fact_check', 'StudentAttendance', 'subject')
    ]
  },
  CurriculumItem: { label: 'Curriculum', icon: 'checklist', title: (r) => join(r.grade_level, r.subject) },
  TeachingAssignment: { label: 'Teaching assignment', icon: 'co_present', title: (r) => label(r.teacher), subtitle: (r) => join(r.class_group, r.subject) },
  Assessment: { label: 'Assessment',
    icon: 'assignment',
    title: (r) => r.name,
    subtitle: (r) => join(r.class_group, r.subject, r.period),
    tabs: [tab('grades', 'Grades', 'grading', 'Grade', 'assessment')]
  },
  Grade: { label: 'Grade',
    icon: 'grading',
    title: (r) => label(r.enrolment),
    subtitle: (r) => label(r.assessment),
    statusField: null,
    tabs: [{ name: 'history', label: 'History', icon: 'history', action: 'history', permission: 'view_grade',
      columns: [{ name: 'created_at', label: 'Date', date: true }, { name: 'previous_value', label: 'Previous value' },
        { name: 'new_value', label: 'New value' }, { name: 'reason', label: 'Reason' }, { name: 'created_by', label: 'By' }] }]
  },
  StudentAttendance: { label: 'Attendance', icon: 'fact_check', title: (r) => label(r.enrolment), subtitle: (r) => join(r.date, r.subject) },
  TuitionRule: { label: 'Tuition rule', icon: 'rule', title: (r) => label(r.kind), subtitle: (r) => join(r.programme, r.grade_level) },
  TuitionCharge: { label: 'Tuition charge', icon: 'receipt_long', title: (r) => label(r.enrolment), subtitle: (r) => join(r.kind, r.month) }
}
