module.exports = {
  lang: {
    langname: "Korean",
    display: "🇰🇷 한국어",
    code: "ko"
  },
  command: {
    start: "안녕하세요. {botname} 입니다.\n당신이 사용하는 언어는 /me@{botid} 을 사용하면 볼 수 있습니다.\n혹시 다른 언어를 사용하시길 원한다면 /lang@{botid} 을 사용해주세요.",
    uptime: {
      message: "이 봇은 현재 {hour}시간 {min}분 {sec}초 동안 작동중입니다."
    },
    search: {
      not_found: "흠.. 검색 결과가 없습니다!",
      error: "검색 결과를 보내는 데 문제가 생겼습니다!\n<b>{botid} google {keyword}</b> 으로 시도해보세요!",
      blank: "검색할 단어를 입력해주세요!",
      result: "검색 결과",
      visit_page: "페이지 방문",
      another: "다른 검색결과",
      desc_null: "URL로 이동하시면 자세한 정보를 볼 수 있습니다!",
      bot_block: "구글의 안티봇 정책으로 인해 검색이 불가능합니다. 잠시 후 다시 시도해주세요.",
      visit_google: "구글로 검색"
    },
    img: {
      not_found: "흠.. 검색 결과가 없습니다!",
      error: "이미지를 보내는 데 문제가 생겼습니다!\n<b>{botid} img {keyword}</b> 으로 시도해보세요!",
      blank: "검색할 단어를 입력해주세요!",
      visit_page: "페이지 방문",
      view_image: "이미지 보기",
      another: "다른 검색결과"
    },
    lang: {
      announce: "사용할 언어를 변경하시고 싶으시다면, 아래의 목록에서 선택해주세요.",
      success: "🇰🇷 한국어로 사용언어가 변경되었습니다.",
      error: "언어를 변경하지 못했습니다. 다시 시도해주세요."
    },
    whatanime: {
      name: "일어 이름",
      english: "영어 이름",
      episode: "에피소드",
      time: "시간",
      match: "정확도",
      info: "답장으로 애니메이션 스샷을 보내주시면 무슨 애니메이션인지 검색해볼 수 있습니다.",
      incorrect: "이건.. 정확하지 않네요..",
      isAdult: "성인 애니메이션의 경우, 프리뷰가 제공되지 않습니다.",
      not_found: "검색 결과가 없습니다."
    },
    welcome: {
      success_msg: "메세지가 잘 설정되었습니다.",
      help: 
`
입장메세지 작성법: {roomid} 로 이 방의 이름을, {userid} 로 들어온 유저의 이름을 지정합니다.
on/off로 입장메세지를 키고 끌 수 있습니다.

예시: \`{roomid}에 어서오세요! {userid}님!\`
`
    },
    leave: {
      success_msg: "메세지가 잘 설정되었습니다.",
      help: 
`
퇴장메세지 작성법: {roomid} 로 이 방의 이름을, {userid} 로 나간 유저의 이름을 지정합니다.
on/off로 퇴장메세지를 키고 끌 수 있습니다.

예시: \`{roomid}에서 {userid}가 나갔습니다.\`
`
    },
    msginfo: {
      success: "원하시는 메세지의 정보입니다.",
      alert: "원하시는 메세지에 답장으로 명령어를 쳐주세요!"
    },
    homepage: {
      message: "여기가 {botname}의 홈페이지입니다.",
      button: "바로가기"
    },
    weather: {
      message: "물어보신 장소의 날씨정보입니다.\n\n풍속: {windSpeed}m/s\n풍향: {windDeg}\n습도: {humidity}%\n\n현재기온: {tempCur}℃\n현재날씨: {weather}",
      command: "날씨를 알아보고 싶은 위치를 보내주세요! 빨리 날씨정보를 찾아볼게요? 참고로, 아직 PC에서는 위치를 보낼 수 없어요!",
      apierror: "날씨정보를 받아오는 데 문제가 생겼습니다. 잠시 후 다시 시도해주세요.",
    },
    google: {
      info: "답장으로 번역하실 메세지를 보내주세요!",
      language: "지원되지 않는 언어입니다."
    },
    calc: {
      info: "답장으로 계산할 수식을 입력해주세요!",
      error: "계산 도중 에러가 발생하였습니다."
    },
    lowPermission: "당신은 이 기능을 사용할 수 있는 권한이 부족합니다.",
    isnotgroup: "그룹 또는 슈퍼그룹이 아니면 이 행동을 할 수 없습니다.",
    me: "`유저 아이디: {userid}`\n`이름: {fname}`\n`성: {lname}`\n`아이디: {name}`\n`사용언어: {lang}`\n",
    help: {
      content: "이 봇이 할 수 있는 일이 홈페이지에 설명되어 있습니다.\n현재 이 봇의 버전은 {version} 입니다.",
      contact: "개발자와 연락",
      donate: "후원"
    }
  },
  message: {
    except: "오류! 스티커나 이미지 등은 처리할 수 없습니다!",
    join: "{userid} 님, {roomid} 에 어서오세요.",
    left: "{userid} 님이 {roomid} 에서 나가셨습니다.",
    botjoin: "안녕하세요. 제가 이 방에서 활동할 수 있도록 해주셔서 감사합니다. 잘부탁드립니다.",
    error: "무언가 문제가 생겼습니다!",
    not_request: "당신은 이 기능을 요청한 유저가 아닙니다."
  },
  tobot: "봇으로 이동"
}
