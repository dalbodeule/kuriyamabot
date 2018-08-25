module.exports = {
  lang: {
    langname: 'Korean',
    display: '🇰🇷 한국어',
    code: 'ko'
  },
  command: {
    start: '안녕하세요. {botname} 입니다.\n당신이 사용하는 언어는 /정보@{botid} 을 사용하면 볼 수 있습니다.\n혹시 다른 언어를 사용하시길 원한다면 /언어@{botid} 을 사용해주세요.',
    uptime: {
      message: '이 봇은 현재 {hour} 시간 {min} 분 {sec} 초 동안 작동중입니다.',
      hour: '시간',
      min: '분',
      sec: '초'
    },
    search: {
      not_found: '흠.. 검색 결과가 없습니다!',
      error: '검색 결과를 보내는 데 문제가 생겼습니다!\n<b>{botid} google {keyword}</b> 으로 시도해보세요!',
      blank: '검색할 단어를 입력해주세요!',
      result: '검색 결과',
      visit_page: '페이지 방문',
      another: '다른 검색결과',
      desc_null: 'URL로 이동하시면 자세한 정보를 볼 수 있습니다!',
      bot_blcok: '구글의 안티봇 정책으로 인해 검색이 불가능합니다. 잠시 후 다시 시도해주세요.',
      visit_google: '구글로 검색'
    },
    img: {
      not_found: '흠.. 검색 결과가 없습니다!',
      error: '이미지를 보내는 데 문제가 생겼습니다!\n<b>{botid} img {keyword}</b> 으로 시도해보세요!',
      blank: '검색할 단어를 입력해주세요!',
      visit_page: '페이지 방문',
      view_image: '이미지 보기',
      another: '다른 검색결과'
    },
    lang: {
      announce: '사용할 언어를 변경하시고 싶으시다면, 아래의 목록에서 선택해주세요.',
      success: '🇰🇷 한국어로 사용언어가 변경되었습니다.',
      error: '언어를 변경하지 못했습니다. 다시 시도해주세요.'
    },
    whatanime: {
      name: '일어 이름',
      english: '영어 이름',
      episode: '에피소드',
      time: '시간',
      match: '정확도',
      info: '답장으로 애니메이션 스샷을 보내주시면 무슨 애니메이션인지 검색해볼 수 있습니다.',
      incorrect: '이건.. 정확하지 않네요..',
      isAdult: '성인 애니메이션의 경우, 프리뷰가 제공되지 않습니다.'
    },
    welcome: {
      success: '메세지가 잘 설정되었습니다.',
      help: '입장메세지 작성법: {roomid} 로 이 방의 이름을, {userid} 로 들어온 유저의 이름을 지정합니다. off 로 하실 경우 입장메세지가 나오지 않습니다.' +
        '\n예시: `{roomid}에 어서오세요! {userid}님!`'
    },
    leave: {
      success: '메세지가 잘 설정되었습니다.',
      help: '입장메세지 작성법: {roomid} 로 이 방의 이름을, {userid} 로 들어온 유저의 이름을 지정합니다. off 로 하실 경우 퇴장메세지가 나오지 않습니다.' +
        '\n예시: `{roomid}에서 {userid}가 나갔습니다.`'
    },
    lowPermission: '당신은 이걸 할 수 있는 권한이 부족합니다.',
    isnotgroup: '그룹 또는 슈퍼그룹이 아니면 이 행동을 할 수 없습니다.',
    me: '유저 아이디: {userid}\n이름: {fname}\n성: {lname}\n아이디: {name}\n사용언어: {lang}\n',
    help: {
      help: {
        name: '도움말',
        description: '이 봇이 할 수 있는 일들입니다.\n아래의 기능을 누르시면 사용 방법을 알아볼 수 있습니다!',
        how: '/도움말{botid}'
      },
      img: {
        name: '이미지 검색',
        description: '구글에서 이미지를 검색할 수 있습니다.',
        how: '/이미지{botid} (검색어)'
      },
      search: {
        name: '구글 검색',
        description: '구글에 검색할 수 있습니다.',
        how: '/구글{botid} (검색어)'
      },
      start: {
        name: '시작',
        description: '이 봇을 깨우는 명령어입니다.\n이 명령어를 사용하면 당신은 이 봇을 사용할 수 있습니다.',
        how: '/start{botid}'
      },
      uptime: {
        name: '작동 시간',
        description: '이 봇이 작동된 시간을 확인할 수 있습니다.',
        how: '/작동시간{botid}'
      },
      lang: {
        name: '사용언어 변경',
        description: '이 봇에서 사용할 언어를 변경합니다.',
        how: '/언어{botid}'
      },
      me: {
        name: '내 정보',
        description: '자신의 정보를 볼 수 있습니다.',
        how: '/정보{botid}'
      },
      whatanime: {
        name: '무슨애니',
        description: '애니메이션의 스크린샷으로 무슨 애니메이션인지 찾아볼 수 있습니다.',
        how: '/무슨애니{botid}'
      },
      welcome: {
        name: '커스텀 입장메세지',
        description: '이 방의 입장메세지를 정할 수 있습니다.',
        how: '/welcome{botid}'
      },
      leave: {
        name: '커스텀 퇴장메세지',
        description: '이 방의 퇴장메세지를 정할 수 있습니다.',
        how: '/leave{botid}'
      },
      twice: '이미 보시고 계신 도움말입니다!',
      contact: '개발자와 연락'
    }
  },
  message: {
    except: '오류! 스티커나 이미지 등은 처리할 수 없습니다!',
    join: '{userid} 님, {roomid} 에 어서오세요.',
    left: '{userid} 님이 {roomid} 에서 나가셨습니다.',
    botjoin: '안녕하세요. 제가 이 방에서 활동할 수 있도록 해주셔서 감사합니다. 잘부탁드립니다.',
    error: '무언가 문제가 생겼습니다!'
  },
  tobot: '봇으로 이동'
}
