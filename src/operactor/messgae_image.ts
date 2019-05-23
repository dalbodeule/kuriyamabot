import * as google from "google-parser";
import { Logger } from "log4js";
import * as Telegram from "node-telegram-bot-api";
import { Config } from "../config";
import { message as Message } from "../operactorBase";

export default class MessageImage extends Message {
  constructor(bot: Telegram, logger: Logger, config: Config) {
    super (bot, logger, config);
  }

  protected async module(msg: Telegram.Message) {
    if (Math.round((new Date()).getTime() / 1000) - msg.date >= 180) { return; }
    if (!msg.reply_to_message) { return; }
    if ((msg.reply_to_message.from as Telegram.User).username !==
      this.config.bot.username) { return; }
    if (Math.round((new Date()).getTime() / 1000) -
      msg.reply_to_message.date >= 60) { return; }
    if (!msg.reply_to_message) { return; }
    if (!msg.reply_to_message.text) { return; }
    if (!msg.reply_to_message.text.match(/🖼❗️/)) { return; }

    const chatid = msg.chat.id;
    try {
      this.logger.info("message: img, chatid: " + chatid +
        ", username: " + this.helper.getUser(msg.from!) +
        ", command: " + msg.text + ", type: pending");

      const [send, temp] = await Promise.all([
        this.bot.sendChatAction(chatid, "upload_photo"),
        this.helper.getLang(msg, this.logger),
      ]);

      let response = await this.helper.image(msg.text!);

      if (!response) {
        await this.bot.sendChatAction(chatid, "typing");
        await this.bot.sendMessage(chatid, "🖼 " +
          temp.text("command.img.not_found"), {
            reply_to_message_id: msg.message_id,
          });
        this.logger.info("message: img, chatid: " + chatid +
          ", username: " + this.helper.getUser(msg.from!) +
          ", command: " + msg.text + ", type: success, response: not found");
      } else {
        try {
          await this.bot.sendChatAction(chatid, "upload_photo");
          await this.bot.sendPhoto(chatid, response.img, {
            reply_markup: {
              inline_keyboard: [[{
                text: temp.text("command.img.visit_page"),
                url: response.url,
              }, {
                text: temp.text("command.img.view_image"),
                url: response.img,
              }],
              [{
                text: temp.text("command.img.another"),
                switch_inline_query_current_chat: "img " + msg.text,
              }]],
            },
            reply_to_message_id: msg.message_id,
          });
          this.logger.info("message: img, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: success, response: search success");
        } catch (e) {
          try {
            await this.bot.sendChatAction(chatid, "upload_photo");
            response = await this.helper.image(msg.text!);
            await this.bot.sendPhoto(chatid, (response as google.imgReturn).img, {
              reply_markup: {
                inline_keyboard: [[{
                  text: temp.text("command.img.visit_page"),
                  url: (response as google.imgReturn).url,
                }, {
                  text: temp.text("command.img.view_image"),
                  url: (response as google.imgReturn).img,
                }],
                [{
                  text: temp.text("command.img.another"),
                  switch_inline_query_current_chat: "img " + msg.text,
                }]],
              },
              reply_to_message_id: msg.message_id,
            });
            this.logger.info("message: img, chatid: " + chatid +
            ", username: " + this.helper.getUser(msg.from!) +
            ", command: " + msg.text + ", type: success, response: search success");
          } catch (e) {
            await this.bot.sendChatAction(chatid, "typing");
            await this.bot.sendMessage(chatid, "❗️ " +
              temp.text("command.img.error")
              .replace(/{botid}/g, "@" + this.config.bot.username)
              .replace(/{keyword}/g, msg.text!), {
              reply_markup: {
                inline_keyboard: [[{
                  text: "@" + this.config.bot.username + " img " + msg.text,
                  switch_inline_query_current_chat: "img " + msg.text,
                }]],
              },
              reply_to_message_id: msg.message_id,
              parse_mode: "HTML"});
            this.logger.error("message: img, chatid: " + chatid +
              ", username: " + this.helper.getUser(msg.from!) +
              ", command: " + msg.text + ", type: error");
            this.logger.debug(e.stack);
          }
        }
      }
    } catch (e) {
      this.logger.error("message: img, chatid: " + chatid +
        ", username: " + this.helper.getUser(msg.from!) +
        ", command: " + msg.text + ", type: error");
      this.logger.debug(e.stack);
    }
  }
}
