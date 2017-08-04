module.exports = {
    command: {
        start: "안녕하세요. {arg2} 입니다.\n당신이 사용하는 언어는 /정보@{arg1} 을 사용하면 볼 수 있습니다.\n혹시 다른 언어를 사용하시길 원한다면 /언어@{arg1} 을 사용해주세요.",
        uptime: "이 봇은 현재 {arg1} 동안 작동중입니다.",
        search: {
            not_found: "흠.. 검색 결과가 없습니다!",
            error: "검색 결과를 보내는 데 문제가 생겼습니다!\n<b>{arg1} google {arg2}</b> 으로 시도해보세요!",
            blank: "검색할 단어를 입력해주세요!",
            result: "검색 결과"
        }, img: {
            not_found: "흠.. 검색 결과가 없습니다!",
            error: "이미지를 보내는 데 문제가 생겼습니다!\n<b>{arg1} img {arg2}</b> 으로 시도해보세요!",
            blank: "검색할 단어를 입력해주세요!"
        }, lang: {
            isgroup: "그룹채팅에서는 사용언어 변경이 불가능합니다. 개인 채팅에서 사용을 부탁드립니다.",
            announce: "사용할 언어를 변경하시고 싶으시다면, 아래의 목록에서 선택해주세요.",
            success: "🇰🇷 한국어로 사용언어가 변경되었습니다.",
            error: "언어를 변경하지 못했습니다. 다시 시도해주세요."
        }, me: "유저 아이디: {arg1}\n이름: {arg2}\n성: {arg3}\n"
            +"아이디: {arg4}\n사용언어: {arg5}\n",
        help: {
            help: {
                name: "도움말",
                description: "이 봇이 할 수 있는 일들입니다.\n아래의 기능을 누르시면 사용 방법을 알아볼 수 있습니다!",
                how: "/도움말{arg1}"
            },
            img: {
                name: "이미지 검색",
                description: "구글에서 이미지를 검색할 수 있습니다.",
                how: "/이미지{arg1} (검색어)"
            }, search: {
                name: "구글 검색",
                description: "구글에 검색할 수 있습니다.",
                how: "/구글{arg1} (검색어)"
            }, start: {
                name: "시작",
                description: "이 봇을 깨우는 명령어입니다.\n이 명령어를 사용하면 당신은 이 봇을 사용할 수 있습니다.",
                how: "/start{arg1}"
            }, uptime: {
                name: "작동 시간",
                description: "이 봇이 작동된 시간을 확인할 수 있습니다.",
                how: "/작동시간{arg1}"
            }, lang: {
                name: "사용언어 변경",
                description: "이 봇에서 사용할 언어를 변경합니다.",
                how: "/언어{arg1}"
            }, me: {
                name: "내 정보",
                description: "자신의 정보를 볼 수 있습니다.",
                how: "/정보{arg1}"
            },
            twice: "이미 보시고 계신 도움말입니다!"
        }
    }, message: {
        except: "오류! 스티커나 이미지 등은 처리할 수 없습니다!",
        join: "{arg2} 님, {arg1} 에 어서오세요.",
        left: "{arg2} 님이 {arg1} 에서 나가셨습니다.",
        botjoin: "안녕하세요. 제가 이 방에서 활동할 수 있도록 해주셔서 감사합니다. 잘부탁드립니다.",
        error: "무언가 문제가 생겼습니다!"
    }, inline: {
        img: {
            visit_page: "페이지 방문",
            view_image: "이미지 보기",
            not_found: "흠.. 검색 결과가 없습니다!",
            error: "이미지를 보내는 데 문제가 생겼습니다!\n다시 시도해주세요!"
        }, search: {
            visit_page: "페이지 방문",
            another: "다른 검색결과",
            not_found: "흠.. 검색 결과가 없습니다!",
            error: "검색 결과를 보내는 데 문제가 생겼습니다!\n다시 시도해주세요!",
            desc_null: "URL로 이동하시면 자세한 정보를 볼 수 있습니다!"
        }, tobot: "봇으로 이동"
    }
}