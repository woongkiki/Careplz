import { BASE_URL } from "./Utils/APIConstant"

//국적정보
export const nationList = [
    {
        idx:1,
        label:'한국어',
        val: '한국어',
        nation: '한국',
        icon: BASE_URL + "/images/nationKorea.png"
    },
    {
        idx:2,
        label:'English',
        val: '영어',
        nation: '미국',
        icon: BASE_URL + "/images/nationUSA.png"
    },
    {
        idx:3,
        label: '中文 (漢語)',
        val: '중국어',
        nation: '중국',
        icon: BASE_URL + "/images/nationChina.png"
    },
    {
        idx:4,
        label: '日本語',
        val: '일본어',
        nation: '일본',
        icon: BASE_URL + "/images/nationJapan.png"
    },
    {
        idx:5,
        label: 'español',
        val: '스페인어',
        nation: '스페인',
        icon: BASE_URL + "/images/nationSpain.png"
    },
    {
        idx:6,
        label: 'français',
        val: '프랑스어',
        nation: '프랑스',
        icon: BASE_URL + "/images/nationFrance.png"
    },
    {
        idx:7,
        label: 'Deutsch',
        val: '독일어',
        nation: '독일',
        icon: BASE_URL + "/images/nationGermany.png"
    },
    {
        idx:8,
        label: 'Русский',
        val: '러시아어',
        nation: '러시아',
        icon: BASE_URL + "/images/nationRussia.png"
    },
    {
        idx:9,
        label: 'la lingua italiana',
        val: '이탈리아어',
        nation: '이탈리아',
        icon: BASE_URL + "/images/nationItalia.png"
    },
    {
        idx:10,
        label: 'Tiếng Việt',
        val: '베트남어',
        nation: '베트남',
        icon: BASE_URL + "/images/nationVietnam.png"
    },
    {
        idx:11,
        label: 'ภาษาไทย',
        val: '태국어',
        nation: '태국',
        icon: BASE_URL + "/images/nationTaiwan.png"
    },
    {
        idx:12,
        label: 'Bahasa Indonesia',
        val: '인도네시아어',
        nation: '인도네시아',
        icon: BASE_URL + "/images/nationIndonesia.png"
    }
]

//이벤트 아이콘
export const eventCateList = [
    {
        idx:1,
        category:'얼굴라인',
        uri: BASE_URL + "/images/eventIcon01.png?time=1100"
    },
    {
        idx:2,
        category:'몸매라인',
        uri: BASE_URL + "/images/eventIcon02.png?time=1100"
    },
    {
        idx:3,
        category:'피부',
        uri: BASE_URL + "/images/eventIcon03.png?time=1100"
    },
    {
        idx:4,
        category:'눈',
        uri: BASE_URL + "/images/eventIcon04.png?time=1100"
    },
    {
        idx:5,
        category:'코',
        uri: BASE_URL + "/images/eventIcon05.png?time=1100"
    },
    {
        idx:6,
        category:'치과',
        uri: BASE_URL + "/images/eventIcon06.png?time=1100"
    },
    {
        idx:7,
        category:'가슴',
        uri: BASE_URL + "/images/eventIcon07.png?time=1100"
    },
    {
        idx:8,
        category:'한의원',
        uri: BASE_URL + "/images/eventIcon08.png?time=1100"
    },
    {
        idx:9,
        category:'남성뷰티',
        uri: BASE_URL + "/images/eventIcon09.png?time=1100"
    },
    {
        idx:10,
        category:'중년',
        uri: BASE_URL + "/images/eventIcon10.png?time=1100"
    },
    {
        idx:11,
        category:'반영구',
        uri: BASE_URL + "/images/eventIcon11.png?time=1100"
    },
    {
        idx:12,
        category:'성클리닉',
        uri: BASE_URL + "/images/eventIcon12.png?time=1100"
    },
    {
        idx:13,
        category:'안과',
        uri: BASE_URL + "/images/eventIcon13.png?time=1100"
    },
    {
        idx:14,
        category:'모발이식',
        uri: BASE_URL + "/images/eventIcon14.png?time=1100"
    },
    {
        idx:15,
        category:'기타시술/성형',
        uri: BASE_URL + "/images/eventIcon15.png?time=1100"
    },
    {
        idx:16,
        category:'산부인과',
        uri: BASE_URL + "/images/eventIcon16.png?time=1100"
    },
    {
        idx:17,
        category:'정형외과',
        uri: BASE_URL + "/images/eventIcon17.png?time=1100"
    },
    {
        idx:18,
        category:'건강검진',
        uri: BASE_URL + "/images/eventIcon18.png?time=1100"
    },
    {
        idx:19,
        category:'비뇨기과',
        uri: BASE_URL + "/images/eventIcon19.png?time=1100"
    },
    {
        idx:20,
        category:'내과',
        uri: BASE_URL + "/images/eventIcon20.png?time=1100"
    },
]

