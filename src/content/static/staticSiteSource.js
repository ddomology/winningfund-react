import { STATIC_ASSET_REGISTRY } from '../../assets/assetRegistry.js'

const source = {
  "sourceType": "STATIC_DATA_MODULE",
  "sourceVersion": "step-05d-section-rail-2026-08-13",
  "siteConfig": {
    "siteName": "WinningFund",
    "routeManifest": {
      "HOME": "/",
      "ABOUT": "/about",
      "MEMBERS": "/members",
      "ACTIVITIES": "/activities",
      "RECRUITMENT": "/recruitment"
    },
    "currentTermId": "18-2",
    "homeSemesterId": "18-2"
  },
  "navigation": [
    {
      "id": "home",
      "label": "HOME",
      "routeId": "HOME",
      "order": 1,
      "visibility": "VISIBLE"
    },
    {
      "id": "about",
      "label": "ABOUT",
      "routeId": "ABOUT",
      "order": 2,
      "visibility": "VISIBLE"
    },
    {
      "id": "members",
      "label": "MEMBERS",
      "routeId": "MEMBERS",
      "order": 3,
      "visibility": "VISIBLE"
    },
    {
      "id": "activities",
      "label": "ACTIVITIES",
      "routeId": "ACTIVITIES",
      "order": 4,
      "visibility": "VISIBLE"
    },
    {
      "id": "recruitment",
      "label": "RECRUITMENT",
      "routeId": "RECRUITMENT",
      "order": 5,
      "visibility": "VISIBLE"
    }
  ],
  "homeContent": {
    "sourceStatus": "PARTIAL",
    "hero": {
      "englishIdentity": "INVESTMENT AND ECONOMICS CLUB",
      "koreanSlogan": "우리는 늘 최선의 선택을 연구합니다",
      "heroAssetId": null,
      "ctaIntent": null,
      "sourceStatus": "AUTHORITATIVE"
    },
    "shortIntroduction": {
      "heading": "WinningFund",
      "bodyCopy": null,
      "sourceStatus": "SOURCE_AVAILABLE_NOT_IMPORTED",
      "supportingIdentity": "투자·경제 학회",
      "optionalStats": []
    },
    "programOverviewActivityIds": [
      "sector-followup",
      "classes",
      "mock-investment-fm",
      "reports"
    ],
    "mission": {
      "title": "우리가 지향하는 방향",
      "sourceStatus": "SOURCE_AVAILABLE_PARTIAL",
      "items": [
        {
          "id": "depth-in-joy",
          "order": 1,
          "heading": "즐거움 속에 담긴 깊이",
          "description": "학술적 치열함과 사람 냄새 나는 따뜻함이 공존합니다",
          "sourceStatus": "SOURCE_BACKED_REVIEWABLE"
        },
        {
          "id": "connection-beyond-comfort",
          "order": 2,
          "heading": "안주하지 않는 연결",
          "description": "우리만의 리그를 넘어, 더 넓은 세상과 호흡합니다",
          "sourceStatus": "SOURCE_BACKED_REVIEWABLE"
        },
        {
          "id": "virtuous-impact-cycle",
          "order": 3,
          "heading": "선한 영향력의 선순환",
          "description": "올바른 철학을 가진 투자자를 배양하고 사회와 가치를 나눕니다",
          "sourceStatus": "SOURCE_BACKED_REVIEWABLE"
        }
      ]
    },
    "semesterContents": {
      "semesterId": "18-2",
      "title": "18-2 활동",
      "sourceStatus": "AUTHORITATIVE",
      "scheduleItems": [
        {
          "id": "18-2-september",
          "monthNumber": "09",
          "monthLabel": "SEP",
          "sourceStatus": "AUTHORITATIVE",
          "events": [
            {
              "id": "18-2-0904-ot",
              "dateLabel": "09.04",
              "title": "OT",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-0911-class-start",
              "dateLabel": "09.11",
              "title": "1주차 분반활동 시작",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-0918-class",
              "dateLabel": "09.18",
              "title": "2주차 분반활동",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-0923-all-lecture",
              "dateLabel": "09.23",
              "title": "3주차 전체강의",
              "sourceStatus": "AUTHORITATIVE"
            }
          ]
        },
        {
          "id": "18-2-october",
          "monthNumber": "10",
          "monthLabel": "OCT",
          "sourceStatus": "AUTHORITATIVE",
          "events": [
            {
              "id": "18-2-1002-class",
              "dateLabel": "10.02",
              "title": "4주차 분반활동",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1003-1004-mt",
              "dateLabel": "10.03~10.04",
              "title": "MT",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1009-class",
              "dateLabel": "10.09",
              "title": "5주차 분반활동",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1010-1029-midterm-break",
              "dateLabel": "10.10~10.29",
              "title": "중간고사 휴식기간",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1030-class",
              "dateLabel": "10.30",
              "title": "6주차 분반활동",
              "sourceStatus": "AUTHORITATIVE"
            }
          ]
        },
        {
          "id": "18-2-november",
          "monthNumber": "11",
          "monthLabel": "NOV",
          "sourceStatus": "AUTHORITATIVE",
          "events": [
            {
              "id": "18-2-1106-team-report",
              "dateLabel": "11.06",
              "title": "7주차 팀리포트 발표",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1113-team-report",
              "dateLabel": "11.13",
              "title": "8주차 팀리포트 발표",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1120-stock-game",
              "dateLabel": "11.20",
              "title": "9주차 주식게임",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1127-all-lecture",
              "dateLabel": "11.27",
              "title": "10주차 전체강의",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1128-1217-final-break",
              "dateLabel": "11.28~12.17",
              "title": "기말고사 휴식기간",
              "sourceStatus": "AUTHORITATIVE"
            }
          ]
        },
        {
          "id": "18-2-december",
          "monthNumber": "12",
          "monthLabel": "DEC",
          "sourceStatus": "AUTHORITATIVE",
          "events": [
            {
              "id": "18-2-1204-winning-night",
              "dateLabel": "12.04",
              "title": "위닝인의 밤",
              "sourceStatus": "AUTHORITATIVE"
            },
            {
              "id": "18-2-1218-closing",
              "dateLabel": "12.18",
              "title": "종강총회",
              "sourceStatus": "AUTHORITATIVE"
            }
          ]
        }
      ]
    }
  },
  "aboutContent": {
    "sourceStatus": "AUTHORITATIVE",
    "hero": {
      "eyebrow": "WINNINGFUND",
      "title": "ABOUT",
      "summary": "대학생연합투자경제동아리 위닝펀드는 전국 최대 규모, 2009년 출범 이래 18년째 이어져 오고 있습니다."
    },
    "introductionTitle": "Introduction",
    "detailedIntroduction": "위닝펀드는 2009년 출범해 18년째 이어지고 있는 전국 최대 규모의 대학생연합투자경제동아리입니다. 매주 금요일 동국대학교에 모여 섹터별 리서치와 분반강의, 모의투자를 통해 근거 있는 판단으로 투자하는 법을 함께 익히고 있으며, 지금까지 1,800여 명의 회원이 거쳐간 국내 최대 규모의 연합 투자 동아리로 성장했습니다.",
    "facts": [
      {
        "id": "about-founded",
        "value": "2009",
        "label": "FOUNDED"
      },
      {
        "id": "about-years",
        "value": "18",
        "label": "YEARS"
      },
      {
        "id": "about-members",
        "value": "1,800+",
        "label": "MEMBERS"
      }
    ]
  },
  "organization": {
    "sourceStatus": "AUTHORITATIVE",
    "note": "이렇게 체계적으로 나뉜 부서들이 유기적으로 협력하며, 위닝펀드의 모든 활동이 원활하게 운영될 수 있도록 최선을 다하고 있습니다.",
    "nodes": [
      {
        "id": "president",
        "order": 1,
        "tier": "LEADERSHIP",
        "role": "회장",
        "description": "동아리의 운영 방향을 기획하고 각 부서와 협력하여 전반적인 활동을 총괄합니다."
      },
      {
        "id": "vice-president",
        "order": 2,
        "tier": "LEADERSHIP",
        "role": "부회장",
        "description": "회원 관리와 대외 협력, 운용팀 운영을 담당하며 원활한 동아리 운영을 이끌어갑니다."
      },
      {
        "id": "accounting",
        "order": 3,
        "tier": "OFFICER",
        "role": "회계임원",
        "description": "신입회원 가입을 진행하고 동아리 예산, 행사 지출 및 정산, 일정을 관리합니다."
      },
      {
        "id": "people",
        "order": 4,
        "tier": "OFFICER",
        "role": "인사임원",
        "description": "기존·신입 회원을 관리하고 회원 DB를 구축하며, 출결 및 모의투자를 관리합니다."
      },
      {
        "id": "education",
        "order": 5,
        "tier": "OFFICER",
        "role": "교육임원 (입문·실전)",
        "description": "교육 커리큘럼을 구성하고 분반강의, 스터디, 퀴즈 등 다양한 교육 프로그램을 기획·운영합니다."
      },
      {
        "id": "planning",
        "order": 6,
        "tier": "OFFICER",
        "role": "기획임원",
        "description": "동아리의 다양한 프로그램과 미션을 기획·운영하며, 온·오프라인 홍보 콘텐츠를 제작합니다."
      }
    ]
  },
  "externalActivities": {
    "sourceStatus": "AUTHORITATIVE",
    "title": "외부 활동 & 연계",
    "introduction": "키움증권, 이베스트투자증권, 유진투자증권, 한국투자증권 등 주요 증권사와 파트너십을 맺고 있으며, 2025년 KB증권 '월가를 향한 흑백 마스터' 대회에서 우승을 차지했습니다. 다양한 대외 네트워크를 통해 회원들의 성장을 지원하고 있습니다.",
    "items": [
      {
        "id": "korea-investment",
        "label": "한국투자증권",
        "description": "연계 프로그램으로 서류전형 우대 혜택 제공",
        "sourceStatus": "AUTHORITATIVE"
      },
      {
        "id": "uic",
        "label": "UIC",
        "description": "전국대학생투자동아리연합회 소속으로 타 대학 동아리와 교류",
        "sourceStatus": "AUTHORITATIVE"
      },
      {
        "id": "writing-bulkup",
        "label": "글쓰기 벌크업",
        "description": "투자 관련 글쓰기 역량을 키우는 대외 프로그램 참여",
        "sourceStatus": "AUTHORITATIVE"
      }
    ]
  },
  "socialLinks": {
    "sourceStatus": "AUTHORITATIVE",
    "title": "SNS",
    "introduction": "위닝펀드는 소셜미디어를 적극 활용하며 활동 소식과 모집 안내를 발 빠르게 전하고 있습니다. 인스타그램과 네이버 카페를 통해 누구나 위닝펀드의 소식을 확인하고 소통할 수 있습니다.",
    "items": [
      {
        "id": "instagram",
        "label": "Instagram",
        "handle": "@winning_fund",
        "url": "https://www.instagram.com/winning_fund/",
        "sourceStatus": "AUTHORITATIVE"
      },
      {
        "id": "naver-cafe",
        "label": "Naver Cafe",
        "handle": "winningfund",
        "url": "https://cafe.naver.com/winningfund",
        "sourceStatus": "AUTHORITATIVE"
      }
    ]
  },
  "membersByTerm": [
    {
      "termId": "18-2",
      "label": "18-2",
      "order": 1,
      "cohortStatus": "CURRENT",
      "dataStatus": "AVAILABLE",
      "members": [
        {
          "memberId": "18-2-member-01",
          "name": "김호준",
          "role": "회장",
          "photoAssetId": "member-18-2-01-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-02",
          "name": "이승민",
          "role": "부회장",
          "photoAssetId": "member-18-2-02-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-03",
          "name": "황승연",
          "role": "회계임원",
          "photoAssetId": "member-18-2-03-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-04",
          "name": "김승연",
          "role": "인사임원",
          "photoAssetId": "member-18-2-04-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-05",
          "name": "이규정",
          "role": "교육임원",
          "photoAssetId": "member-18-2-05-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-06",
          "name": "김재형",
          "role": "교육임원",
          "photoAssetId": "member-18-2-06-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-07",
          "name": "마시은",
          "role": "기획임원",
          "photoAssetId": "member-18-2-07-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-08",
          "name": "임정우",
          "role": "기획임원",
          "photoAssetId": "member-18-2-08-photo",
          "sourceStatus": "AUTHORITATIVE"
        },
        {
          "memberId": "18-2-member-09",
          "name": "황채연",
          "role": "기획임원",
          "photoAssetId": "member-18-2-09-photo",
          "sourceStatus": "AUTHORITATIVE"
        }
      ]
    },
    {
      "termId": "18-1",
      "label": "18-1",
      "order": 2,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "17-2",
      "label": "17-2",
      "order": 3,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "17-1",
      "label": "17-1",
      "order": 4,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "16-2",
      "label": "16-2",
      "order": 5,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "16-1",
      "label": "16-1",
      "order": 6,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "15-2",
      "label": "15-2",
      "order": 7,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "15-1",
      "label": "15-1",
      "order": 8,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "14-2",
      "label": "14-2",
      "order": 9,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "14-1",
      "label": "14-1",
      "order": 10,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "13-2",
      "label": "13-2",
      "order": 11,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "13-1",
      "label": "13-1",
      "order": 12,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "12-2",
      "label": "12-2",
      "order": 13,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "12-1",
      "label": "12-1",
      "order": 14,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "11-2",
      "label": "11-2",
      "order": 15,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "11-1",
      "label": "11-1",
      "order": 16,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "10-2",
      "label": "10-2",
      "order": 17,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "10-1",
      "label": "10-1",
      "order": 18,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "9-2",
      "label": "9-2",
      "order": 19,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "9-1",
      "label": "9-1",
      "order": 20,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "8-2",
      "label": "8-2",
      "order": 21,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "8-1",
      "label": "8-1",
      "order": 22,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "7-2",
      "label": "7-2",
      "order": 23,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "7-1",
      "label": "7-1",
      "order": 24,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "6-2",
      "label": "6-2",
      "order": 25,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "6-1",
      "label": "6-1",
      "order": 26,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "5-2",
      "label": "5-2",
      "order": 27,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "5-1",
      "label": "5-1",
      "order": 28,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "4-2",
      "label": "4-2",
      "order": 29,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "4-1",
      "label": "4-1",
      "order": 30,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "3-2",
      "label": "3-2",
      "order": 31,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "3-1",
      "label": "3-1",
      "order": 32,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "2-2",
      "label": "2-2",
      "order": 33,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "2-1",
      "label": "2-1",
      "order": 34,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "1-2",
      "label": "1-2",
      "order": 35,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    },
    {
      "termId": "1-1",
      "label": "1-1",
      "order": 36,
      "cohortStatus": "HISTORICAL",
      "dataStatus": "UNAVAILABLE",
      "members": [],
      "sourceStatus": "UNAVAILABLE",
      "sourceNote": "source-row-retained-records-not-imported"
    }
  ],
  "activitySections": [
    {
      "activityId": "sector-followup",
      "order": 1,
      "programNumber": "01",
      "title": "섹터별 팔로우업",
      "sourceStatus": "PARTIAL",
      "semanticFacts": {
        "weeklyDeadline": "목요일",
        "flow": [
          "담당 섹터의 주요 이슈·관련 종목 조사",
          "발표",
          "회원 질문",
          "발표자 답변",
          "투자 관점 구체화"
        ],
        "prohibitedStaleCopy": "2~3분간"
      },
      "homeLabel": "섹터별 팔로우업",
      "homeSummary": "10개 섹터로 나뉘어 각자 희망 섹터를 맡고, 매주 주요 이슈와 관련 종목을 조사해 발표합니다. 발표 후 질문과 답변을 통해 투자 관점을 구체화합니다.",
      "homeSummaryStatus": "SOURCE_BACKED_REVIEWABLE"
    },
    {
      "activityId": "classes",
      "order": 2,
      "programNumber": "02",
      "title": "분반강의",
      "sourceStatus": "PARTIAL",
      "semanticFacts": {
        "tracks": [
          "입문반",
          "실전반"
        ]
      },
      "homeLabel": "분반강의",
      "homeSummary": "입문반은 투자의 기본과 기업분석을, 실전반은 정량분석과 투자 아이디어를 다룹니다. 분반은 학기마다 자유롭게 교차 수강합니다.",
      "homeSummaryStatus": "SOURCE_BACKED_REVIEWABLE"
    },
    {
      "activityId": "mock-investment-fm",
      "order": 3,
      "programNumber": "03",
      "title": "모의투자 & FM팀",
      "sourceStatus": "PARTIAL",
      "semanticFacts": {
        "fmParticipation": "SUBSET_OF_MEMBERS",
        "tradingJournalAssetId": null,
        "unresolvedKey": "U-006"
      },
      "homeLabel": "모의투자 & FM팀",
      "homeSummary": "개별·팀별 모의투자로 실전 감각을 익히고, FM팀은 일부 회원이 소규모로 참여해 실제 자금을 운용합니다.",
      "homeSummaryStatus": "SOURCE_BACKED_REVIEWABLE"
    },
    {
      "activityId": "reports",
      "order": 4,
      "programNumber": "04",
      "title": "리포트",
      "sourceStatus": "PARTIAL",
      "semanticFacts": {
        "hierarchy": {
          "teamReport": "TEAM",
          "personalReportOptions": [
            "INDIVIDUAL_COMPANY",
            "INDIVIDUAL_STRATEGY"
          ]
        },
        "unresolvedKey": "U-007"
      },
      "homeLabel": "개별 리포트 & 팀리포트 발간",
      "homeSummary": "조원들과 하나의 기업을 정해 산업분석부터 밸류에이션까지 팀리포트를 작성합니다. 이후 개인은 기업분석 또는 투자전략 리포트를 선택해 작성합니다.",
      "homeSummaryStatus": "SOURCE_BACKED_REVIEWABLE"
    }
  ],
  "reportExamples": [
    {
      "reportId": "team-report-example",
      "reportType": "TEAM",
      "sourceStatus": "UNAVAILABLE",
      "assetId": null,
      "title": null,
      "caption": null,
      "unresolvedKey": "U-007"
    },
    {
      "reportId": "individual-company-example",
      "reportType": "INDIVIDUAL_COMPANY",
      "sourceStatus": "UNAVAILABLE",
      "assetId": null,
      "title": null,
      "caption": null,
      "unresolvedKey": "U-007"
    },
    {
      "reportId": "individual-strategy-example",
      "reportType": "INDIVIDUAL_STRATEGY",
      "sourceStatus": "UNAVAILABLE",
      "assetId": null,
      "title": null,
      "caption": null,
      "unresolvedKey": "U-007"
    }
  ],
  "clubs": [
    {
      "clubId": "jahabugong",
      "officialName": "자하부공",
      "category": "ACADEMIC",
      "sourceStatus": "AUTHORITATIVE"
    },
    {
      "clubId": "winning-hall-meeting",
      "officialName": "위닝홀미팅",
      "category": "ACADEMIC",
      "sourceStatus": "AUTHORITATIVE"
    },
    {
      "clubId": "sangeujoah",
      "officialName": "산그좋",
      "category": "SOCIAL",
      "activity": "등산",
      "sourceStatus": "AUTHORITATIVE"
    },
    {
      "clubId": "winnings-run",
      "officialName": "위닝스런",
      "category": "SOCIAL",
      "activity": "러닝",
      "sourceStatus": "AUTHORITATIVE"
    }
  ],
  "recruitment": {
    "sourceStatus": "PARTIAL",
    "status": null,
    "statusState": "UNKNOWN",
    "semester": null,
    "period": {
      "startAt": "2026-08-03",
      "endAt": "2026-08-21",
      "displayText": "8월 3일 ~ 8월 21일",
      "sourceStatus": "AUTHORITATIVE"
    },
    "eligibility": null,
    "steps": null,
    "detailedSchedule": null,
    "applicationUrl": null,
    "faq": null,
    "posterAssetId": null,
    "contact": null,
    "ctaLabel": null,
    "unresolvedKey": "U-001",
    "implementationFallbackAuthorized": true,
    "productionContentBlocking": true
  }
}
source.assets = STATIC_ASSET_REGISTRY
export const STATIC_SITE_SOURCE = Object.freeze(source)
