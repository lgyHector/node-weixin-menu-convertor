var assert = require('assert');
var menu_data = require('./menu_data.json');
var convertor = require('../lib/convertor');

describe('node-weixin-menu-convertor', function(){
    before(function(done){
        done();
    })
    it('should convert an menu data to customized api menu json', function(done){
        var result = convertor.convert(menu_data);
        var new_menu_data = result.menuData;
        var pic_btn = new_menu_data.button[0].sub_button[0];
        var url_btn = new_menu_data.button[0].sub_button[1];
        var txt_btn = new_menu_data.button[0].sub_button[2];
        var pictxt_btn = new_menu_data.button[1];
        assert.equal(true,
            new_menu_data.button.length === menu_data.selfmenu_info.button.length,
            'main button number');
        assert.equal(true,
            new_menu_data.button[0].sub_button.length === menu_data.selfmenu_info.button[0].sub_button.list.length,
            'first button sub_button number');
        assert.equal(true, pic_btn.type === 'click', 'pic btn type is not click');
        assert.equal(true, /IMAGE_/.test(pic_btn.key), 'pic btn key is not IMAGE');

        assert.equal(true, url_btn.type === 'view', 'url btn type is not view');
        assert.equal(true, url_btn.url === menu_data.selfmenu_info.button[0].sub_button.list[1].url,
            'url btn url is wrong');

        assert.equal(true, txt_btn.type === 'click', 'text btn type is not click');
        assert.equal(true, /TEXT_/.test(txt_btn.key), 'text btn key is not TEXT');

        assert.equal(true, pictxt_btn.type === 'click', 'pictext btn type is not click');
        assert.equal(true, /NEWS_/.test(pictxt_btn.key), 'pictext btn key is not NEWS');

        done();
    })
})

