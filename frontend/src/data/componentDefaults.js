export const COMPONENT_TYPES = {
  greeting: {
    label: '인사말',
    initial: true,
    defaultBasic: {
      title: '소중한 분들을 초대합니다',
      content: '서로 다른 길을 걸어온 두 사람이\n하나의 길을 함께 걷고자 합니다.\n귀한 걸음 하시어 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.',
    },
    defaultAdvanced: {
      fontFamily: '',
      textAlign: 'center',
      backgroundColor: '#ffffff',
    },
  },
  groomInfo: {
    label: '신랑 정보',
    initial: true,
    defaultBasic: {
      name: '',
      fatherName: '',
      motherName: '',
    },
    defaultAdvanced: {
      relation: '장남',
      deceasedFather: false,
      deceasedMother: false,
    },
  },
  brideInfo: {
    label: '신부 정보',
    initial: true,
    defaultBasic: {
      name: '',
      fatherName: '',
      motherName: '',
    },
    defaultAdvanced: {
      relation: '장녀',
      deceasedFather: false,
      deceasedMother: false,
    },
  },
  weddingDate: {
    label: '예식 일시',
    initial: true,
    defaultBasic: {
      date: '',
      time: '',
    },
    defaultAdvanced: {
      showCalendar: false,
    },
  },
  weddingVenue: {
    label: '예식 장소',
    initial: true,
    defaultBasic: {
      venueName: '',
      address: '',
    },
    defaultAdvanced: {
      hallName: '',
      showMap: false,
      transportation: '',
    },
  },
  contact: {
    label: '연락처',
    initial: true,
    defaultBasic: {
      groomName: '',
      groomPhone: '',
      brideName: '',
      bridePhone: '',
    },
    defaultAdvanced: {
      groomFatherName: '',
      groomFatherPhone: '',
      groomMotherName: '',
      groomMotherPhone: '',
      brideFatherName: '',
      brideFatherPhone: '',
      brideMotherName: '',
      brideMotherPhone: '',
    },
  },
}

export function createDefaultInvitation(id) {
  const components = Object.entries(COMPONENT_TYPES)
    .filter(([, def]) => def.initial)
    .map(([type, def], index) => ({
      id: `${type}_${Date.now()}_${index}`,
      type,
      order: index,
      basic: { ...def.defaultBasic },
      advanced: { ...def.defaultAdvanced },
      showAdvanced: false,
    }))

  return {
    id,
    createdAt: new Date().toISOString().split('T')[0],
    components,
    deletedComponents: {},
  }
}
