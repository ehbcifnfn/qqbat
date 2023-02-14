const send = require("./qqbat")
const sendmessage = require("./send")
const read = require("./aready")
const schedule_scheduleJob=require("./schedule_scheduleJob")
const getclass=require("./getCookie")
const group=require("./group")
const fs = require("fs")

//处理消息函数
exports.receive = (data) => {
    if (data.message_type === "undefined" || data.message === "undefined") {
        schedule_scheduleJob.schedule(data.user_id)
        return
    }
    //戳一戳
    if (data.post_type === "notice") {
        sendmessage.SendMessage("private", "[CQ:poke,qq=3096407768]", data.sender_id,)
    }
    if (data.message) {
        //已读消息
        read.read(data.message_id)
        if(data.message_type==="group"){
            group.groupsreceive(data)
            return;
        }
        let status = fs.readFileSync("status.txt").toString()
        let list = ["f", "img", "chat", "t", "y","h","w"]
        let model = true
        if (status) {
            while (model) {
                if (list.includes(data.message)) {
                    fs.writeFileSync("status.txt", data.message)
                    sendmessage.SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)
                }
                if (data.message === "y") {
                    fs.writeFileSync("status.txt", "")
                    sendmessage.SendMessage(data.message_type, "模式重置: ", data.user_id)

                    sendmessage.SendMessage("[CQ:at,qq=" + data.user_id + "]" + "\n" + "请选择：" + "\n" + "重置模式: (y)" + "\n" + "天气模式：(t 例：武汉的天气)" + "\n" + "聊天模式：(chat)" + "\n" + "图片模式: (img)" + "\n" + "今日新闻：(f) " + "\n" + "看抖音视频：(v)"+"\n" + "(y,t,chat,img 全局生效)\n", data.user_id)
                }
                break
            }
            status = fs.readFileSync("status.txt").toString()

            switch (status) {
                case "chat":
                    if (data.message === status) {
                        return;
                    }
                    send.QQcaht(data.message_type, data.user_id, data.message)
                    break
                case "t":
                    if (data.message === status) {
                        return;
                    }
                    let city = data.message.slice(0, data.message.indexOf("的"))
                    send.WeatherMessage(data.message_type, data.user_id, city)
                    break
                case "img":
                    if (data.message === status) {
                        return;
                    }
                    send.imgIs(data.message_type, data.user_id)
                    break
                case "f":
                    if (data.message === status) {
                        return;
                    }
                    send.hotmessage(data.message_type, data.user_id)
                    break
                case "h":
                    if (data.message === status) {
                        return;
                    }
                    schedule_scheduleJob.setTime(data.message_type,data.message,data.user_id)
                    break
                case "w":
                    if (data.message === status) {
                        return;
                    }
                    getclass.getCookie(data.message_type,data.message,data.user_id)
                    break
                // default:
                //     sendmessage.SendMessage(data.message_type,
                //         "模式已选择:" +
                //         "可选择 \n-->天气模式：(t),\n\-->聊天模式：(chat)\,\n-->图片模式: (img)\n模式更改"
                //         , data.user_id)
                //     break

            }
        } else {
            if (!list.includes(data.message)) {
                sendmessage.SendMessage(data.message_type, "[CQ:record,file=http://39.98.40.255:3000/img/1.mp3]", data.user_id)
                sendmessage.SendMessage(data.message_type, "输入的不对呦，靓仔", data.user_id)
                sendmessage.SendMessage(data.message_type, "[CQ:at,qq=" + data.user_id + "]" + "\n" + "请选择：" + "\n" + "重置模式: (y)" + "\n" + "天气模式：(t 例：武汉的天气)" + "\n" + "聊天模式：(chat)" + "\n" + "图片模式: (img)" + "\n" + "今日新闻：(f) " + "\n" + "消息推送：(h 例 12,4,3096407768,早早早) " +"\n" + "看抖音视频：(v)"+"\n" + "(y,t,chat,img 全局生效)\n"

                    , data.user_id)
                fs.writeFileSync("status.txt", "")
                return
            }

            if (data.message === "y") {
                sendmessage.SendMessage(data.message_type, "已处于重置模式", data.user_id)
                return
            }
            fs.writeFileSync("status.txt", data.message)
            sendmessage.SendMessage(data.message_type, "模式更改为: " + data.message, data.user_id)
            return

        }


    }


    console.log("消息类型：", data.message_type, "\n")
    console.log("接收ID：", data.target_id, "\n")
    console.log("消息内容：", data.message, "\n")
    console.log("发送人ID：", data.user_id, "\n")


}

