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
      relation: '아들',
      deceasedFather: false,
      deceasedMother: false,
    },
    defaultAdvanced: {
    },
  },
  brideInfo: {
    label: '신부 정보',
    initial: true,
    defaultBasic: {
      name: '',
      fatherName: '',
      motherName: '',
      relation: '딸',
      deceasedFather: false,
      deceasedMother: false,
    },
    defaultAdvanced: {
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
    },
  },
  transportation: {
    label: '교통 안내',
    initial: false,
    defaultBasic: {
      content: '',
    },
    defaultAdvanced: {
    },
  },
  summary: {
    label: '요약',
    initial: false,
    defaultBasic: {
      groomName: '',
      brideName: '',
      date: '',
      time: '',
      venueName: '',
    },
    defaultAdvanced: {
    },
  },
  photo: {
    label: '사진',
    initial: false,
    defaultBasic: {
      imageUrl: '',
      caption: '',
    },
    defaultAdvanced: {
    },
  },
  gallery: {
    label: '갤러리',
    initial: false,
    defaultBasic: {
      images: [],
    },
    defaultAdvanced: {
    },
  },
  navigation: {
    label: '네비게이션',
    initial: false,
    defaultBasic: {
      destinationName: '',
      address: '',
      latitude: '',
      longitude: '',
    },
    defaultAdvanced: {
      showNaverMap: true,
      showTmap: true,
      showKakaoNavi: true,
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

export function createDefaultInvitation(id, title = '') {
  const components = Object.entries(COMPONENT_TYPES)
    .filter(([, def]) => def.initial)
    .map(([type, def], index) => ({
      id: `${type}_${Date.now()}_${index}`,
      type,
      order: index,
      basic: { ...def.defaultBasic },
      advanced: { ...def.defaultAdvanced },
    }))

  return {
    id,
    createdAt: new Date().toISOString().split('T')[0],
    title,
    ogImageUrl: '',
    components,
    deletedComponents: {},
  }
}