//인기시술
export const popularEvent = [
    {
        idx:1,
        uri: BASE_URL + "/images/eventTop01.png",
        value: "HOT",
        eventName: "비절개 눈밑 지방",
        hospital: "강남 · 홍길동병원",
        score: "9.0",
        good: 50,
        eventOrPrice: 500000,
        eventPercent: "50%",
        eventPrice: "25만원"
    },
    {
        idx:2,
        uri: BASE_URL + "/images/eventTop02.png",
        value: "NEW",
        eventName: "비절개 눈밑 지방2",
        hospital: "강남 · 홍길동병원",
        score: "9.0",
        good: 50,
        eventOrPrice: 500000,
        eventPercent: "50%",
        eventPrice: "25만원"
    },
    {
        idx:3,
        uri: BASE_URL + "/images/eventTop03.png",
        value: "HOT",
        eventName: "비절개 눈밑 지방3",
        hospital: "강남 · 홍길동병원",
        score: "9.0",
        good: 50,
        eventOrPrice: 500000,
        eventPercent: "50%",
        eventPrice: "25만원"
    }
]

//예약내역
export const reservationList = [
    {
        idx: 1,
        names: '라이나',
        hospital: '홍길동병원',
        hospitalSubject: '내과',
        requestDate: '10.20 (목) 09:00, 09:30, 10:00',
        checkDate: '10.20 (목) 09:30',
        reservationDate: '2022. 10. 18 15:00',
        reservationCancle: "N",
        cacleReason: ""
    },
    {
        idx: 2,
        names: '라이나',
        hospital: '홍길동병원',
        hospitalSubject: '소아과',
        requestDate: '10.20 (목) 09:00, 09:30, 10:00',
        checkDate: '10.20 (목) 09:30',
        reservationDate: '2022. 10. 18 15:00',
        reservationCancle: "Y",
        cacleReason: "예약 시간 불가능"
    },
    {
        idx: 3,
        names: '라이나',
        hospital: '홍길동병원',
        hospitalSubject: '소아과',
        requestDate: '10.20 (목) 09:00, 09:30, 10:00',
        checkDate: '10.20 (목) 09:30',
        reservationDate: '2022. 10. 18 15:00',
        reservationCancle: "N",
        cacleReason: ""
    }
];

export const noticeData = [
    {
        idx:1,
        title:'공지사항입니다.',
        writer: '관리자',
        content: "관리자 작성 공지사항 내용입니다.\n\n공지사항 내용\n공지사항 내용\n공지사항 내용공지사항 내용\n\n감사합니다.",
        datetime: "2022.10.01",
        view:95
    },
    {
        idx:2,
        title:'공지사항입니다.2',
        writer: '관리자',
        content: "관리자 작성 공지사항 내용입니다.\n\n공지사항 내용\n공지사항 내용\n공지사항 내용공지사항 내용\n\n감사합니다.2",
        datetime: "2022.10.01",
        view:70
    },
    {
        idx:3,
        title:'공지사항입니다.3',
        writer: '관리자',
        content: "관리자 작성 공지사항 내용입니다.\n\n공지사항 내용\n공지사항 내용\n공지사항 내용공지사항 내용\n\n감사합니다.3",
        datetime: "2022.10.01",
        view:50
    },
    {
        idx:4,
        title:'공지사항입니다.4',
        writer: '관리자',
        content: "관리자 작성 공지사항 내용입니다.\n\n공지사항 내용\n공지사항 내용\n공지사항 내용공지사항 내용\n\n감사합니다.4",
        datetime: "2022.10.01",
        view:90
    },
    {
        idx:5,
        title:'공지사항입니다.5',
        writer: '관리자',
        content: "관리자 작성 공지사항 내용입니다.\n\n공지사항 내용\n공지사항 내용\n공지사항 내용공지사항 내용\n\n감사합니다.5",
        datetime: "2022.10.01",
        view:33
    },
]

