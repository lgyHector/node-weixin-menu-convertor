var fs = require('fs');
var json2xml = require('json2xml');
var randomString = require('random-string');

module.exports = {
    convert: function(data){
        var btnEventMap = {};
        var customizedMenu = {button:[]};
        var btns = data.selfmenu_info.button;
        btns.forEach(function(btn){
            if(btn.sub_button){
                var sub_btn_arr = [];
                btn.sub_button.list.forEach(function(sub_btn){
                    //TODO: 生成系統定義菜單xml
                    sub_btn_arr.push(buildCustomizedMenu(sub_btn, btnEventMap));
                })
                customizedMenu.button.push({
                    name: btn.name,
                    sub_button: sub_btn_arr
                })
            }else{
                customizedMenu.button.push(buildCustomizedMenu(btn, btnEventMap))
            }
        });
        return {
            eventMap: btnEventMap,
            menuData: customizedMenu
        }
    }
}
function buildCustomizedMenu(btn, btnEventMap){
    if(btn.type === 'view' || btn.type === 'click'){
        return btn;
    }
    if(btn.type === 'text'){
        var b = {
            type: 'click',
            name: btn.name,
            key: 'TEXT_'+ randomString({length: 8})
        }
        btnEventMap[b.key] = html_decode(json2xml({
            xml: {
                ToUserName: '<%=touser%>',
                FromUserName: '<%=fromuser%>',
                CreateTime: '<%=time%>',
                MsgType: 'text',
                Content: btn.value
            }
        }))
        return b;
    }
    if(btn.type === 'news'){
        var b = {
            type: 'click',
            name: btn.name,
            key: 'NEWS_'+ randomString({length: 8})
        }
        var arts = [];
        btn.news_info.list.forEach(function(art){
            arts.push({
                item: {
                    Title: art.title,
                    Description: art.digest,
                    PicUrl: art.cover_url,
                    Url: art.content_url
                }
            })
        })
        var main = {
            ToUserName: '<%=touser%>',
            FromUserName: '<%=fromuser%>',
            CreateTime: '<%=time%>',
            MsgType: 'news',
            ArticleCount: btn.news_info.list.length,
            Articles: arts
        }
        btnEventMap[b.key] = html_decode(json2xml({ xml: main }))
        return b;
    }
    if(btn.type === 'video'){
        var b = {
            type: 'click',
            name: btn.name,
            key: 'VIDEO_'+ randomString({length: 8})
        }
        btnEventMap[b.key] = html_decode(json2xml({
            xml: {
                ToUserName: '<%=touser%>',
                FromUserName: '<%=fromuser%>',
                CreateTime: '<%=time%>',
                MsgType: 'video',
                Video: {
                    MediaId: '',
                    Title: '',
                    Description: ''
                }
            }
        }))
        return b;
    }
    if(btn.type === 'voice'){
        var b = {
            type: 'click',
            name: btn.name,
            key: 'VOICE_'+ randomString({length: 8})
        }
        btnEventMap[b.key] = html_decode(json2xml({
            xml: {
                ToUserName: '<%=touser%>',
                FromUserName: '<%=fromuser%>',
                CreateTime: '<%=time%>',
                MsgType: 'voice',
                Voice: {
                    MediaId: ''
                }
            }
        }))
        return b;
    }
    if(btn.type === 'img'){
        var b = {
            type: 'click',
            name: btn.name,
            key: 'IMAGE_'+ randomString({length: 8})
        }
        btnEventMap[b.key] = html_decode(json2xml({
            xml: {
                ToUserName: '<%=touser%>',
                FromUserName: '<%=fromuser%>',
                CreateTime: '<%=time%>',
                MsgType: 'image',
                Image: {
                    MediaId: ''
                }
            }
        }))
        return b;
    }
}

function html_decode(str){
    var s = "";
    if (str.length == 0) return "";
    s = str//.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}