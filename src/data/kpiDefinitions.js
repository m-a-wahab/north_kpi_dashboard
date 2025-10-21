// KPI Definitions with Input Fields and Formulas
// This file defines the structure of each KPI including its input fields and calculation formula

export const kpiDefinitions = [
  {
    groupId: 1,
    groupName: 'المجموعة الأولى: خاصة بالإيرادات الكلية للأمانة',
    groupDescription: 'مؤشرات الإيرادات المفوترة والمحصلة',
    groupIcon: '💰',
    groupColor: '#005353',
    kpis: [
      {
        id: 1,
        name: 'نسبة تحقيق الإيرادات المفوترة',
        definition: 'نسبة تحقيق الإيرادات الإجمالية المفوترة إلى المستهدف المالي للعام الحالي (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة الإيرادات المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      },
      {
        id: 2,
        name: 'نسبة تطور الإيرادات المفوترة',
        definition: 'نسبة تحقيق الإيرادات الإجمالية المفوترة إلى الإيرادات المفوترة لنفس فترة القياس في العام السابق (زيادة او نقصان)',
        unit: '%',
        inputs: [
          {
            id: 'current_year',
            name: 'جملة الإيرادات المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'previous_year',
            name: 'جملة الإيرادات المحققة (المفوترة) خلال يناير 2024م',
            unit: 'ريال'
          }
        ],
        formula: (current, previous) => previous !== 0 ? (current / previous) * 100 : null
      },
      {
        id: 3,
        name: 'معدل نمو الايرادات المفوترة',
        definition: 'قياس معدل النمو في الإيرادات الإجمالية المفوترة الحالية إلى الإيرادات المفوترة لنفس فترة القياس في العام السابق (زيادة او نقصان)',
        unit: '%',
        inputs: [
          {
            id: 'current_year',
            name: 'جملة الإيرادات المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'previous_year',
            name: 'جملة الإيرادات المحققة (المفوترة) خلال يناير 2024م',
            unit: 'ريال'
          }
        ],
        formula: (current, previous) => previous !== 0 ? ((current - previous) / previous) * 100 : null
      },
      {
        id: 4,
        name: 'نسبة تحقيق الإيرادات المحصلة',
        definition: 'نسبة تحقيق الإيرادات الإجمالية المحصلة إلى المستهدف المالي للعام الحالي (المحصلة)',
        unit: '%',
        inputs: [
          {
            id: 'collected',
            name: 'جملة الإيرادات المحققة (المحصلة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات المستهدفة (المحصلة) من الوزارة يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (collected, target) => target !== 0 ? (collected / target) * 100 : null
      },
      {
        id: 5,
        name: 'نسبة تطور الإيرادات المحصلة',
        definition: 'نسبة تحقيق الإيرادات الإجمالية المحصلة إلى الإيرادات المحصلة لنفس فترة القياس في العام السابق (زيادة او نقصان)',
        unit: '%',
        inputs: [
          {
            id: 'current_year',
            name: 'جملة الإيرادات المحققة (المحصلة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'previous_year',
            name: 'جملة الإيرادات المحققة (المحصلة) خلال يناير 2024م',
            unit: 'ريال'
          }
        ],
        formula: (current, previous) => previous !== 0 ? (current / previous) * 100 : null
      },
      {
        id: 6,
        name: 'معدل نمو الإيرادات المحصلة',
        definition: 'قياس معدل النمو في الإيرادات الإجمالية المحصلة الحالية إلى الإيرادات المحصلة لنفس فترة القياس في العام السابق (زيادة او نقصان)',
        unit: '%',
        inputs: [
          {
            id: 'current_year',
            name: 'جملة الإيرادات المحققة (المحصلة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'previous_year',
            name: 'جملة الإيرادات المحققة (المحصلة) خلال يناير 2024م',
            unit: 'ريال'
          }
        ],
        formula: (current, previous) => previous !== 0 ? ((current - previous) / previous) * 100 : null
      },
      {
        id: 7,
        name: 'نسبة تحقيق إيرادات استثمار العقارات البلدية المفوترة',
        definition: 'نسبة تحقيق إيرادات استثمار العقارات البلدية المفوترة إلى المستهدف المالي للعام الحالي لنفس الإيرادات (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة إيرادات استثمار العقارات البلدية المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات استثمار العقارات البلدية المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      },
      {
        id: 8,
        name: 'نسبة تحقيق إيرادات الجزاءات والغرامات',
        definition: 'نسبة تحقيق إيرادات الجزاءات والغرامات المفوترة إلى المستهدف المالي للعام الحالي لنفس الإيرادات (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة إيرادات الجزاءات والغرامات المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات الجزاءات والغرامات المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      },
      {
        id: 9,
        name: 'نسبة تحقيق إيرادات الرسوم والمقابلات المالية',
        definition: 'نسبة تحقيق إيرادات الرسوم والمقابلات المالية المفوترة إلى المستهدف المالي للعام الحالي لنفس الإيرادات (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة إيرادات الرسوم والمقابلات المالية المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات الرسوم والمقابلات المالية المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      },
      {
        id: 10,
        name: 'نسبة تحقيق إيرادات مرافق الايواء',
        definition: 'نسبة تحقيق إيرادات رسوم مرافق الإيواء المفوترة إلى المستهدف المالي للعام الحالي لنفس الإيرادات (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة إيرادات رسوم مرافق الإيواء المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات رسوم مرافق الإيواء المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      },
      {
        id: 11,
        name: 'نسبة تحقيق إيرادات منتجات التبغ',
        definition: 'نسبة تحقيق إيرادات رسوم منتجات التبغ المفوترة إلى المستهدف المالي للعام الحالي لنفس الإيرادات (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة إيرادات رسوم منتجات التبغ المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات رسوم منتجات التبغ المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      },
      {
        id: 12,
        name: 'نسبة تحقيق إيرادات الايرادات المختلفة',
        definition: 'نسبة تحقيق الإيرادات المختلفة المفوترة إلى المستهدف المالي للعام الحالي لنفس الإيرادات (المفوترة)',
        unit: '%',
        inputs: [
          {
            id: 'achieved',
            name: 'جملة الإيرادات المختلفة المحققة (المفوترة) خلال يناير 2025م',
            unit: 'ريال'
          },
          {
            id: 'target',
            name: 'جملة الإيرادات المختلفة المستهدفة (المفوترة) من الوزارة خلال يناير 2025م',
            unit: 'ريال'
          }
        ],
        formula: (achieved, target) => target !== 0 ? (achieved / target) * 100 : null
      }
    ]
  },
  {
    groupId: 2,
    groupName: 'المجموعة الثانية: خاصة بوكالة الاستثمار والاستدامة المالية',
    groupDescription: 'مؤشرات الاستثمار والعقود والشراكات',
    groupIcon: '💼',
    groupColor: '#006b6b',
    kpis: [
      {
        id: 1,
        name: 'مؤشر نسبة التعاقد',
        definition: 'نسبة العقود السارية إلى اجمالى العقود الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'active_contracts',
            name: 'عدد العقود السارية خلال فترة القياس',
            unit: 'عقد'
          },
          {
            id: 'total_contracts',
            name: 'اجمالى العقود الاستثمارية',
            unit: 'عقد'
          }
        ],
        formula: (active, total) => total !== 0 ? (active / total) * 100 : null
      },
      {
        id: 2,
        name: 'مؤشر العقود المنتهية',
        definition: 'نسبة العقود المنتهية إلى اجمالى العقود الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'expired_contracts',
            name: 'عدد العقود المنتهية خلال فترة القياس',
            unit: 'عقد'
          },
          {
            id: 'total_contracts',
            name: 'اجمالى العقود الاستثمارية',
            unit: 'عقد'
          }
        ],
        formula: (expired, total) => total !== 0 ? (expired / total) * 100 : null
      },
      {
        id: 3,
        name: 'العقود المؤتمتة',
        definition: 'نسبة العقود التي تم أتمتتها إلى اجمالى العقود الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'automated_contracts',
            name: 'عدد العقود التي تم أتمتتها خلال فترة القياس',
            unit: 'عقد'
          },
          {
            id: 'total_contracts',
            name: 'اجمالى العقود الاستثمارية',
            unit: 'عقد'
          }
        ],
        formula: (automated, total) => total !== 0 ? (automated / total) * 100 : null
      },
      {
        id: 4,
        name: 'فعالية استغلال المواقع الاستثمارية',
        definition: 'فعالية استغلال المواقع الاستثمارية من حيث نسبة العقارات البلدية المؤجرة إلى إجمالي العقارات المتاحة للاستثمار بمدينة عرعر',
        unit: '%',
        inputs: [
          {
            id: 'occupied_sites',
            name: 'عدد المواقع الاستثمارية المشغولة (المؤجرة) خلال فترة القياس',
            unit: 'موقع'
          },
          {
            id: 'total_sites',
            name: 'جملة عدد المواقع الاستثمارية بمدينة عرعر خلال نفس الفترة',
            unit: 'موقع'
          }
        ],
        formula: (occupied, total) => total !== 0 ? (occupied / total) * 100 : null
      },
      {
        id: 5,
        name: 'امكانية استغلال المواقع الاستثمارية',
        definition: 'إمكانية استغلال المواقع الاستثمارية من حيث نسبة العقارات البلدية غير المؤجرة إلى إجمالي العقارات المتاحة للاستثمار بمدينة عرعر',
        unit: '%',
        inputs: [
          {
            id: 'vacant_sites',
            name: 'عدد المواقع الاستثمارية الغير مشغولة (المؤجرة) خلال فترة القياس',
            unit: 'موقع'
          },
          {
            id: 'total_sites',
            name: 'جملة عدد المواقع الاستثمارية بمدينة عرعر خلال نفس الفترة',
            unit: 'موقع'
          }
        ],
        formula: (vacant, total) => total !== 0 ? (vacant / total) * 100 : null
      },
      {
        id: 6,
        name: 'نسبة طرح الفرص الاستثمارية',
        definition: 'نسبة طرح الفرص الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'offered_opportunities',
            name: 'عدد الفرص المطروحة خلال فترة محددة',
            unit: 'فرصة'
          },
          {
            id: 'total_opportunities',
            name: 'جملة عدد الفرص بالخطة الاستثمارية بمدينة عرعر خلال العام',
            unit: 'فرصة'
          }
        ],
        formula: (offered, total) => total !== 0 ? (offered / total) * 100 : null
      },
      {
        id: 7,
        name: 'نسبة ترسية الفرص الاستثمارية',
        definition: 'نسبة ترسية الفرص الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'awarded_opportunities',
            name: 'عدد الفرص التي تم ترسيتها خلال فترة محددة',
            unit: 'فرصة'
          },
          {
            id: 'offered_opportunities',
            name: 'جملة عدد الفرص التي تم طرحها خلال نفس الفترة',
            unit: 'فرصة'
          }
        ],
        formula: (awarded, offered) => offered !== 0 ? (awarded / offered) * 100 : null
      },
      {
        id: 8,
        name: 'مساهمة الفرص الجديدة في تحقيق عائد الاستثمار',
        definition: 'مساهمة الفرص الجديدة في تحقيق عائد الاستثمار',
        unit: '%',
        inputs: [
          {
            id: 'new_opportunities_revenue',
            name: 'جملة إيرادات الفرص الاستثمارية الجديدة خلال فترة محددة',
            unit: 'ريال'
          },
          {
            id: 'target_revenue',
            name: 'جملة إيرادات الاستثمار المستهدفة من قبل الوزارة خلال نفس الفترة',
            unit: 'ريال'
          }
        ],
        formula: (newRevenue, target) => target !== 0 ? (newRevenue / target) * 100 : null
      },
      {
        id: 9,
        name: 'تصنيف الفرص التي يتم ترسيتها',
        definition: 'تصنيف الفرص التي يتم ترسيتها',
        unit: '%',
        inputs: [
          {
            id: 'classified_opportunities',
            name: 'تصنيف الفرص التي تم ترسيتها وفق النشاط خلال فترة محددة (فترة الطرح)',
            unit: 'فرصة'
          },
          {
            id: 'total_offered',
            name: 'جملة عدد الفرص التي تم طرحها خلال نفس الفترة',
            unit: 'فرصة'
          }
        ],
        formula: (classified, total) => total !== 0 ? (classified / total) * 100 : null
      },
      {
        id: 10,
        name: 'نسبة الزيارات الميدانية للمواقع الإستثمارية',
        definition: 'نسبة الزيارات الميدانية للمواقع الإستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'completed_visits',
            name: 'جملة الزيارات الميدانية المحققة خلال فترة محددة',
            unit: 'زيارة'
          },
          {
            id: 'required_visits',
            name: 'جملة الزيارات الميدانية المطلوب زياراتها للمواقع الاستثمارية خلال نفس الفترة',
            unit: 'زيارة'
          }
        ],
        formula: (completed, required) => required !== 0 ? (completed / required) * 100 : null
      },
      {
        id: 11,
        name: 'نسبة المخالفات للمشاريع الاستثمارية',
        definition: 'نسبة المخالفات للمشاريع الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'investment_violations',
            name: 'جملة عدد مخالفات المشاريع الاستثمارية خلال فترة محددة',
            unit: 'مخالفة'
          },
          {
            id: 'total_violations',
            name: 'جملة المخالفات المسجلة بالأمانة لجميع المشاريع خلال نفس الفترة',
            unit: 'مخالفة'
          }
        ],
        formula: (investment, total) => total !== 0 ? (investment / total) * 100 : null
      },
      {
        id: 12,
        name: 'مؤشرات أداء للخطط التسويقية والإعلانية',
        definition: 'مؤشرات أداء للخطط التسويقية والإعلانية',
        unit: '%',
        inputs: [
          {
            id: 'executed_plans',
            name: 'جملة ما تم تنفيذه من الخطط ووسائل التسويق وإعلام المستثمرين خلال فترة محددة',
            unit: 'خطة'
          },
          {
            id: 'total_plans',
            name: 'جملة الخطط ووسائل التسويق وإعلام المستثمرين خلال نفس الفترة',
            unit: 'خطة'
          }
        ],
        formula: (executed, total) => total !== 0 ? (executed / total) * 100 : null
      },
      {
        id: 13,
        name: 'معدل نمو الشراكات والاتفاقيات الخاصة',
        definition: 'معدل نمو الشراكات والاتفاقيات الخاصة',
        unit: '%',
        inputs: [
          {
            id: 'current_partnerships',
            name: 'عدد الشراكات والاتفاقيات الخاصة خلال فترة الحالية',
            unit: 'شراكة'
          },
          {
            id: 'previous_partnerships',
            name: 'عدد الشراكات والاتفاقيات الخاصة  خلال الفترة السابقة',
            unit: 'شراكة'
          }
        ],
        formula: (current, previous) => previous !== 0 ? ((current - previous) / previous) * 100 : null
      },
      {
        id: 14,
        name: 'نسبة المشروعات التي تم اعداد دراسة جدوى لها',
        definition: 'نسبة المشروعات التي تم اعداد دراسة جدوى لها',
        unit: '%',
        inputs: [
          {
            id: 'completed_studies',
            name: 'عدد المشاريع التي تم اعداد دراسات جدوى خلال فترة القياس',
            unit: 'مشروع'
          },
          {
            id: 'total_projects',
            name: 'اجمالى عدد المشاريع المطلوب اعداد دراسات جدوى لها',
            unit: 'مشروع'
          }
        ],
        formula: (completed, total) => total !== 0 ? (completed / total) * 100 : null
      },
      {
        id: 15,
        name: 'نسبة انجاز  التقييم العقاري',
        definition: 'نسبة انجاز  التقييم العقاري',
        unit: '%',
        inputs: [
          {
            id: 'completed_evaluations',
            name: 'عدد عمليات التقييم المنجزة خلال فترة القياس',
            unit: 'عملية'
          },
          {
            id: 'total_evaluations',
            name: 'اجمالى عدد طلبات التقييم المطلوبة خلال فترة القياس',
            unit: 'عملية'
          }
        ],
        formula: (completed, total) => total !== 0 ? (completed / total) * 100 : null
      },
      {
        id: 16,
        name: 'نسبة نمو الايرادات من التقييم العقاري',
        definition: 'نسبة نمو الايرادات من التقييم العقاري',
        unit: '%',
        inputs: [
          {
            id: 'revenue_after',
            name: 'اجمالي ايرادات المواقع بعد التقييم',
            unit: 'ريال'
          },
          {
            id: 'revenue_before',
            name: 'اجمالي ايرادات المواقع قبل التقييم',
            unit: 'ريال'
          }
        ],
        formula: (after, before) => before !== 0 ? ((after - before) / before) * 100 : null
      },
      {
        id: 17,
        name: 'نسبة الارشفة على قاعدة البيانات',
        definition: 'نسبة الارشفة على قاعدة البيانات',
        unit: '%',
        inputs: [
          {
            id: 'archived_files',
            name: 'عدد الملفات التى تم ارشفتها خلال فترة القياس',
            unit: 'ملف'
          },
          {
            id: 'total_files',
            name: 'اجمالى عدد الملفات المطلوب ارشفتها',
            unit: 'ملف'
          }
        ],
        formula: (archived, total) => total !== 0 ? (archived / total) * 100 : null
      },
      {
        id: 18,
        name: 'نسبة انجاز قاعدة البيانات',
        definition: 'نسبة انجاز قاعدة البيانات',
        unit: '%',
        inputs: [
          {
            id: 'linked_sites',
            name: 'عدد المواقع التى تم ربطها بقاعدة البيانات ( الجيومكانية ) خلال فترة القياس',
            unit: 'موقع'
          },
          {
            id: 'total_sites',
            name: 'اجمالى عدد المواقع المطلوب ربطها بقاعدة البيانات ( الجيومكانية )',
            unit: 'موقع'
          }
        ],
        formula: (linked, total) => total !== 0 ? (linked / total) * 100 : null
      },
      {
        id: 19,
        name: 'نسبة اعتماد مواقع استثمارية جديدة',
        definition: 'نسبة اعتماد مواقع استثمارية جديدة',
        unit: '%',
        inputs: [
          {
            id: 'approved_sites',
            name: 'عدد المواقع الاستثمارية المعتمدة الجديدة',
            unit: 'موقع'
          },
          {
            id: 'total_new_sites',
            name: 'اجمالى عدد المواقع الاستثمارية الجديدة قبل الاعتماد',
            unit: 'موقع'
          }
        ],
        formula: (approved, total) => total !== 0 ? (approved / total) * 100 : null
      },
      {
        id: 20,
        name: 'نسبة ربط العقود الاستثمارية',
        definition: 'نسبة ربط العقود الاستثمارية',
        unit: '%',
        inputs: [
          {
            id: 'linked_contracts',
            name: 'عدد العقود الاستثمارية اللى تم ربطها بقاعدة البيانات خلال فترة القياس',
            unit: 'عقد'
          },
          {
            id: 'total_contracts',
            name: 'اجمالى العقود الاستثمارية المطلوبة ربطها',
            unit: 'عقد'
          }
        ],
        formula: (linked, total) => total !== 0 ? (linked / total) * 100 : null
      },
      {
        id: 21,
        name: 'مؤشر عدد كروكيات التخصيص المساحية المعتمدة',
        definition: 'مؤشر عدد كروكيات التخصيص المساحية المعتمدة',
        unit: '%',
        inputs: [
          {
            id: 'approved_sketches',
            name: 'عدد الكروكيات الى تم اعتمادها خلال فترة القياس',
            unit: 'كروكي'
          },
          {
            id: 'total_vacant_sites',
            name: 'اجمالى  عدد المواقع الاستثمارية الغير مشغولة (غير مؤجرة)',
            unit: 'موقع'
          }
        ],
        formula: (approved, total) => total !== 0 ? (approved / total) * 100 : null
      },
      {
        id: 22,
        name: 'مؤشر رضاء العملاء عن وكالة الاستثمار والاستدامة المالية',
        definition: 'مؤشر رضاء العملاء عن وكالة الاستثمار والاستدامة المالية',
        unit: '%',
        inputs: [
          {
            id: 'satisfied',
            name: 'راضي',
            unit: 'عميل'
          },
          {
            id: 'unsatisfied',
            name: 'غير راضي',
            unit: 'عميل'
          }
        ],
        formula: (satisfied, unsatisfied) => {
          const total = satisfied + unsatisfied
          return total !== 0 ? (satisfied / total) * 100 : null
        }
      }
    ]
  },
  {
    groupId: 3,
    groupName: 'المجموعة الثالثة: خاصة بتحصيل الإيرادات',
    groupDescription: 'مؤشرات تحصيل الإيرادات والمديونيات',
    groupIcon: '💵',
    groupColor: '#008080',
    kpis: [
      {
        id: 1,
        name: 'نسبة تحصيل المديونيات المتراكمة',
        definition: 'نسبة تحصيل المديونيات المتراكمة من أعوام سابقة',
        unit: '%',
        inputs: [
          {
            id: 'collected_revenue',
            name: 'جملة الإيرادات المحصلة خلال يناير 2025',
            unit: 'ريال'
          },
          {
            id: 'accumulated_debt',
            name: 'جملة مديونيات التحصيل المتراكمة خلال الأعوام السابقة',
            unit: 'ريال'
          }
        ],
        formula: (collected, debt) => debt !== 0 ? (collected / debt) * 100 : null
      },
      {
        id: 2,
        name: 'نسبة تحصيل الإيرادات من الايرادات المفوترة',
        definition: 'نسبة تحصيل الإيرادات من الايرادات المفوترة',
        unit: '%',
        inputs: [
          {
            id: 'collected_revenue',
            name: 'جملة الإيرادات المحصلة خلال يناير 2025',
            unit: 'ريال'
          },
          {
            id: 'invoiced_revenue',
            name: 'جملة الإيرادات الكلية المحققة (المفوترة) خلال يناير 2025',
            unit: 'ريال'
          }
        ],
        formula: (collected, invoiced) => invoiced !== 0 ? (collected / invoiced) * 100 : null
      },
      {
        id: 3,
        name: 'نسبة السداد للمطالبات الصادرة خلال فترة السماح',
        definition: 'نسبة السداد للمطالبات الصادرة خلال فترة السماح',
        unit: '%',
        inputs: [
          {
            id: 'paid_claims',
            name: 'جملة المطالبات المسددة خلال فترة محددة',
            unit: 'مطالبة'
          },
          {
            id: 'total_claims',
            name: 'جملة المطالبات المطلوب سدادها خلال نفس الفترة',
            unit: 'مطالبة'
          }
        ],
        formula: (paid, total) => total !== 0 ? (paid / total) * 100 : null
      }
    ]
  },
  {
    groupId: 4,
    groupName: 'المجموعة الرابعة: خاصة بالخصخصة',
    groupDescription: 'مؤشرات الخصخصة والشراكة مع القطاع الخاص',
    groupIcon: '🤝',
    groupColor: '#009999',
    kpis: [
      {
        id: 1,
        name: 'نسبة تحقيق مؤشر الخصخصة المستهدف',
        definition: 'نسبة تحقيق مؤشر الخصخصة المستهدف',
        unit: '%',
        inputs: [
          {
            id: 'privatized_services',
            name: 'عدد الخدمات التي تم خصخصتها خلال فترة محددة',
            unit: 'خدمة'
          },
          {
            id: 'target_services',
            name: 'جملة عدد خدمات الخصخصة المستهدفة من قبل الوزارة',
            unit: 'خدمة'
          }
        ],
        formula: (privatized, target) => target !== 0 ? (privatized / target) * 100 : null
      },
      {
        id: 2,
        name: 'نسبة خدمات الخصخصة  المطروحة ولم يتقدم عليها أحد',
        definition: 'نسبة خدمات الخصخصة  المطروحة ولم يتقدم عليها أحد',
        unit: '%',
        inputs: [
          {
            id: 'no_applicants',
            name: 'عدد خدمات الخصخصة  التي تم طرحها ولم يتقدم عليها أحد',
            unit: 'خدمة'
          },
          {
            id: 'total_offered',
            name: 'اجمالى عدد خدمات الخصخصة المطروحه خلال فترة القياس',
            unit: 'خدمة'
          }
        ],
        formula: (noApplicants, total) => total !== 0 ? (noApplicants / total) * 100 : null
      },
      {
        id: 3,
        name: 'نسبة خدمات الخصخصة المطروحة وتم توقيع عقودها',
        definition: 'نسبة خدمات الخصخصة المطروحة وتم توقيع عقودها',
        unit: '%',
        inputs: [
          {
            id: 'signed_contracts',
            name: 'عدد خدمات الخصخصة المطروحة وتم توقيع عقودها',
            unit: 'خدمة'
          },
          {
            id: 'total_offered',
            name: 'اجمالى عدد خدمات الخصخصة المطروحه خلال فترة القياس',
            unit: 'خدمة'
          }
        ],
        formula: (signed, total) => total !== 0 ? (signed / total) * 100 : null
      },
      {
        id: 4,
        name: 'نسبة مشروعات استثمار الحدائق من الخطة المقترحة',
        definition: 'نسبة مشروعات استثمار الحدائق من الخطة المقترحة',
        unit: '%',
        inputs: [
          {
            id: 'invested_parks',
            name: 'عدد الحدائق التي تم استثمارها خلال فترة محددة',
            unit: 'حديقة'
          },
          {
            id: 'target_parks',
            name: 'جملة عدد الحدائق المستهدفة من قبل الأمانة خلال عام 2025م',
            unit: 'حديقة'
          }
        ],
        formula: (invested, target) => target !== 0 ? (invested / target) * 100 : null
      },
      {
        id: 5,
        name: 'نسبة مساهمة الخصخصة في ترشيد النفقات التشغيلية',
        definition: 'نسبة مساهمة الخصخصة في ترشيد النفقات التشغيلية',
        unit: '%',
        inputs: [
          {
            id: 'saved_expenses',
            name: 'جملة النفقات التشغيلية التي تم توفيرها خلال فترة محددة',
            unit: 'ريال'
          },
          {
            id: 'total_expenses',
            name: 'جملة النفقات التشغيلية التي تصرفها الأمانة على خدمات الخصخصة خلال فترة محددة',
            unit: 'ريال'
          }
        ],
        formula: (saved, total) => total !== 0 ? (saved / total) * 100 : null
      },
      {
        id: 6,
        name: 'نسبة مساهمة إيرادات الخصخصة في الايرادات الكلية المفوترة',
        definition: 'نسبة مساهمة إيرادات الخصخصة في الايرادات الكلية المفوترة',
        unit: '%',
        inputs: [
          {
            id: 'privatization_revenue',
            name: 'جملة إيرادات الخصخصة التي تم تحقيقها خلال فترة محددة',
            unit: 'ريال'
          },
          {
            id: 'total_invoiced_revenue',
            name: 'جملة الإيرادات الكلية المفوترة المستهدفة خلال عام 2025م',
            unit: 'ريال'
          }
        ],
        formula: (privatization, total) => total !== 0 ? (privatization / total) * 100 : null
      }
    ]
  },
  {
    groupId: 5,
    groupName: 'المجموعةالخامسة : خاصة بإنجاز المعاملات ذات العلاقة',
    groupDescription: 'مؤشرات إنجاز المعاملات والتحول الرقمي',
    groupIcon: '📋',
    groupColor: '#00b3b3',
    kpis: [
      {
        id: 1,
        name: 'نسبة المعاملات المعالجة في الوقت المحدد',
        definition: 'نسبة المعاملات المعالجة في الوقت المحدد',
        unit: '%',
        inputs: [
          {
            id: 'processed_transactions',
            name: 'جملة عدد المعاملات التي تم معالجتها خلال فترة محددة',
            unit: 'معاملة'
          },
          {
            id: 'total_transactions',
            name: 'جملة المعاملات المطلوب انجازها خلال نفس الفترة',
            unit: 'معاملة'
          }
        ],
        formula: (processed, total) => total !== 0 ? (processed / total) * 100 : null
      },
      {
        id: 2,
        name: 'نسبة المعاملات الغير منجزة في الوقت المحدد',
        definition: 'نسبة المعاملات الغير منجزة في الوقت المحدد',
        unit: '%',
        inputs: [
          {
            id: 'unfinished_transactions',
            name: 'جملة عدد المعاملات الغير منجزة خلال فترة محددة',
            unit: 'معاملة'
          },
          {
            id: 'total_transactions',
            name: 'جملة المعاملات المطلوب انجازها خلال نفس الفترة',
            unit: 'معاملة'
          }
        ],
        formula: (unfinished, total) => total !== 0 ? (unfinished / total) * 100 : null
      },
      {
        id: 3,
        name: 'متوسط زمن دراسة ومعالجة المعاملات المنجزة',
        definition: 'متوسط زمن دراسة ومعالجة المعاملات المنجزة',
        unit: 'يوم',
        inputs: [
          {
            id: 'completed_transactions',
            name: 'عدد المعاملات المنجزة خلال فترة محددة',
            unit: 'معاملة'
          },
          {
            id: 'total_days',
            name: 'عدد الأيام المستغرقة لإنجاز المعاملات خلال نفس الفترة',
            unit: 'يوم'
          }
        ],
        formula: (transactions, days) => transactions !== 0 ? days / transactions : null
      },
      {
        id: 4,
        name: 'نسبة المعاملات الموجه داخليا / خارجيا',
        definition: 'نسبة المعاملات الموجه داخليا / خارجيا',
        unit: '%',
        inputs: [
          {
            id: 'internal_external_transactions',
            name: 'نسبة المعاملات الموجه داخليا وخارجيا',
            unit: 'معاملة'
          },
          {
            id: 'total_completed',
            name: 'إجمالى المعاملات المنجزة بالوكالة',
            unit: 'معاملة'
          }
        ],
        formula: (internalExternal, total) => total !== 0 ? (internalExternal / total) * 100 : null
      },
      {
        id: 5,
        name: 'نسبة المعاملات الموجه داخليا',
        definition: 'نسبة المعاملات الموجه داخليا',
        unit: '%',
        inputs: [
          {
            id: 'internal_transactions',
            name: 'نسبة المعاملات الموجه داخليا',
            unit: 'معاملة'
          },
          {
            id: 'total_completed',
            name: 'إجمالى المعاملات المنجزة بالوكالة',
            unit: 'معاملة'
          }
        ],
        formula: (internal, total) => total !== 0 ? (internal / total) * 100 : null
      },
      {
        id: 6,
        name: 'نسبة تحقيق التحول الرقمي للمنظومة الرقمية',
        definition: 'نسبة تحقيق التحول الرقمي للمنظومة الرقمية',
        unit: '%',
        inputs: [
          {
            id: 'current_platforms',
            name: 'جملة عدد المنصات الرقمية الحالية بالوكالة',
            unit: 'منصة'
          },
          {
            id: 'proposed_platforms',
            name: 'جملة عدد المنصات المقترحة التي تقدمها الوكالة',
            unit: 'منصة'
          }
        ],
        formula: (current, proposed) => proposed !== 0 ? (current / proposed) * 100 : null
      }
    ]
  }
]

export const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