export const recentSearchData = [
    {
        idx:1,
        schText:"모공"
    },
    {
        idx:2,
        schText:"프락셀"
    },
    {
        idx:3,
        schText:"보톡스"
    },
    {
        idx:4,
        schText:"아쿠아필"
    },
    {
        idx:5,
        schText:"스킨보톡스"
    },
];

export const hospitalSchData = [
    {
        idx:1,
        schText:"모공"
    },
    {
        idx:2,
        schText:"감기"
    },
    {
        idx:3,
        schText:"장염"
    },
    {
        idx:4,
        schText:"복통"
    },
    {
        idx:5,
        schText:"건강검진"
    },
    {
        idx:5,
        schText:"영유아검진"
    },
];

export const rankSch = [
    {
        idx:1,
        rank:1,
        schText:"아쿠아필"
    },
    {
        idx:2,
        rank:2,
        schText:"모공"
    },
    {
        idx:3,
        rank:3,
        schText:"코"
    },
    {
        idx:4,
        rank:4,
        schText:"점"
    },
    {
        idx:5,
        rank:5,
        schText:"눈썹"
    },
    {
        idx:6,
        rank:6,
        schText:"눈밑지방"
    },
    {
        idx:7,
        rank:7,
        schText:"눈매교정"
    },
];

export const hospitalrankSch = [
    {
        idx:1,
        rank:1,
        schText:"감기"
    },
    {
        idx:2,
        rank:2,
        schText:"장염"
    },
    {
        idx:3,
        rank:3,
        schText:"골절"
    },
    {
        idx:4,
        rank:4,
        schText:"보건증"
    },
    {
        idx:5,
        rank:5,
        schText:"영유아검진"
    },
    {
        idx:6,
        rank:6,
        schText:"공단검진"
    },
]

export const wishHospitalList = [
    {
        idx:1,
        hospital: '홍길동 병원',
        medicalStatus: '진료중' ,
        wishStatus:"Y"
    },
    {
        idx:2,
        hospital: '홍길동 병원',
        medicalStatus: '진료중',
        wishStatus:"Y"
    },
    {
        idx:3,
        hospital: '홍길동 병원',
        medicalStatus: '진료중',
        wishStatus:"Y"
    },
    {
        idx:4,
        hospital: '홍길동 병원',
        medicalStatus: '진료중',
        wishStatus:"Y"
    },
    {
        idx:5,
        hospital: '홍길동 병원',
        medicalStatus: '진료중',
        wishStatus:"Y"
    },
    {
        idx:6,
        hospital: '홍길동 병원',
        medicalStatus: '진료중',
        wishStatus:"Y"
    },
];

export const hospitalMapCate = [
   
    {
        idx:1,
        hospital:'치과',
        icon: BASE_URL + "/images/toothHospital.png"
    },
    {
        idx:2,
        hospital:'피부과',
        icon: BASE_URL + "/images/dermatologyIcon.png"
    },
    {
        idx:3,
        hospital:'성형외과',
        icon: BASE_URL + "/images/plasticSurgeryIcon.png"
    },
    {
        idx:4,
        hospital:'이비인후과',
        icon: BASE_URL + "/images/OtorhinolaryngologyIcon.png"
    },
    {
        idx:5,
        hospital:'소아과',
        icon: BASE_URL + "/images/pediatricsIcon.png"
    },
    {
        idx:6,
        hospital:'내과',
        icon: BASE_URL + "/images/medicineIcon.png"
    },
    {
        idx:7,
        hospital:'산부인과',
        icon: BASE_URL + "/images/ObstetricsgynecologyIcon.png"
    },
    {
        idx:8,
        hospital:'안과',
        icon: BASE_URL + "/images/eyeHospitalIcon.png"
    },
    {
        idx:8,
        hospital:'정신의학과',
        icon: BASE_URL + "/images/psychiatryIcon.png"
    },
];


