import { Logger } from "log4js";
import * as Telegram from "node-telegram-bot-api";
import { Config } from "../config";
import { callback as Callback } from "../operactorBase";

export default class CallbackChangeLang extends Callback {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config);
  }

  protected async module(msg: Telegram.CallbackQuery) {
    const test = (msg.data as string).match(/changelang_([0-9]+)_([a-zA-Z]{2})/);

    if (test) {
      const callid = msg.id;
      try {
        let temp;
        this.logger.info("callback: change_lang, callback id: " + callid +
          ", username: " + this.helper.getUser(msg.from) +
          ", command: " + msg.data + ", type: pending");

        if ((msg.message as Telegram.Message).chat.type === "private") {
          temp = await this.helper.getLang(msg, this.logger);
          await temp.langset(test[2]);
          await this.bot.editMessageText(temp.text("command.lang.success"), {chat_id: (msg.message as Telegram.Message).chat.id,
            message_id: (msg.message as Telegram.Message).message_id,
            parse_mode: "HTML",
          });
          this.logger.info("callback: change_lang, callback id: " + callid +
            ", username: " + this.helper.getUser(msg.from) +
            ", command: " + msg.data + ", type: success");
        } else {
          let admins, isAdmin = false;
          [temp, admins] = await Promise.all([
            this.helper.getLang(msg, this.logger),
            this.bot.getChatAdministrators((msg.message as Telegram.Message).chat.id),
          ]);

          if (test[1] !== msg.from.id.toString()) {
            this.bot.answerCallbackQuery(msg.id, {
              text: temp.text("message.not_request"),
            });
            this.logger.info("callback: change_lang callback id: " + callid +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.data + ", type: not requested user");
          } else {
            isAdmin = admins.some((v) => {
              return v.user.id === msg.from.id;
            });
            if (isAdmin) {
              temp = await this.helper.getLang(msg, this.logger);
              await temp.langset(test[2]);
              await this.bot.editMessageText(temp.text("command.lang.success"), {
                chat_id: (msg.message as Telegram.Message).chat.id,
                message_id: (msg.message as Telegram.Message).message_id,
                parse_mode: "HTML",
              });
              this.logger.info("callback: change_lang callback id: " + callid +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.data + ", type: group success");
            } else {
              await this.bot.editMessageText(temp.text("command.lowPermission"), {
                chat_id: (msg.message as Telegram.Message).chat.id,
                message_id: (msg.message as Telegram.Message).message_id,
                parse_mode: "HTML",
              });
              this.logger.info("callback: change_lang callback id: " + callid +
              ", username: " + this.helper.getUser(msg.from) +
              ", command: " + msg.data + ", type: group lowPermission");
            }
          }
        }
      } catch (e) {
        this.logger.error("callback: change_lang callback id: " + callid +
          ", username: " + this.helper.getUser(msg.from) +
          ", command: " + msg.data + ", type: error");
        this.logger.debug(e);
      }
    }
  }
}