export const untactList = [
    {
        idx:1,
        hospital: "홍길동병원",
        doctor: "홍길동 의사",
        subject: "이비인후과",
        date: "2022.12.08"
    },
    {
        idx:2,
        hospital: "홍길동병원2",
        doctor: "홍길동 의사",
        subject: "이비인후과",
        date: "2022.12.08"
    },
    {
        idx:3,
        hospital: "홍길동병원3",
        doctor: "홍길동 의사",
        subject: "이비인후과",
        date: "2022.12.08"
    },
    {
        idx:4,
        hospital: "홍길동병원4",
        doctor: "홍길동 의사",
        subject: "이비인후과",
        date: "2022.12.08"
    },
    {
        idx:5,
        hospital: "홍길동병원5",
        doctor: "홍길동 의사",
        subject: "이비인후과",
        date: "2022.12.08"
    },
]

//인기 비대면
export const popularUntact = [
    {
        idx:1,
        uri: BASE_URL + "/images/puIcon01.png",
        symptom: "감기/몸살",
    },
    {
        idx:2,
        uri: BASE_URL + "/images/puIcon02.png",
        symptom: "소아과",
    },
    {
        idx:3,
        uri: BASE_URL + "/images/puIcon03.png",
        symptom: "피부질환",
    },
    {
        idx:4,
        uri: BASE_URL + "/images/puIcon04.png",
        symptom: "고혈압/당뇨",
    },
    {
        idx:5,
        uri: BASE_URL + "/images/puIcon05.png",
        symptom: "장염/복통",
    },
]

//증상별 진료 데이터
export const symptomClinic = [
    {
        idx:1,
        uri: BASE_URL + "/images/scIcon01.png",
        symptom: "다이어트",
    },
    {
        idx:2,
        uri: BASE_URL + "/images/scIcon02.png",
        symptom: "무좀",
    },
    {
        idx:3,
        uri: BASE_URL + "/images/scIcon03.png",
        symptom: "방광염",
    },
    {
        idx:4,
        uri: BASE_URL + "/images/scIcon04.png",
        symptom: "비뇨기과",
    },
    {
        idx:5,
        uri: BASE_URL + "/images/scIcon04.png",
        symptom: "비염",
    },
    {
        idx:6,
        uri: BASE_URL + "/images/scIcon06.png",
        symptom: "사후피임",
    },
    {
        idx:7,
        uri: BASE_URL + "/images/scIcon07.png",
        symptom: "안구질환",
    },
    {
        idx:8,
        uri: BASE_URL + "/images/scIcon08.png",
        symptom: "여성질환",
    },
    {
        idx:9,
        uri: BASE_URL + "/images/scIcon09.png",
        symptom: "위염",
    },
    {
        idx:10,
        uri: BASE_URL + "/images/scIcon10.png",
        symptom: "탈모",
    },
    {
        idx:11,
        uri: BASE_URL + "/images/scIcon11.png",
        symptom: "통증",
    }
];


//의사 리스트
export const doctorList = [
    {
        idx:1,
        doctor: "홍길동",
        hospital: "홍길동 성형외과"
    },
    {
        idx:2,
        doctor: "홍길동2",
        hospital: "홍길동 성형외과2"
    },
    {
        idx:3,
        doctor: "홍길동3",
        hospital: "홍길동 성형외과3"
    },
    {
        idx:4,
        doctor: "홍길동4",
        hospital: "홍길동 성형외과4"
    },
    {
        idx:5,
        doctor: "홍길동5",
        hospital: "홍길동 성형외과5"
    },
];

export const subCategory = [
    {
        idx:1,
        category:'피부시술'
    },
    {
        idx:2,
        category:'피부질환'
    },
    {
        idx:3,
        category:'제모시술'
    },
    {
        idx:4,
        category:'얼굴보톡스'
    },
];

//추천 이벤트
export const recommendEvent = [
    {
        idx: 1,
        uri:BASE_URL + "/images/otherReviewThumb01.png",
        title:'주름개선',
        price: 105000
    },
    {
        idx: 2,
        uri:BASE_URL + "/images/otherReviewThumb02.png",
        title:'상담',
        price: 105000
    },
    {
        idx: 3,
        uri:BASE_URL + "/images/otherReviewThumb03.png",
        title:'변비개선',
        price: 105000
    },
    {
        idx: 4,
        uri:BASE_URL + "/images/otherReviewThumb04.png",
        title:'피부개선',
        price: 105000
    },
];

export const reservationTime = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
];

export const subjectData = ['바로예약', '예약', '신속항원검사', 'PCR검사', '주차가능', '야간진료', '응급진료', '전문의', '비대면진료'];

export const hospitalMapContent = [
    {
        idx:1,
        hospital:'홍길동 병원',
        diagnosis: '진료중',
        diagnosisTime: '09:00 ~ 18:00',
        distance:'250m',
        address: '경기도 부천시 길주로 272',
        subject:'내과',
        category:'야간진료,신속항원,전문의',
        nowReservation:'Y',
        popular:'Y',
        reservation:'N',
    },
    {
        idx:2,
        hospital:'홍길동 병원2',
        diagnosis: '진료중',
        diagnosisTime: '09:00 ~ 18:00',
        distance:'250m',
        address: '경기도 부천시 길주로 272',
        subject:'내과',
        category:'야간진료,신속항원,전문의',
        nowReservation:'N',
        popular:'N',
        reservation:'Y',
    },
    {
        idx:3,
        hospital:'홍길동 병원3',
        diagnosis: '진료중',
        diagnosisTime: '09:00 ~ 18:00',
        distance:'250m',
        address: '경기도 부천시 길주로 272',
        subject:'소아과',
        category:'야간진료,신속항원,전문의',
        nowReservation:'N',
        popular:'N',
        reservation:'Y',
    },
    {
        idx:4,
        hospital:'홍길동 병원4',
        diagnosis: '진료중',
        diagnosisTime: '09:00 ~ 18:00',
        distance:'250m',
        address: '경기도 부천시 길주로 272',
        subject:'내과',
        category:'야간진료,신속항원,전문의',
        nowReservation:'N',
        popular:'N',
        reservation:'Y',
    },
];

export const allHopistalCategory = [
    {
        idx:0,
        hospital:'모든병원',
        icon: BASE_URL + "/images/allHospitalIcon.png"
    },
    {
        idx:1,
        hospital:'치과',
        icon: BASE_URL + "/images/toothHospital.png"
    },
    {
        idx:2,
        hospital:'피부과',
        icon: BASE_URL + "/images/dermatologyIcon.png"
    },
    {
        idx:3,
        hospital:'성형외과',
        icon: BASE_URL + "/images/plasticSurgeryIcon.png"
    },
    {
        idx:4,
        hospital:'이비인후과',
        icon: BASE_URL + "/images/OtorhinolaryngologyIcon.png"
    },
    {
        idx:5,
        hospital:'소아과',
        icon: BASE_URL + "/images/pediatricsIcon.png"
    },
    {
        idx:6,
        hospital:'내과',
        icon: BASE_URL + "/images/medicineIcon.png"
    },
    {
        idx:7,
        hospital:'산부인과',
        icon: BASE_URL + "/images/ObstetricsgynecologyIcon.png"
    },
    {
        idx:8,
        hospital:'안과',
        icon: BASE_URL + "/images/eyeHospitalIcon.png"
    },
    {
        idx:8,
        hospital:'정신의학과',
        icon: BASE_URL + "/images/psychiatryIcon.png"
    },
];

//병원리뷰
export const hospistalReview = [
    {
        idx:1,
        reviewText:"댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내",
        date:"2022. 10. 19",
        writer:"홍*동",
        good:7
    },
    {
        idx:2,
        reviewText:"댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내",
        date:"2022. 10. 19",
        writer:"손*민",
        good:7
    }
]